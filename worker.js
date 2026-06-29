const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TaskFlow - Hệ Thống Kiểm Soát Công Việc</title>
    <meta name="description" content="Quản lý công việc hàng ngày và theo dự án khoa học, trực quan, hỗ trợ thiết lập deadline và đồng bộ điện toán đám mây Cloudflare D1.">
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body class="dark-theme">
    <!-- Background glowing accents -->
    <div class="blob blob-1" id="bg-blob-1"></div>
    <div class="blob blob-2" id="bg-blob-2"></div>
    <div class="blob blob-3" id="bg-blob-3"></div>

    <!-- MAIN APP CONTAINER -->
    <div class="app-layout" id="main-app-layout">
        
        <!-- SIDEBAR NAVIGATION -->
        <aside class="app-sidebar" id="sidebar-panel">
            <div class="sidebar-header" id="sidebar-logo">
                <div class="logo-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="glow-svg">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                        <path d="M9 12l2 2 4-4"/>
                    </svg>
                </div>
                <span class="logo-text">Task<span>Flow</span></span>
            </div>

            <!-- Main Categories Nav -->
            <nav class="sidebar-nav" id="sidebar-nav-filters">
                <button class="nav-item active" id="filter-today" data-filter="today">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span>Hôm nay</span>
                    <span class="nav-count" id="count-today">0</span>
                </button>
                <button class="nav-item" id="filter-all" data-filter="all">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                    <span>Tất cả công việc</span>
                    <span class="nav-count" id="count-all">0</span>
                </button>
                <button class="nav-item" id="filter-important" data-filter="important">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <span>Quan trọng</span>
                    <span class="nav-count" id="count-important">0</span>
                </button>
                <button class="nav-item" id="filter-completed" data-filter="completed">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span>Đã hoàn thành</span>
                    <span class="nav-count" id="count-completed">0</span>
                </button>
            </nav>

            <!-- Projects Section Nav -->
            <div class="sidebar-section" id="sidebar-projects-section">
                <div class="section-title">
                    <span>DỰ ÁN</span>
                    <button class="btn-icon-add" id="btn-open-project-modal" title="Thêm dự án mới">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                </div>
                <div class="projects-list" id="sidebar-projects-list">
                    <!-- Projects injected dynamically -->
                </div>
            </div>
        </aside>

        <!-- MAIN DASHBOARD CONTENT -->
        <main class="app-content" id="dashboard-content">
            
            <!-- TOP BAR -->
            <header class="app-topbar" id="dashboard-topbar">
                <div class="topbar-left">
                    <h1 class="view-title" id="current-view-title">Hôm nay</h1>
                    <span class="view-date" id="current-view-date">Thứ Hai, ngày 29/06/2026</span>
                </div>
                <div class="topbar-right">
                    <!-- Cloudflare D1 Connection Badge -->
                    <div id="db-status-badge" class="db-status-badge" title="Trạng thái kết nối Cloudflare D1">
                        <span id="db-status-dot"></span>
                        <span id="db-status-text">Đang kết nối...</span>
                    </div>
                </div>
            </header>

            <!-- PROGRESS OVERVIEW BANNER -->
            <section class="overview-banner" id="progress-overview-banner">
                <div class="progress-info">
                    <h3>Tiến độ công việc</h3>
                    <p id="progress-percentage-label">Đã hoàn thành 0%</p>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" id="progress-bar-fill" style="width: 0%;"></div>
                </div>
                <div class="stats-mini-grid" id="stats-counters">
                    <div class="stat-item">
                        <span class="stat-num" id="stat-completed">0</span>
                        <span class="stat-lbl">Hoàn thành</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-num" id="stat-pending">0</span>
                        <span class="stat-lbl">Đang làm</span>
                    </div>
                    <div class="stat-item overdue">
                        <span class="stat-num" id="stat-overdue">0</span>
                        <span class="stat-lbl">Trễ hạn</span>
                    </div>
                </div>
            </section>

            <!-- ADD TASK FORM -->
            <section class="task-form-card" id="task-creation-form">
                <h3 class="form-title">Thêm công việc mới</h3>
                <form id="add-task-form">
                    <div class="form-row">
                        <input type="text" id="task-title-input" placeholder="Bạn cần làm gì?" required autocomplete="off">
                    </div>
                    <div class="form-row">
                        <textarea id="task-desc-input" placeholder="Mô tả công việc (không bắt buộc)"></textarea>
                    </div>
                    <div class="form-row-grid">
                        <div class="form-group">
                            <label for="task-due-date">Hạn chót (Deadline)</label>
                            <input type="date" id="task-due-date">
                        </div>
                        <div class="form-group">
                            <label for="task-priority">Độ ưu tiên</label>
                            <select id="task-priority">
                                <option value="low">Thấp</option>
                                <option value="medium" selected>Trung bình</option>
                                <option value="high">Cao</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="task-project">Dự án</label>
                            <select id="task-project">
                                <option value="inbox">Hộp thư đến</option>
                                <!-- Projects options injected dynamically -->
                            </select>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary" id="btn-submit-task">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            <span>Thêm công việc</span>
                        </button>
                    </div>
                </form>
            </section>

            <!-- TASKS LIST SECTION -->
            <section class="tasks-section" id="tasks-list-container">
                <div class="tasks-list-header">
                    <h3 id="tasks-list-title">Danh sách công việc</h3>
                    <div class="tasks-list-actions">
                        <button class="btn-filter-toggle active" id="btn-hide-completed">Ẩn đã xong</button>
                    </div>
                </div>
                <div class="tasks-list" id="tasks-list-items">
                    <!-- Tasks cards injected dynamically -->
                </div>
            </section>

        </main>
    </div>

    <!-- NEW PROJECT DIALOG (MODAL) -->
    <div class="modal-overlay hidden" id="project-modal">
        <div class="modal-card">
            <div class="modal-header">
                <h3>Tạo Dự Án Mới</h3>
                <button class="modal-close" id="btn-close-project-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="add-project-form">
                    <div class="form-group">
                        <label for="project-name-input">Tên dự án</label>
                        <input type="text" id="project-name-input" placeholder="Ví dụ: Công việc nhà, Học tiếng Anh..." required autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label for="project-desc-input">Mô tả dự án</label>
                        <input type="text" id="project-desc-input" placeholder="Mô tả ngắn gọn mục tiêu dự án" autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label>Chọn màu sắc hiển thị</label>
                        <div class="color-picker-grid" id="project-color-picker">
                            <button type="button" class="color-dot active" style="background: #2563eb;" data-color="#2563eb"></button>
                            <button type="button" class="color-dot" style="background: #8b5cf6;" data-color="#8b5cf6"></button>
                            <button type="button" class="color-dot" style="background: #ec4899;" data-color="#ec4899"></button>
                            <button type="button" class="color-dot" style="background: #f59e0b;" data-color="#f59e0b"></button>
                            <button type="button" class="color-dot" style="background: #10b981;" data-color="#10b981"></button>
                            <button type="button" class="color-dot" style="background: #64748b;" data-color="#64748b"></button>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full" id="btn-submit-project">Tạo dự án</button>
                </form>
            </div>
        </div>
    </div>

    <!-- Javascript bootstrapping -->
    <script src="app.js"></script>
