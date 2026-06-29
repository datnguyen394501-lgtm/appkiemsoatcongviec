// TaskFlow - Frontend Application Coordinator
(function() {
    const BACKEND_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
        ? "http://127.0.0.1:5001"
        : "https://appkiemsoatcongviec1.datnguyen394501.workers.dev";
    
    // In-memory data cache
    let tasks = [];
    let projects = [];
    
    // UI State
    let currentFilter = "all"; // "today", "all", "important", "completed", or a project ID
    let hideCompleted = true;
    let searchQuery = "";
    let sortCriteria = "created_at"; // "created_at", "due_date", "priority"

    // DOM Elements Cache
    const currentViewTitle = document.getElementById("current-view-title");
    const currentViewDate = document.getElementById("current-view-date");
    const dbStatusDot = document.getElementById("db-status-dot");
    const dbStatusText = document.getElementById("db-status-text");
    
    const countToday = document.getElementById("count-today");
    const countAll = document.getElementById("count-all");
    const countImportant = document.getElementById("count-important");
    const countCompleted = document.getElementById("count-completed");
    
    const sidebarProjectsList = document.getElementById("sidebar-projects-list");
    const selectTaskProject = document.getElementById("task-project");
    const selectEditTaskProject = document.getElementById("edit-task-project");
    const tasksListItems = document.getElementById("tasks-list-items");
    const tasksListTitle = document.getElementById("tasks-list-title");
    
    // Stats elements
    const statCompleted = document.getElementById("stat-completed");
    const statPending = document.getElementById("stat-pending");
    const statOverdue = document.getElementById("stat-overdue");
    const progressBarFill = document.getElementById("progress-bar-fill");
    const progressPercentLabel = document.getElementById("progress-percentage-label");

    // Modal elements (New Project)
    const projectModal = document.getElementById("project-modal");
    const btnOpenProjectModal = document.getElementById("btn-open-project-modal");
    const btnCloseProjectModal = document.getElementById("btn-close-project-modal");
    const addProjectForm = document.getElementById("add-project-form");
    const projectColorPicker = document.getElementById("project-color-picker");

    // Modal elements (Edit Task)
    const editTaskModal = document.getElementById("edit-task-modal");
    const btnCloseEditModal = document.getElementById("btn-close-edit-modal");
    const editTaskForm = document.getElementById("edit-task-form");

    // Search and Sort controls
    const taskSearchInput = document.getElementById("task-search-input");
    const taskSortSelect = document.getElementById("task-sort-select");

    // Forms and filters
    const addTaskForm = document.getElementById("add-task-form");
    const btnHideCompleted = document.getElementById("btn-hide-completed");

    // Initialize Web Application
    function init() {
        setupDateHeader();
        setupEventListeners();
        setupColorPicker();
        
        // Initial render from local storage (instant visual feedback)
        loadFromLocalStorage();
        renderUI();
        
        // Fetch fresh data from backend
        fetchData();
    }

    function setupDateHeader() {
        if (currentViewDate) {
            const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
            const today = new Date();
            currentViewDate.textContent = today.toLocaleDateString('vi-VN', options);
        }
    }

    // --- CONNECTION BADGE STATUS MANAGER ---
    function updateStatusBadge(status, modeText = "") {
        if (!dbStatusDot || !dbStatusText) return;

        if (status === "syncing") {
            dbStatusDot.style.background = "#3b82f6";
            dbStatusDot.style.boxShadow = "0 0 8px #3b82f6";
            dbStatusText.textContent = "Đang đồng bộ...";
        } else if (status === "online") {
            dbStatusDot.style.background = "#10b981";
            dbStatusDot.style.boxShadow = "0 0 8px #10b981";
            dbStatusText.textContent = modeText || "Cloudflare D1";
        } else if (status === "local") {
            dbStatusDot.style.background = "#8b5cf6";
            dbStatusDot.style.boxShadow = "0 0 8px #8b5cf6";
            dbStatusText.textContent = modeText || "Local DB Active";
        } else {
            dbStatusDot.style.background = "#f59e0b";
            dbStatusDot.style.boxShadow = "0 0 8px #f59e0b";
            dbStatusText.textContent = "Offline Mode";
        }
    }

    // --- DATABASE API CALLS ---
    async function fetchData() {
        updateStatusBadge("syncing");
        try {
            // Check Server Status
            const statusRes = await fetch(`${BACKEND_URL}/api/status`);
            if (!statusRes.ok) throw new Error("Server unreachable");
            const statusData = await statusRes.json();

            // Fetch Projects
            const projectsRes = await fetch(`${BACKEND_URL}/api/projects`);
            if (!projectsRes.ok) throw new Error("Failed to fetch projects");
            projects = await projectsRes.json();

            // Fetch Tasks
            const tasksRes = await fetch(`${BACKEND_URL}/api/tasks`);
            if (!tasksRes.ok) throw new Error("Failed to fetch tasks");
            tasks = await tasksRes.json();

            // Update local backup
            saveToLocalStorage();
            
            // Set Connection Badge
            if (statusData.configured) {
                updateStatusBadge("online", "Cloudflare D1");
            } else {
                updateStatusBadge("local", "Local DB Active");
            }

            renderUI();
        } catch (error) {
            console.warn("Backend API offline. Running in offline localStorage mode.", error);
            updateStatusBadge("offline");
        }
    }

    function saveToLocalStorage() {
        localStorage.setItem("tf_tasks", JSON.stringify(tasks));
        localStorage.setItem("tf_projects", JSON.stringify(projects));
    }

    function loadFromLocalStorage() {
        const localTasks = localStorage.getItem("tf_tasks");
        const localProjects = localStorage.getItem("tf_projects");
        
        if (localTasks) tasks = JSON.parse(localTasks);
        if (localProjects) projects = JSON.parse(localProjects);
        
        // Seed default local data if storage is empty
        if (projects.length === 0) {
            projects = [{
                id: "inbox",
                name: "Hộp thư đến",
                description: "Dự án mặc định cho các công việc chưa phân loại",
                color: "#64748b",
                created_at: new Date().toISOString()
            }];
            tasks = [{
                id: "welcome-task",
                project_id: "inbox",
                title: "Chào mừng bạn đến với App Kiểm Soát Công Việc!",
                description: "Đây là một công việc mẫu. Bạn có thể bấm vào nút tròn bên cạnh để đánh dấu hoàn thành, hoặc bấm vào icon thùng rác để xóa công việc này.",
                due_date: new Date().toISOString().split('T')[0],
                is_completed: false,
                priority: "low",
                created_at: new Date().toISOString()
            }];
            saveToLocalStorage();
        }
    }

    // --- EVENTS ROUTING & BINDING ---
    function setupEventListeners() {
        // Sidebar Navigation click router
        const navButtons = document.querySelectorAll(".sidebar-nav .nav-item");
        navButtons.forEach(btn => {
            btn.addEventListener("click", function() {
                navButtons.forEach(b => b.classList.remove("active"));
                // Remove project active highlight if switching to main categories
                const projectBtns = document.querySelectorAll(".project-item");
                projectBtns.forEach(p => p.classList.remove("active"));
                
                this.classList.add("active");
                currentFilter = this.dataset.filter;
                
                // Update Title
                currentViewTitle.textContent = this.querySelector("span").textContent;
                renderUI();
            });
        });

        // Hide/Show completed filter button toggle
        if (btnHideCompleted) {
            btnHideCompleted.addEventListener("click", function() {
                hideCompleted = !hideCompleted;
                this.classList.toggle("active", hideCompleted);
                this.textContent = hideCompleted ? "Ẩn đã xong" : "Hiện tất cả";
                renderUI();
            });
        }

        // Search Input handler
        if (taskSearchInput) {
            taskSearchInput.addEventListener("input", function() {
                searchQuery = this.value.toLowerCase().trim();
                renderTasks();
            });
        }

        // Sort Select dropdown handler
        if (taskSortSelect) {
            taskSortSelect.addEventListener("change", function() {
                sortCriteria = this.value;
                renderTasks();
            });
        }

        // Add task form submission
        if (addTaskForm) {
            addTaskForm.addEventListener("submit", handleAddTask);
        }

        // Modal triggers (New Project)
        if (btnOpenProjectModal && projectModal) {
            btnOpenProjectModal.addEventListener("click", () => projectModal.classList.remove("hidden"));
        }
        if (btnCloseProjectModal && projectModal) {
            btnCloseProjectModal.addEventListener("click", () => projectModal.classList.add("hidden"));
        }
        if (projectModal) {
            projectModal.addEventListener("click", (e) => {
                if (e.target === projectModal) projectModal.classList.add("hidden");
            });
        }
        if (addProjectForm) {
            addProjectForm.addEventListener("submit", handleAddProject);
        }

        // Modal triggers (Edit Task)
        if (btnCloseEditModal && editTaskModal) {
            btnCloseEditModal.addEventListener("click", () => editTaskModal.classList.add("hidden"));
        }
        if (editTaskModal) {
            editTaskModal.addEventListener("click", (e) => {
                if (e.target === editTaskModal) editTaskModal.classList.add("hidden");
            });
        }
        if (editTaskForm) {
            editTaskForm.addEventListener("submit", handleEditTaskSubmit);
        }
    }

    function setupColorPicker() {
        if (!projectColorPicker) return;
        const colorDots = projectColorPicker.querySelectorAll(".color-dot");
        colorDots.forEach(dot => {
            dot.addEventListener("click", function() {
                colorDots.forEach(d => d.classList.remove("active"));
                this.classList.add("active");
            });
        });
    }

    // --- SUBMISSION HANDLERS ---
    async function handleAddTask(e) {
        e.preventDefault();
        
        const titleInput = document.getElementById("task-title-input");
        const descInput = document.getElementById("task-desc-input");
        const dateInput = document.getElementById("task-due-date");
        const priorityInput = document.getElementById("task-priority");
        const projectInput = document.getElementById("task-project");
        
        if (!titleInput.value.trim()) return;

        const newTask = {
            id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            project_id: projectInput.value,
            title: titleInput.value.trim(),
            description: descInput.value.trim(),
            due_date: dateInput.value || (currentFilter === "today" ? new Date().toISOString().split('T')[0] : ""),
            is_completed: false,
            priority: priorityInput.value,
            created_at: new Date().toISOString()
        };

        // Update local cache & render instantly
        tasks.unshift(newTask);
        saveToLocalStorage();
        renderUI();

        // Reset Form
        titleInput.value = "";
        descInput.value = "";
        dateInput.value = "";
        priorityInput.value = "medium";
        
        // Sync to D1
        try {
            const res = await fetch(`${BACKEND_URL}/api/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask)
            });
            if (!res.ok) throw new Error("Failed to save to database");
            fetchData(); // pull fresh stats
        } catch (err) {
            console.warn("Could not sync new task to Cloudflare D1", err);
            updateStatusBadge("offline");
        }
    }

    async function handleAddProject(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById("project-name-input");
        const descInput = document.getElementById("project-desc-input");
        const activeColorDot = projectColorPicker.querySelector(".color-dot.active");
        const color = activeColorDot ? activeColorDot.dataset.color : "#2563eb";

        if (!nameInput.value.trim()) return;

        const newProject = {
            id: 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            name: nameInput.value.trim(),
            description: descInput.value.trim(),
            color: color,
            created_at: new Date().toISOString()
        };

        // Update local cache
        projects.push(newProject);
        saveToLocalStorage();
        
        // Close modal and reset form
        projectModal.classList.add("hidden");
        nameInput.value = "";
        descInput.value = "";
        
        renderUI();

        // Sync to D1
        try {
            const res = await fetch(`${BACKEND_URL}/api/projects`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProject)
            });
            if (!res.ok) throw new Error("Failed to save project to database");
            fetchData();
        } catch (err) {
            console.warn("Could not sync new project to Cloudflare D1", err);
            updateStatusBadge("offline");
        }
    }

    async function handleToggleTask(taskId, isChecked) {
        // Toggle in-memory
        tasks = tasks.map(t => {
            if (t.id === taskId) {
                return { ...t, is_completed: isChecked };
            }
            return t;
        });
        saveToLocalStorage();
        renderUI();

        // Sync to D1
        try {
            const res = await fetch(`${BACKEND_URL}/api/tasks/toggle`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: taskId, is_completed: isChecked })
            });
            if (!res.ok) throw new Error("Failed to update task state");
            fetchData();
        } catch (err) {
            console.warn("Could not sync task toggle to Cloudflare D1", err);
            updateStatusBadge("offline");
        }
    }

    async function handleDeleteTask(taskId) {
        if (!confirm("Bạn chắc chắn muốn xóa công việc này?")) return;

        // Remove from local cache
        tasks = tasks.filter(t => t.id !== taskId);
        saveToLocalStorage();
        renderUI();

        // Sync to D1
        try {
            const res = await fetch(`${BACKEND_URL}/api/tasks/${taskId}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Failed to delete task");
            fetchData();
        } catch (err) {
            console.warn("Could not sync task deletion to Cloudflare D1", err);
            updateStatusBadge("offline");
        }
    }

    async function handleDeleteProject(projectId, projectName) {
        if (!confirm(`Xóa dự án "${projectName}" sẽ xóa toàn bộ công việc bên trong dự án này. Bạn chắc chắn muốn xóa chứ?`)) return;

        // Remove from local cache
        projects = projects.filter(p => p.id !== projectId);
        tasks = tasks.filter(t => t.project_id !== projectId);
        saveToLocalStorage();
        
        // If the active filter was the deleted project, fallback to Today
        if (currentFilter === projectId) {
            currentFilter = "today";
            currentViewTitle.textContent = "Hôm nay";
            const navButtons = document.querySelectorAll(".sidebar-nav .nav-item");
            navButtons.forEach(btn => {
                if (btn.dataset.filter === "today") btn.classList.add("active");
                else btn.classList.remove("active");
            });
        }

        renderUI();

        // Sync to D1
        try {
            const res = await fetch(`${BACKEND_URL}/api/projects/${projectId}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Failed to delete project");
            fetchData();
        } catch (err) {
            console.warn("Could not sync project deletion to Cloudflare D1", err);
            updateStatusBadge("offline");
        }
    }

    // --- TASK EDITING MODAL INITIATORS ---
    function openEditModal(task) {
        if (!editTaskModal) return;

        document.getElementById("edit-task-id").value = task.id;
        document.getElementById("edit-task-title").value = task.title;
        document.getElementById("edit-task-desc").value = task.description || "";
        document.getElementById("edit-task-due-date").value = task.due_date || "";
        document.getElementById("edit-task-priority").value = task.priority || "medium";
        
        // Populate edit project select dropdown
        if (selectEditTaskProject) {
            selectEditTaskProject.innerHTML = "";
            projects.forEach(p => {
                const opt = document.createElement("option");
                opt.value = p.id;
                opt.textContent = p.name;
                selectEditTaskProject.appendChild(opt);
            });
            selectEditTaskProject.value = task.project_id || "inbox";
        }

        editTaskModal.classList.remove("hidden");
    }

    async function handleEditTaskSubmit(e) {
        e.preventDefault();

        const id = document.getElementById("edit-task-id").value;
        const title = document.getElementById("edit-task-title").value.trim();
        const description = document.getElementById("edit-task-desc").value.trim();
        const due_date = document.getElementById("edit-task-due-date").value;
        const priority = document.getElementById("edit-task-priority").value;
        const project_id = document.getElementById("edit-task-project").value;

        if (!title) return;

        // Find existing task in cache
        const originalTask = tasks.find(t => t.id === id);
        if (!originalTask) return;

        const updatedTask = {
            ...originalTask,
            title: title,
            description: description,
            due_date: due_date,
            priority: priority,
            project_id: project_id
        };

        // Update in-memory
        tasks = tasks.map(t => t.id === id ? updatedTask : t);
        saveToLocalStorage();
        renderUI();

        // Close modal
        editTaskModal.classList.add("hidden");

        // Sync to D1
        try {
            const res = await fetch(`${BACKEND_URL}/api/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedTask)
            });
            if (!res.ok) throw new Error("Failed to save edited task");
            fetchData();
        } catch (err) {
            console.warn("Could not sync task modifications to Cloudflare D1", err);
            updateStatusBadge("offline");
        }
    }

    // --- DOM RENDERING UTILS ---
    
    function getTaskFilterCallback() {
        const todayStr = new Date().toISOString().split('T')[0];
        
        switch (currentFilter) {
            case "today":
                return t => t.due_date === todayStr;
            case "all":
                return t => true;
            case "important":
                return t => t.priority === "high";
            case "completed":
                return t => t.is_completed === true;
            default:
                // Filter by specific project id
                return t => t.project_id === currentFilter;
        }
    }

    function renderUI() {
        renderSidebarProjects();
        renderProjectOptions();
        renderTasks();
        renderSidebarCounts();
    }

    function renderSidebarProjects() {
        if (!sidebarProjectsList) return;
        sidebarProjectsList.innerHTML = "";
        
        projects.forEach(p => {
            const isInbox = p.id === "inbox";
            
            // Calculate active (uncompleted) task count for this project
            const activeCount = tasks.filter(t => t.project_id === p.id && !t.is_completed).length;

            const btn = document.createElement("button");
            btn.className = `project-item ${currentFilter === p.id ? 'active' : ''}`;
            btn.dataset.id = p.id;
            
            btn.innerHTML = `
                <div class="project-item-left">
                    <span class="project-color-dot" style="background: ${p.color};"></span>
                    <span>${p.name}</span>
                    <span class="project-count-badge">${activeCount}</span>
                </div>
                ${!isInbox ? `
                <div class="project-item-actions">
                    <button class="btn-project-delete" data-id="${p.id}" data-name="${p.name}" title="Xóa dự án">
                        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                </div>` : ''}
            `;

            // Click listener for project switching
            btn.addEventListener("click", function(e) {
                if (e.target.closest(".btn-project-delete")) return;

                const navButtons = document.querySelectorAll(".sidebar-nav .nav-item");
                navButtons.forEach(b => b.classList.remove("active"));
                
                const projectBtns = document.querySelectorAll(".project-item");
                projectBtns.forEach(pBtn => pBtn.classList.remove("active"));
                this.classList.add("active");
                
                currentFilter = p.id;
                currentViewTitle.textContent = p.name;
                renderUI();
            });

            // Delete project button listener
            if (!isInbox) {
                const delBtn = btn.querySelector(".btn-project-delete");
                delBtn.addEventListener("click", function() {
                    handleDeleteProject(this.dataset.id, this.dataset.name);
                });
            }

            sidebarProjectsList.appendChild(btn);
        });
    }

    function renderProjectOptions() {
        if (!selectTaskProject) return;
        
        const currentSel = selectTaskProject.value;
        selectTaskProject.innerHTML = "";
        
        projects.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = p.name;
            selectTaskProject.appendChild(opt);
        });
        
        if (projects.some(p => p.id === currentSel)) {
            selectTaskProject.value = currentSel;
        } else {
            selectTaskProject.value = "inbox";
        }
    }

    function renderTasks() {
        if (!tasksListItems) return;
        tasksListItems.innerHTML = "";
        
        const filterFn = getTaskFilterCallback();
        let filteredTasks = tasks.filter(filterFn);

        // Calculate progress metrics on active list (before hiding completed tasks or filtering by search)
        const totalCount = filteredTasks.length;
        const completedCount = filteredTasks.filter(t => t.is_completed).length;
        const pendingCount = totalCount - completedCount;
        
        const todayStr = new Date().toISOString().split('T')[0];
        const overdueCount = filteredTasks.filter(t => !t.is_completed && t.due_date && t.due_date < todayStr).length;

        // Render Overview Banner
        statCompleted.textContent = completedCount;
        statPending.textContent = pendingCount;
        statOverdue.textContent = overdueCount;
        
        const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        progressBarFill.style.width = `${completionRate}%`;
        progressPercentLabel.textContent = `Đã hoàn thành ${completionRate}%`;

        // Apply search query filter if typed
        if (searchQuery) {
            filteredTasks = filteredTasks.filter(t => 
                t.title.toLowerCase().includes(searchQuery) || 
                (t.description && t.description.toLowerCase().includes(searchQuery))
            );
        }

        // Apply sorting criteria
        if (sortCriteria === "due_date") {
            filteredTasks.sort((a, b) => {
                if (!a.due_date) return 1;
                if (!b.due_date) return -1;
                return a.due_date.localeCompare(b.due_date);
            });
        } else if (sortCriteria === "priority") {
            const priorityWeight = { high: 3, medium: 2, low: 1 };
            filteredTasks.sort((a, b) => (priorityWeight[b.priority] || 2) - (priorityWeight[a.priority] || 2));
        } else {
            // Default "created_at" descending (newest first)
            filteredTasks.sort((a, b) => b.created_at.localeCompare(a.created_at));
        }

        // Apply completed task hiding if toggled on
        if (hideCompleted) {
            filteredTasks = filteredTasks.filter(t => !t.is_completed);
        }

        if (filteredTasks.length === 0) {
            tasksListItems.innerHTML = `<div class="no-tasks-message">Không tìm thấy công việc nào phù hợp.</div>`;
            return;
        }

        filteredTasks.forEach(t => {
            const proj = projects.find(p => p.id === t.project_id) || projects.find(p => p.id === "inbox");
            
            const card = document.createElement("div");
            card.className = `task-card ${t.is_completed ? 'completed' : ''}`;
            card.dataset.id = t.id;

            // Date processing
            let dateBadgeHTML = "";
            if (t.due_date) {
                const dueDateObj = new Date(t.due_date);
                const formattedDate = dueDateObj.toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' });
                
                let dateClass = "badge-date";
                let dateText = formattedDate;
                if (!t.is_completed) {
                    if (t.due_date === todayStr) {
                        dateClass += " today";
                        dateText = "Hôm nay";
                    } else if (t.due_date < todayStr) {
                        dateClass += " overdue";
                        dateText = "Trễ hạn";
                    }
                }
                dateBadgeHTML = `<span class="badge ${dateClass}">${dateText}</span>`;
            }

            // Priority processing
            const priorityText = t.priority === "high" ? "Cao" : t.priority === "medium" ? "Trung bình" : "Thấp";
            
            card.innerHTML = `
                <label class="task-checkbox-container">
                    <input type="checkbox" ${t.is_completed ? 'checked' : ''}>
                    <span class="checkmark"></span>
                </label>
                <div class="task-info-area">
                    <span class="task-title" title="${t.title}">${t.title}</span>
                    ${t.description ? `<p class="task-desc">${t.description}</p>` : ''}
                    <div class="task-badges-row">
                        <span class="badge badge-priority-${t.priority}">${priorityText}</span>
                        ${dateBadgeHTML}
                        <span class="badge-project" style="background: ${proj.color};">${proj.name}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn-task-delete" data-id="${t.id}" title="Xóa công việc">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                </div>
            `;

            // Checkbox event
            const checkbox = card.querySelector("input[type='checkbox']");
            checkbox.addEventListener("change", function(e) {
                e.stopPropagation(); // prevent opening edit modal when checking task
                handleToggleTask(t.id, this.checked);
            });

            // Delete event
            const delBtn = card.querySelector(".btn-task-delete");
            delBtn.addEventListener("click", function(e) {
                e.stopPropagation(); // prevent opening edit modal when deleting task
                handleDeleteTask(this.dataset.id);
            });

            // Click event on the card itself to open Edit Modal
            card.addEventListener("click", function(e) {
                // Check that click didn't come from action buttons
                if (!e.target.closest(".task-checkbox-container") && !e.target.closest(".task-actions")) {
                    openEditModal(t);
                }
            });

            tasksListItems.appendChild(card);
        });
    }

    function renderSidebarCounts() {
        const todayStr = new Date().toISOString().split('T')[0];
        
        const todayCount = tasks.filter(t => t.due_date === todayStr && !t.is_completed).length;
        const allCount = tasks.filter(t => !t.is_completed).length;
        const importantCount = tasks.filter(t => t.priority === "high" && !t.is_completed).length;
        const completedCount = tasks.filter(t => t.is_completed).length;

        if (countToday) countToday.textContent = todayCount;
        if (countAll) countAll.textContent = allCount;
        if (countImportant) countImportant.textContent = importantCount;
        if (countCompleted) countCompleted.textContent = completedCount;
    }

    // Document Bootstrap
    document.addEventListener("DOMContentLoaded", init);

})();
