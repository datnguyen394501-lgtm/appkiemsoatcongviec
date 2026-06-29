import os
import sys
import json
import requests
from dotenv import load_dotenv

# Load credentials from .env
load_dotenv()

ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")
DATABASE_ID = os.getenv("CLOUDFLARE_D1_DATABASE_ID")
SCRIPT_NAME = "apeuni-d1-api"

if not ACCOUNT_ID or not API_TOKEN or not DATABASE_ID or API_TOKEN == "your_cloudflare_api_token_here":
    print("ERROR: Credentials are not fully set in the .env file.")
    sys.exit(1)

# Headers for Cloudflare API
headers = {
    "Authorization": f"Bearer {API_TOKEN}"
}

# 1. Fetch Account Subdomain
print("Fetching your workers.dev subdomain...")
subdomain_url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/workers/subdomain"
sub_res = requests.get(subdomain_url, headers=headers)
subdomain = None

if sub_res.status_code == 200:
    sub_data = sub_res.json()
    if sub_data.get("success"):
        subdomain = sub_data.get("result", {}).get("subdomain")
        print(f"Subdomain found: {subdomain}.workers.dev")
    else:
        print(f"WARNING: Could not fetch subdomain: {sub_data.get('errors')}")
else:
    print(f"WARNING: Subdomain API returned HTTP {sub_res.status_code}")

# 2. Worker Javascript Code
worker_js_code = """
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    if (!env.DB) {
      return new Response(JSON.stringify({ error: "D1 Binding 'DB' is missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    try {
      // 1. GET /api/stats
      if (path === "/api/stats" && request.method === "GET") {
        const result = await env.DB.prepare(
          "SELECT practiceCount, streak, highScore, lastActiveDate, studyTarget, checkedTasks FROM user_stats WHERE id = 1"
        ).first();

        if (result) {
          return new Response(JSON.stringify({
            practiceCount: result.practiceCount,
            streak: result.streak,
            highScore: result.highScore,
            lastActiveDate: result.lastActiveDate,
            studyTarget: result.studyTarget,
            checkedTasks: JSON.parse(result.checkedTasks || "{}")
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        
        return new Response(JSON.stringify({
          practiceCount: 0,
          streak: 1,
          highScore: 0,
          lastActiveDate: new Date().toDateString(),
          studyTarget: "65",
          checkedTasks: {}
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 2. POST /api/stats
      if (path === "/api/stats" && request.method === "POST") {
        const body = await request.json();
        await env.DB.prepare(
          "INSERT OR REPLACE INTO user_stats (id, practiceCount, streak, highScore, lastActiveDate, studyTarget, checkedTasks) VALUES (1, ?, ?, ?, ?, ?, ?)"
        ).bind(
          body.practiceCount || 0,
          body.streak || 1,
          body.highScore || 0,
          body.lastActiveDate || "",
          body.studyTarget || "65",
          JSON.stringify(body.checkedTasks || {})
        ).run();

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 3. GET /api/history
      if (path === "/api/history" && request.method === "GET") {
        const { results } = await env.DB.prepare(
          "SELECT id, qType, title, score, details, date FROM practice_history ORDER BY id DESC LIMIT 50"
        ).all();

        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 4. POST /api/history
      if (path === "/api/history" && request.method === "POST") {
        const body = await request.json();
        await env.DB.prepare(
          "INSERT OR REPLACE INTO practice_history (id, qType, title, score, details, date) VALUES (?, ?, ?, ?, ?, ?)"
        ).bind(
          body.id,
          body.qType,
          body.title,
          body.score,
          body.details || "",
          body.date
        ).run();

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 5. GET /api/status
      if (path === "/api/status" && request.method === "GET") {
        return new Response(JSON.stringify({
          status: "online",
          mode: "Cloudflare Workers",
          configured: true
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response("Not Found", { status: 404 });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
"""

# 3. Upload Worker Script
deploy_url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/workers/scripts/{SCRIPT_NAME}"

metadata = {
    "main_module": "worker.js",
    "bindings": [
        {
            "type": "d1",
            "name": "DB",
            "id": DATABASE_ID
        }
    ],
    "compatibility_date": "2026-06-29"
}

files = {
    "metadata": (None, json.dumps(metadata), "application/json"),
    "worker.js": ("worker.js", worker_js_code, "application/javascript+module")
}

print(f"Uploading script '{SCRIPT_NAME}' to Cloudflare...")
upload_res = requests.put(deploy_url, headers=headers, files=files)

if upload_res.status_code != 200:
    print(f"ERROR: Upload failed (HTTP {upload_res.status_code}): {upload_res.text}")
    sys.exit(1)

upload_data = upload_res.json()
if not upload_data.get("success"):
    print(f"ERROR: Cloudflare rejected script: {upload_data.get('errors')}")
    sys.exit(1)

print("Worker script uploaded successfully.")

# 4. Enable Subdomain Route (workers.dev)
print("Enabling workers.dev subdomain route...")
subdomain_enable_url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/workers/scripts/{SCRIPT_NAME}/subdomain"
sub_enable_res = requests.post(subdomain_enable_url, headers=headers, json={"enabled": True})

if sub_enable_res.status_code == 200:
    sub_enable_data = sub_enable_res.json()
    if sub_enable_data.get("success"):
        print("workers.dev subdomain route enabled successfully!")
        if subdomain:
            live_url = f"https://{SCRIPT_NAME}.{subdomain}.workers.dev"
            print("=" * 60)
            print("DEPLOYMENT SUCCESSFUL!")
            print(f"Your live serverless API is now running at:")
            print(f"  {live_url}")
            print("=" * 60)
            # Write live URL to a temporary output file so the agent can read it
            with open("backend/live_worker_url.txt", "w") as f:
                f.write(live_url)
        else:
            print("Worker deployed, but subdomain name was not found. Please check your Cloudflare Dashboard.")
    else:
        print(f"ERROR enabling subdomain route: {sub_enable_data.get('errors')}")
        sys.exit(1)
else:
    print(f"ERROR: Subdomain route API returned HTTP {sub_enable_res.status_code}: {sub_enable_res.text}")
    sys.exit(1)