</body>
</html>
`;
const cssContent = `/* TaskFlow Premium Dark Theme CSS System */

:root {
    --bg-app: #0b0f19;       /* Deep slate-blue background */
    --bg-sidebar: #0f172a;   /* Darker slate sidebar */
    --card-bg: rgba(20, 29, 47, 0.65); /* Translucent glass card */
    --card-border: rgba(255, 255, 255, 0.06);
    --card-border-hover: rgba(99, 102, 241, 0.25);
    
    /* Typography colors */
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --text-placeholder: #475569;
    
    /* Accent colors */
    --primary: #6366f1;       /* Indigo primary */
    --primary-glow: rgba(99, 102, 241, 0.15);
    --primary-hover: #4f46e5;
    
    /* Priority / States */
    --priority-low: #38bdf8;  /* Light blue */
    --priority-med: #fbbf24;  /* Amber */
    --priority-high: #f87171; /* Rose red */
    
    --success: #10b981;       /* Emerald */
    --success-glow: rgba(16, 185, 129, 0.1);
    --error: #ef4444;
    --warning: #f59e0b;
    
    --font-heading: 'Space Grotesk', sans-serif;
    --font-body: 'Plus Jakarta Sans', sans-serif;
}

/* BASE STYLE & RESET */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
}

body {
    background-color: var(--bg-app);
    color: var(--text-main);
    font-family: var(--font-body);
    overflow-x: hidden;
    min-height: 100vh;
}

