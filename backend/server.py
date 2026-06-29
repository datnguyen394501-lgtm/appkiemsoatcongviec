import os
import sqlite3
import json
from datetime import datetime
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Cloudflare Configuration
ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")
DATABASE_ID = os.getenv("CLOUDFLARE_D1_DATABASE_ID")

# Check if we should use local SQLite mock mode
IS_CONFIGURED = (
    ACCOUNT_ID 
    and API_TOKEN 
    and DATABASE_ID 
    and API_TOKEN != "your_cloudflare_api_token_here" 
    and DATABASE_ID != "your_d1_database_id_here"
)

LOCAL_DB_FILE = os.path.join(os.path.dirname(__file__), "local_d1_mock.db")

print("=" * 60)
if IS_CONFIGURED:
    print(f"Cloudflare D1 Mode Active:")
    print(f"  Account ID : {ACCOUNT_ID}")
    print(f"  Database ID: {DATABASE_ID}")
else:
    print("Cloudflare D1 Credentials not fully configured in .env.")
    print(f"Running in LOCAL MOCK MODE using SQLite database at:\n  {LOCAL_DB_FILE}")
    print("To sync with Cloudflare, update the credentials in your .env file.")
print("=" * 60)

def run_local_query(sql, params=[]):
    """Executes a query against the local SQLite database."""
    conn = sqlite3.connect(LOCAL_DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    try:
        cursor.execute(sql, params)
        conn.commit()
        if cursor.description:
            columns = [col[0] for col in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]
        return []
    finally:
        conn.close()

def run_cloudflare_query(sql, params=[]):
    """Executes a query against Cloudflare D1 REST API."""
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/d1/database/{DATABASE_ID}/query"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    # Cloudflare expects types matching standard sqlite
    # Ensure parameter types are JSON serializable
    serializable_params = []
    for p in params:
        if isinstance(p, (dict, list)):
            serializable_params.append(json.dumps(p))
        else:
            serializable_params.append(p)

    payload = {
        "sql": sql,
        "params": serializable_params
    }
    
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code != 200:
        raise Exception(f"Cloudflare API Error ({response.status_code}): {response.text}")
        
    data = response.json()
    if not data.get("success"):
        errors = data.get("errors", [])
        error_msg = "; ".join([e.get("message", "") for e in errors])
        raise Exception(f"Cloudflare D1 Query Failed: {error_msg}")
        
    result_list = data.get("result", [])
    if result_list and result_list[0].get("success"):
        # D1 returns results as list of dicts: [{'column': value}, ...]
        return result_list[0].get("results", [])
    return []

def execute_query(sql, params=[]):
    """Router function to execute query locally or on Cloudflare D1."""
    if IS_CONFIGURED:
        return run_cloudflare_query(sql, params)
    else:
        return run_local_query(sql, params)

def init_database():
    """Initializes schema and seeds default data on startup."""
    print("Initializing database schema...")
    try:
        # 1. Create user_stats table
        execute_query("""
            CREATE TABLE IF NOT EXISTS user_stats (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                practiceCount INTEGER DEFAULT 0,
                streak INTEGER DEFAULT 1,
                highScore INTEGER DEFAULT 0,
                lastActiveDate TEXT,
                studyTarget TEXT DEFAULT '65',
                checkedTasks TEXT DEFAULT '{}'
            );
        """)
        
        # 2. Create practice_history table
        execute_query("""
            CREATE TABLE IF NOT EXISTS practice_history (
                id TEXT PRIMARY KEY,
                qType TEXT NOT NULL,
                title TEXT NOT NULL,
                score INTEGER NOT NULL,
                details TEXT,
                date TEXT NOT NULL
            );
        """)
        
        # 3. Seed default user_stats row if empty
        check_row = execute_query("SELECT id FROM user_stats WHERE id = 1")
        if not check_row:
            print("Seeding initial user stats row...")
            today_str = datetime.now().strftime("%a %b %d %Y") # Format like 'Mon Jun 29 2026'
            execute_query("""
                INSERT INTO user_stats (id, practiceCount, streak, highScore, lastActiveDate, studyTarget, checkedTasks)
                VALUES (1, 0, 1, 0, ?, '65', '{}')
            """, [today_str])
            
        print("Database schema verified and ready.")
    except Exception as e:
        print(f"CRITICAL: Failed to initialize database: {e}")

# Run DB initialization
init_database()

@app.route("/api/status", methods=["GET"])
def get_status():
    return jsonify({
        "status": "online",
        "mode": "Cloudflare D1" if IS_CONFIGURED else "Local Mock (SQLite)",
        "configured": IS_CONFIGURED,
        "databaseId": DATABASE_ID if IS_CONFIGURED else "local_d1_mock.db"
    })

@app.route("/api/stats", methods=["GET"])
def get_stats():
    try:
        rows = execute_query("SELECT practiceCount, streak, highScore, lastActiveDate, studyTarget, checkedTasks FROM user_stats WHERE id = 1")
        if rows:
            row = rows[0]
            # Safely parse checkedTasks JSON string
            checked_tasks = {}
            if row.get("checkedTasks"):
                try:
                    checked_tasks = json.loads(row["checkedTasks"])
                except Exception:
                    checked_tasks = {}
            
            return jsonify({
                "practiceCount": int(row.get("practiceCount", 0)),
                "streak": int(row.get("streak", 1)),
                "highScore": int(row.get("highScore", 0)),
                "lastActiveDate": row.get("lastActiveDate"),
                "studyTarget": row.get("studyTarget", "65"),
                "checkedTasks": checked_tasks
            })
        
        # Fallback default
        return jsonify({
            "practiceCount": 0,
            "streak": 1,
            "highScore": 0,
            "lastActiveDate": datetime.now().strftime("%a %b %d %Y"),
            "studyTarget": "65",
            "checkedTasks": {}
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/stats", methods=["POST"])
def update_stats():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON payload provided"}), 400
            
        # Extract fields
        practiceCount = data.get("practiceCount", 0)
        streak = data.get("streak", 1)
        highScore = data.get("highScore", 0)
        lastActiveDate = data.get("lastActiveDate")
        studyTarget = data.get("studyTarget", "65")
        checkedTasks = data.get("checkedTasks", {})
        
        # Serialize checkedTasks
        checked_tasks_str = json.dumps(checkedTasks)
        
        # Write to DB using REPLACE INTO to update id=1
        execute_query("""
            REPLACE INTO user_stats (id, practiceCount, streak, highScore, lastActiveDate, studyTarget, checkedTasks)
            VALUES (1, ?, ?, ?, ?, ?, ?)
        """, [practiceCount, streak, highScore, lastActiveDate, studyTarget, checked_tasks_str])
        
        return jsonify({"success": True, "message": "Stats updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/history", methods=["GET"])
def get_history():
    try:
        # Fetch last 50 logs, ordered by ID desc (timestamp desc)
        rows = execute_query("SELECT id, qType, title, score, details, date FROM practice_history ORDER BY id DESC LIMIT 50")
        history_list = []
        for r in rows:
            history_list.append({
                "id": r.get("id"),
                "qType": r.get("qType"),
                "title": r.get("title"),
                "score": int(r.get("score", 0)),
                "details": r.get("details", ""),
                "date": r.get("date")
            })
        return jsonify(history_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/history", methods=["POST"])
def add_history():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON payload provided"}), 400
            
        id_val = data.get("id")
        qType = data.get("qType")
        title = data.get("title")
        score = data.get("score")
        details = data.get("details", "")
        date = data.get("date")
        
        if not id_val or not qType or not title or score is None or not date:
            return jsonify({"error": "Missing required fields in payload"}), 400
            
        execute_query("""
            INSERT OR REPLACE INTO practice_history (id, qType, title, score, details, date)
            VALUES (?, ?, ?, ?, ?, ?)
        """, [id_val, qType, title, score, details, date])
        
        return jsonify({"success": True, "message": "History entry added successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    app.run(host="127.0.0.1", port=port, debug=True)
