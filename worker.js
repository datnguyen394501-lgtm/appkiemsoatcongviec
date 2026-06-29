const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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
      // --- Auto-Initialize Database Schema ---
      if (path === "/api/projects" && request.method === "GET") {
        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS projects (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              description TEXT,
              color TEXT DEFAULT '#2563eb',
              created_at TEXT NOT NULL
          );
        `).run();
        
        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS tasks (
              id TEXT PRIMARY KEY,
              project_id TEXT,
              title TEXT NOT NULL,
              description TEXT,
              due_date TEXT,
              is_completed INTEGER DEFAULT 0,
              priority TEXT DEFAULT 'medium',
              created_at TEXT NOT NULL,
              FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
          );
        `).run();
        
        // Seed default data if empty
        const checkProject = await env.DB.prepare("SELECT id FROM projects LIMIT 1").first();
        if (!checkProject) {
          const nowStr = new Date().toISOString();
          await env.DB.prepare(`
            INSERT INTO projects (id, name, description, color, created_at)
            VALUES ('inbox', 'Hộp thư đến', 'Dự án mặc định cho các công việc chưa phân loại', '#64748b', ?)
          `).bind(nowStr).run();
          
          const todayStr = new Date().toISOString().split('T')[0];
          await env.DB.prepare(`
            INSERT INTO tasks (id, project_id, title, description, due_date, is_completed, priority, created_at)
            VALUES ('welcome-task', 'inbox', 'Chào mừng bạn đến với App Kiểm Soát Công Việc!', 
            'Đây là một công việc mẫu. Bạn có thể bấm vào nút tròn bên cạnh để đánh dấu hoàn thành, hoặc bấm vào icon thùng rác để xóa công việc này.', 
            ?, 0, 'low', ?)
          `).bind(todayStr, nowStr).run();
        }

        // Fetch and return projects
        const { results } = await env.DB.prepare(
          "SELECT id, name, description, color, created_at FROM projects ORDER BY created_at ASC"
        ).all();

        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      if (path === "/api/projects" && request.method === "POST") {
        const body = await request.json();
        const created_at = body.created_at || new Date().toISOString();
        
        await env.DB.prepare(
          "INSERT OR REPLACE INTO projects (id, name, description, color, created_at) VALUES (?, ?, ?, ?, ?)"
        ).bind(
          body.id,
          body.name,
          body.description || "",
          body.color || "#2563eb",
          created_at
        ).run();

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // Handle project delete (along with tasks inside it)
      const projectDeleteRegex = /^\/api\/projects\/([^\/]+)$/;
      if (projectDeleteRegex.test(path) && request.method === "DELETE") {
        const matches = path.match(projectDeleteRegex);
        const projectId = matches[1];

        if (projectId === "inbox") {
          return new Response(JSON.stringify({ error: "Cannot delete the default Inbox project" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        // Manual cascade delete tasks under the project
        await env.DB.prepare("DELETE FROM tasks WHERE project_id = ?").bind(projectId).run();
        await env.DB.prepare("DELETE FROM projects WHERE id = ?").bind(projectId).run();

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // --- TASKS ENDPOINTS ---
      if (path === "/api/tasks" && request.method === "GET") {
        const { results } = await env.DB.prepare(
          "SELECT id, project_id, title, description, due_date, is_completed, priority, created_at FROM tasks ORDER BY due_date ASC, created_at DESC"
        ).all();

        // Convert is_completed to boolean
        const formattedResults = results.map(r => ({
          ...r,
          is_completed: Boolean(r.is_completed)
        }));

        return new Response(JSON.stringify(formattedResults), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      if (path === "/api/tasks" && request.method === "POST") {
        const body = await request.json();
        const created_at = body.created_at || new Date().toISOString();
        const is_completed = body.is_completed ? 1 : 0;
        
        await env.DB.prepare(
          "INSERT OR REPLACE INTO tasks (id, project_id, title, description, due_date, is_completed, priority, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(
          body.id,
          body.project_id || "inbox",
          body.title,
          body.description || "",
          body.due_date || "",
          is_completed,
          body.priority || "medium",
          created_at
        ).run();

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      if (path === "/api/tasks/toggle" && request.method === "POST") {
        const body = await request.json();
        const is_completed = body.is_completed ? 1 : 0;
        
        await env.DB.prepare("UPDATE tasks SET is_completed = ? WHERE id = ?")
          .bind(is_completed, body.id)
          .run();

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const taskDeleteRegex = /^\/api\/tasks\/([^\/]+)$/;
      if (taskDeleteRegex.test(path) && request.method === "DELETE") {
        const matches = path.match(taskDeleteRegex);
        const taskId = matches[1];

        await env.DB.prepare("DELETE FROM tasks WHERE id = ?").bind(taskId).run();

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

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