/* Background animated glow spots */
.blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(120px);
    z-index: -1;
    opacity: 0.15;
    pointer-events: none;
    animation: blob-float 20s infinite alternate ease-in-out;
}

.blob-1 {
    width: 500px;
    height: 500px;
    background: var(--primary);
    top: -100px;
    left: -100px;
}

.blob-2 {
    width: 600px;
    height: 600px;
    background: #06b6d4; /* Cyan */
    bottom: -150px;
    right: -100px;
    animation-delay: -5s;
}

.blob-3 {
    width: 400px;
    height: 400px;
    background: #ec4899; /* Pink */
    top: 30%;
    left: 55%;
    animation-delay: -10s;
}

@keyframes blob-float {
    0% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(60px, 40px) scale(1.15); }
    100% { transform: translate(-40px, -60px) scale(0.9); }
}

/* Custom Scrollbars */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
::-webkit-scrollbar-track {
    background: transparent;
}
::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
}
::-webkit-scrollbar-thumb:hover {
    background: var(--primary);
}

/* APP LAYOUT */
.app-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    min-height: 100vh;
}

/* SIDEBAR STYLES */
.app-sidebar {
    background-color: var(--bg-sidebar);
    border-right: 1px solid var(--card-border);
    display: flex;
    flex-direction: column;
    padding: 1.75rem;
    height: 100vh;
    position: sticky;
    top: 0;
}

.sidebar-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 2.25rem;
}

.logo-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, var(--primary), #818cf8);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
}

.glow-svg {
    filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.6));
}

.logo-text {
    font-family: var(--font-heading);
    font-size: 1.35rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: var(--text-main);
}

.logo-text span {
    color: var(--primary);
}

.sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-bottom: 2rem;
}

.nav-item {
    background: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.75rem 1rem;
    color: var(--text-muted);
    font-family: var(--font-body);
    font-size: 0.95rem;
    font-weight: 500;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    text-align: left;
}

.nav-item svg {
    margin-right: 0.75rem;
    flex-shrink: 0;
    transition: transform 0.2s ease;
}

.nav-item div, .nav-item span {
    display: flex;
    align-items: center;
}

.nav-item:hover {
    color: var(--text-main);
    background: rgba(255, 255, 255, 0.03);
}

.nav-item:hover svg {
    transform: scale(1.08);
}

.nav-item.active {
    color: var(--text-main);
    background: var(--primary-glow);
    border: 1px solid rgba(99, 102, 241, 0.15);
    font-weight: 600;
}

.nav-item.active svg {
    color: var(--primary);
}

.nav-count {
    font-size: 0.75rem;
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-muted);
    padding: 2px 8px;
    border-radius: 20px;
    font-weight: 600;
}

.nav-item.active .nav-count {
    background: var(--primary);
    color: white;
}

/* Sidebar Section Headers */
.sidebar-section {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
}

.section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--text-placeholder);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 0.5rem 1rem;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.btn-icon-add {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 2px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.btn-icon-add:hover {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-main);
}

.projects-list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.project-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.6rem 1rem;
    background: none;
    border: none;
    color: var(--text-muted);
    font-family: var(--font-body);
    font-size: 0.9rem;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;
}

.project-item-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.project-color-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.project-item:hover {
    color: var(--text-main);
    background: rgba(255, 255, 255, 0.02);
}

.project-item.active {
    color: var(--text-main);
    background: rgba(255, 255, 255, 0.04);
    font-weight: 600;
}

.project-item-actions {
    display: flex;
    align-items: center;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.project-item:hover .project-item-actions {
    opacity: 1;
}

.btn-project-delete {
    background: none;
    border: none;
    color: var(--text-placeholder);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.btn-project-delete:hover {
    color: var(--priority-high);
    background: rgba(248, 113, 113, 0.08);
}

/* MAIN CONTENT STYLES */
.app-content {
    padding: 2.25rem 3rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-height: 100vh;
    overflow-y: auto;
}

/* TOPBAR HEADER */
.app-topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.view-title {
    font-family: var(--font-heading);
    font-size: 1.85rem;
    font-weight: 800;
    color: var(--text-main);
}

.view-date {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-top: 0.15rem;
    display: block;
}

/* DATABASE CONNECTION BADGE */
.db-status-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--card-border);
    padding: 0.4rem 0.85rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

#db-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-placeholder);
    display: inline-block;
    transition: all 0.3s ease;
}

/* OVERVIEW PROGRESS BANNER */
.overview-banner {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 1.75rem 2rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    display: grid;
    grid-template-columns: 1.5fr 2fr 1.5fr;
    align-items: center;
    gap: 2rem;
}

.progress-info h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-main);
    margin-bottom: 0.25rem;
}

.progress-info p {
    font-size: 0.85rem;
    color: var(--text-muted);
    font-weight: 600;
}

.progress-bar-container {
    height: 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    overflow: hidden;
}

.progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary), #818cf8);
    border-radius: 4px;
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.4);
}

.stats-mini-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    border-left: 1px solid rgba(255, 255, 255, 0.06);
    padding-left: 1.5rem;
}

.stat-item {
    text-align: center;
}

.stat-num {
    display: block;
    font-family: var(--font-heading);
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--text-main);
}

.stat-lbl {
    font-size: 0.7rem;
    color: var(--text-muted);
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.5px;
}

.stat-item.overdue .stat-num {
    color: var(--priority-high);
}

/* ADD TASK FORM */
.task-form-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 1.75rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    transition: border-color 0.3s ease;
}

.task-form-card:focus-within {
    border-color: var(--card-border-hover);
}

.form-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-main);
}

.form-row input[type="text"], .form-row textarea {
    width: 100%;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    color: var(--text-main);
    font-family: inherit;
    padding: 0.75rem 1rem;
    outline: none;
    transition: all 0.2s ease;
}

.form-row input[type="text"]:focus, .form-row textarea:focus {
    border-color: var(--primary);
    background: rgba(0, 0, 0, 0.3);
}

.form-row textarea {
    resize: none;
    height: 70px;
    font-size: 0.9rem;
}

.form-row-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
}

.form-group label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted);
}

.form-group input, .form-group select {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    color: var(--text-main);
    font-family: inherit;
    padding: 0.6rem 0.8rem;
    outline: none;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.form-group input:focus, .form-group select:focus {
    border-color: var(--primary);
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5rem;
}

/* BUTTONS */
.btn {
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 0.9rem;
    padding: 0.65rem 1.25rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn-primary {
    background: var(--primary);
    color: white;
    border: none;
    box-shadow: 0 4px 10px rgba(99, 102, 241, 0.2);
}

.btn-primary:hover {
    background: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: 0 6px 15px rgba(99, 102, 241, 0.35);
}

.btn-primary:active {
    transform: translateY(0);
}

.btn-full {
    width: 100%;
}

/* TASKS LIST SECTION */
.tasks-section {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.tasks-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tasks-list-header h3 {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text-main);
}

.btn-filter-toggle {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--card-border);
    color: var(--text-muted);
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.4rem 0.85rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-filter-toggle:hover {
    color: var(--text-main);
    background: rgba(255, 255, 255, 0.06);
}

.btn-filter-toggle.active {
    background: rgba(99, 102, 241, 0.1);
    border-color: rgba(99, 102, 241, 0.2);
    color: var(--primary);
}

.tasks-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

/* TASK CARD */
.task-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 14px;
    padding: 1.1rem 1.5rem;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 1.25rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.task-card:hover {
    border-color: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

/* Checkbox Toggle Animation */
.task-checkbox-container {
    position: relative;
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.task-checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: transparent;
    border: 2px solid var(--text-placeholder);
    border-radius: 50%;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.task-checkbox-container:hover input ~ .checkmark {
    border-color: var(--primary);
    background: rgba(99, 102, 241, 0.05);
}

.task-checkbox-container input:checked ~ .checkmark {
    background-color: var(--success);
    border-color: var(--success);
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
}

.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

.task-checkbox-container input:checked ~ .checkmark:after {
    display: block;
}

.task-checkbox-container .checkmark:after {
    left: 6px;
    top: 3px;
    width: 5px;
    height: 9px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    transition: all 0.2s ease;
}

/* Task Info */
.task-info-area {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    overflow: hidden;
}

.task-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-main);
    transition: all 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.task-desc {
    font-size: 0.8rem;
    color: var(--text-muted);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Completed Task styling */
.task-card.completed {
    background: rgba(20, 29, 47, 0.35);
    opacity: 0.55;
}

.task-card.completed .task-title {
    text-decoration: line-through;
    color: var(--text-placeholder);
}

.task-card.completed .task-desc {
    color: var(--text-placeholder);
}

/* Badges row */
.task-badges-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
}

.badge {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

/* Priority badges */
.badge-priority-low {
    background: rgba(56, 189, 248, 0.08);
    color: var(--priority-low);
    border: 1px solid rgba(56, 189, 248, 0.15);
}
.badge-priority-medium {
    background: rgba(251, 191, 36, 0.08);
    color: var(--priority-med);
    border: 1px solid rgba(251, 191, 36, 0.15);
}
.badge-priority-high {
    background: rgba(248, 113, 113, 0.08);
    color: var(--priority-high);
    border: 1px solid rgba(248, 113, 113, 0.15);
}

/* Date badges */
.badge-date {
    background: rgba(255, 255, 255, 0.04);
    color: var(--text-muted);
    border: 1px solid rgba(255, 255, 255, 0.06);
}
.badge-date.today {
    background: rgba(245, 158, 11, 0.08);
    color: var(--warning);
    border: 1px solid rgba(245, 158, 11, 0.15);
}
.badge-date.overdue {
    background: rgba(239, 68, 68, 0.08);
    color: var(--error);
    border: 1px solid rgba(239, 68, 68, 0.15);
    animation: pulse-red 2s infinite;
}

@keyframes pulse-red {
    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
    70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

/* Project Badge */
.badge-project {
    font-size: 0.7rem;
    font-weight: 600;
    color: white;
    padding: 2px 8px;
    border-radius: 6px;
    display: inline-block;
}

/* Task Actions (Delete) */
.task-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-task-delete {
    background: none;
    border: none;
    color: var(--text-placeholder);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    border-radius: 8px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-task-delete:hover {
    color: var(--priority-high);
    background: rgba(248, 113, 113, 0.08);
    transform: scale(1.08);
}

/* Empty state list */
.no-tasks-message {
    text-align: center;
    padding: 3rem 0;
    color: var(--text-placeholder);
    font-size: 0.95rem;
    border: 2px dashed rgba(255, 255, 255, 0.03);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.005);
}

/* MODAL / DIALOG */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(4, 7, 16, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fade-in 0.2s ease forwards;
}

.modal-card {
    background: var(--bg-sidebar);
    border: 1px solid var(--card-border);
    border-radius: 20px;
    width: 440px;
    max-width: 90%;
    padding: 2rem;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
    animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.modal-header h3 {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    color: var(--text-main);
}

.modal-close {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 1.5rem;
    cursor: pointer;
    line-height: 1;
}

.modal-close:hover {
    color: var(--text-main);
}

.modal-body form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

/* Color picker grid */
.color-picker-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.75rem;
    margin-top: 0.25rem;
}

.color-dot {
    height: 28px;
    width: 28px;
    border-radius: 50%;
    border: 3px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
}

.color-dot:hover {
    transform: scale(1.08);
}

.color-dot.active {
    border-color: white;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

/* MODAL ANIMATIONS */
@keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slide-up {
    from { opacity: 0; transform: translateY(20px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

/* RESPONSIVE LAYOUT (MOBILE) */
@media (max-width: 900px) {
    .overview-banner {
        grid-template-columns: 1fr;
        gap: 1.25rem;
    }
    .stats-mini-grid {
        border-left: none;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        padding-left: 0;
        padding-top: 1.25rem;
    }
}

@media (max-width: 768px) {
    .app-layout {
        grid-template-columns: 1fr;
    }
    .app-sidebar {
        display: none; /* In production, you would toggle this via a hamburger menu button */
    }
    .app-content {
        padding: 1.5rem 1.5rem;
        max-height: none;
        overflow-y: visible;
    }
    .form-row-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    .task-card {
        grid-template-columns: auto 1fr;
        gap: 0.75rem;
        padding: 1rem;
    }
    .task-actions {
        grid-column: 2;
        justify-content: flex-end;
    }
}
`;
const jsContent = `// TaskFlow - Frontend Application Coordinator
(function() {
    const BACKEND_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
        ? "http://127.0.0.1:5001"
        : "https://appkiemsoatcongviec1.datnguyen394501.workers.dev";
    
    // In-memory data cache
    let tasks = [];
    let projects = [];
    
    // UI State
    let currentFilter = "today"; // "today", "all", "important", "completed", or a project UUID
    let hideCompleted = true;

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
    const tasksListItems = document.getElementById("tasks-list-items");
    const tasksListTitle = document.getElementById("tasks-list-title");
    
    // Stats elements
    const statCompleted = document.getElementById("stat-completed");
    const statPending = document.getElementById("stat-pending");
    const statOverdue = document.getElementById("stat-overdue");
    const progressBarFill = document.getElementById("progress-bar-fill");
    const progressPercentLabel = document.getElementById("progress-percentage-label");

    // Modal elements
    const projectModal = document.getElementById("project-modal");
    const btnOpenProjectModal = document.getElementById("btn-open-project-modal");
    const btnCloseProjectModal = document.getElementById("btn-close-project-modal");
    const addProjectForm = document.getElementById("add-project-form");
    const projectColorPicker = document.getElementById("project-color-picker");

    // Forms
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
            const statusRes = await fetch(\`\${BACKEND_URL}/api/status\`);
            if (!statusRes.ok) throw new Error("Server unreachable");
            const statusData = await statusRes.json();

            // Fetch Projects
            const projectsRes = await fetch(\`\${BACKEND_URL}/api/projects\`);
            if (!projectsRes.ok) throw new Error("Failed to fetch projects");
            projects = await projectsRes.json();

            // Fetch Tasks
            const tasksRes = await fetch(\`\${BACKEND_URL}/api/tasks\`);
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

        // Add task form submission
        if (addTaskForm) {
            addTaskForm.addEventListener("submit", handleAddTask);
        }

        // Modal triggers
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
            due_date: dateInput.value,
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
            const res = await fetch(\`\${BACKEND_URL}/api/tasks\`, {
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
            const res = await fetch(\`\${BACKEND_URL}/api/projects\`, {
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
            const res = await fetch(\`\${BACKEND_URL}/api/tasks/toggle\`, {
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
            const res = await fetch(\`\${BACKEND_URL}/api/tasks/\${taskId}\`, {
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
        if (!confirm(\`Xóa dự án "\${projectName}" sẽ xóa toàn bộ công việc bên trong dự án này. Bạn chắc chắn muốn xóa chứ?\`)) return;

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
            const res = await fetch(\`\${BACKEND_URL}/api/projects/\${projectId}\`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Failed to delete project");
            fetchData();
        } catch (err) {
            console.warn("Could not sync project deletion to Cloudflare D1", err);
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
            // Do not show delete button on the default Inbox
            const isInbox = p.id === "inbox";
            
            const btn = document.createElement("button");
            btn.className = \`project-item \${currentFilter === p.id ? 'active' : ''}\`;
            btn.dataset.id = p.id;
            
            btn.innerHTML = \`
                <div class="project-item-left">
                    <span class="project-color-dot" style="background: \${p.color};"></span>
                    <span>\${p.name}</span>
                </div>
                \${!isInbox ? \`
                <div class="project-item-actions">
                    <button class="btn-project-delete" data-id="\${p.id}" data-name="\${p.name}" title="Xóa dự án">
                        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                </div>\` : ''}
            \`;

            // Click listener for project switching
            btn.addEventListener("click", function(e) {
                // Avoid project delete button click firing project switch
                if (e.target.closest(".btn-project-delete")) return;

                // Deactivate sidebar nav items
                const navButtons = document.querySelectorAll(".sidebar-nav .nav-item");
                navButtons.forEach(b => b.classList.remove("active"));
                
                // Highlight active project
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
        
        // Cache current selection
        const currentSel = selectTaskProject.value;
        selectTaskProject.innerHTML = "";
        
        projects.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = p.name;
            selectTaskProject.appendChild(opt);
        });
        
        // Restore selection
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

        // Calculate progress metrics on active list (before hiding completed tasks)
        const totalCount = filteredTasks.length;
        const completedCount = filteredTasks.filter(t => t.is_completed).length;
        const pendingCount = totalCount - completedCount;
        
        // Calculate Overdue tasks in this view
        const todayStr = new Date().toISOString().split('T')[0];
        const overdueCount = filteredTasks.filter(t => !t.is_completed && t.due_date && t.due_date < todayStr).length;

        // Render Overview Banner
        statCompleted.textContent = completedCount;
        statPending.textContent = pendingCount;
        statOverdue.textContent = overdueCount;
        
        const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        progressBarFill.style.width = \`\${completionRate}%\`;
        progressPercentLabel.textContent = \`Đã hoàn thành \${completionRate}%\`;

        // Apply completed task hiding if toggled on
        if (hideCompleted) {
            filteredTasks = filteredTasks.filter(t => !t.is_completed);
        }

        if (filteredTasks.length === 0) {
            tasksListItems.innerHTML = \`<div class="no-tasks-message">Không có công việc nào. Bạn hãy thêm việc mới ở trên nhé!</div>\`;
            return;
        }

        filteredTasks.forEach(t => {
            // Find project color & name
            const proj = projects.find(p => p.id === t.project_id) || projects.find(p => p.id === "inbox");
            
            const card = document.createElement("div");
            card.className = \`task-card \${t.is_completed ? 'completed' : ''}\`;
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
                dateBadgeHTML = \`<span class="badge \${dateClass}">\${dateText}</span>\`;
            }

            // Priority processing
            const priorityText = t.priority === "high" ? "Cao" : t.priority === "medium" ? "Trung bình" : "Thấp";
            
            card.innerHTML = \`
                <label class="task-checkbox-container">
                    <input type="checkbox" \${t.is_completed ? 'checked' : ''}>
                    <span class="checkmark"></span>
                </label>
                <div class="task-info-area">
                    <span class="task-title" title="\${t.title}">\${t.title}</span>
                    \${t.description ? \`<p class="task-desc">\${t.description}</p>\` : ''}
                    <div class="task-badges-row">
                        <span class="badge badge-priority-\${t.priority}">\${priorityText}</span>
                        \${dateBadgeHTML}
                        <span class="badge-project" style="background: \${proj.color};">\${proj.name}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn-task-delete" data-id="\${t.id}" title="Xóa công việc">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                </div>
            \`;

            // Checkbox event
            const checkbox = card.querySelector("input[type='checkbox']");
            checkbox.addEventListener("change", function() {
                handleToggleTask(t.id, this.checked);
            });

            // Delete event
            const delBtn = card.querySelector(".btn-task-delete");
            delBtn.addEventListener("click", function() {
                handleDeleteTask(this.dataset.id);
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
`;

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // --- Serve Static Frontend Assets ---
    if (path === "/" || path === "/index.html") {
      return new Response(htmlContent, {
        headers: { "Content-Type": "text/html;charset=UTF-8" }
      });
    }

    if (path === "/style.css") {
      return new Response(cssContent, {
        headers: { "Content-Type": "text/css;charset=UTF-8" }
      });
    }

    if (path === "/app.js") {
      return new Response(jsContent, {
        headers: { "Content-Type": "application/javascript;charset=UTF-8" }
      });
    }

    // --- Backend D1 Database API ---
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
