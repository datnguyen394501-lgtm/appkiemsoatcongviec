// APEUni Clone - Dashboard Module (Phase 2 Expanded)

const dashboard = (function() {
    let studyStartTime = Date.now();
    let totalMinutesStudied = 0;

    // Daily checklists database for targets
    const planTasks = {
        "50": [
            { id: "ra-task", text: "Đọc lớn (RA) - 2 bài" },
            { id: "we-task", text: "Viết Essay (WE) - 1 bài" },
            { id: "fib-task", text: "Điền từ (FIB) - 1 bài" },
            { id: "wfd-task", text: "Nghe ghi chính tả (WFD) - 2 bài" }
        ],
        "65": [
            { id: "ra-task", text: "Đọc lớn (RA) - 3 bài" },
            { id: "di-task", text: "Mô tả hình ảnh (DI) - 1 bài" },
            { id: "swt-task", text: "Tóm tắt đoạn văn (SWT) - 1 bài" },
            { id: "ro-task", text: "Sắp xếp đoạn văn (RO) - 1 bài" },
            { id: "wfd-task", text: "Nghe ghi chính tả (WFD) - 3 bài" }
        ],
        "79": [
            { id: "ra-task", text: "Đọc lớn (RA) - 5 bài" },
            { id: "di-task", text: "Mô tả hình ảnh (DI) - 2 bài" },
            { id: "we-task", text: "Viết Essay (WE) - 1 bài" },
            { id: "swt-task", text: "Tóm tắt đoạn văn (SWT) - 1 bài" },
            { id: "fib-task", text: "Điền từ (FIB) - 3 bài" },
            { id: "ro-task", text: "Sắp xếp đoạn văn (RO) - 2 bài" },
            { id: "wfd-task", text: "Nghe ghi chính tả (WFD) - 5 bài" },
            { id: "hiw-task", text: "Tìm từ phát âm sai (HIW) - 3 bài" }
        ]
    };

    let cachedStats = null;
    const BACKEND_URL = "http://127.0.0.1:5001";

    function updateStatusBadge(status, modeText = "") {
        const dot = document.getElementById("db-status-dot");
        const text = document.getElementById("db-status-text");
        if (!dot || !text) return;

        if (status === "syncing") {
            dot.style.background = "#3b82f6";
            dot.style.boxShadow = "0 0 8px #3b82f6";
            text.textContent = "Đang đồng bộ...";
        } else if (status === "online") {
            dot.style.background = "#10b981";
            dot.style.boxShadow = "0 0 8px #10b981";
            text.textContent = modeText || "Cloudflare D1";
        } else if (status === "local") {
            dot.style.background = "#8b5cf6";
            dot.style.boxShadow = "0 0 8px #8b5cf6";
            text.textContent = modeText || "Local DB Active";
        } else {
            dot.style.background = "#f59e0b";
            dot.style.boxShadow = "0 0 8px #f59e0b";
            text.textContent = "Offline Mode";
        }
    }

    async function syncWithBackend() {
        updateStatusBadge("syncing");
        try {
            const statusRes = await fetch(`${BACKEND_URL}/api/status`);
            if (!statusRes.ok) throw new Error("Backend offline");
            const statusData = await statusRes.json();

            const statsRes = await fetch(`${BACKEND_URL}/api/stats`);
            if (!statsRes.ok) throw new Error("Failed to fetch stats");
            const dbStats = await statsRes.json();

            const historyRes = await fetch(`${BACKEND_URL}/api/history`);
            if (!historyRes.ok) throw new Error("Failed to fetch history");
            const dbHistory = await historyRes.json();

            cachedStats = {
                practiceCount: dbStats.practiceCount,
                streak: dbStats.streak,
                highScore: dbStats.highScore,
                lastActiveDate: dbStats.lastActiveDate,
                studyTarget: dbStats.studyTarget,
                checkedTasks: dbStats.checkedTasks || {},
                history: dbHistory
            };

            localStorage.setItem("pte_stats", JSON.stringify(cachedStats));

            if (statusData.configured) {
                updateStatusBadge("online", "Cloudflare D1");
            } else {
                updateStatusBadge("local", "Local DB Active");
            }

            renderDashboard();
            setupStudyPlan();
        } catch (err) {
            console.warn("Backend sync failed. Using local storage mode.", err);
            updateStatusBadge("offline");
        }
    }

    function getStats() {
        if (cachedStats) {
            return cachedStats;
        }
        const stats = localStorage.getItem("pte_stats");
        if (stats) {
            try {
                cachedStats = JSON.parse(stats);
                return cachedStats;
            } catch (e) {
                console.error("Error parsing local storage stats", e);
            }
        }
        cachedStats = {
            practiceCount: 0,
            streak: 1,
            highScore: 0,
            history: [],
            lastActiveDate: new Date().toDateString(),
            studyTarget: "65",
            checkedTasks: {}
        };
        return cachedStats;
    }

    function saveStats(stats) {
        cachedStats = stats;
        localStorage.setItem("pte_stats", JSON.stringify(stats));

        fetch(`${BACKEND_URL}/api/stats`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                practiceCount: stats.practiceCount,
                streak: stats.streak,
                highScore: stats.highScore,
                lastActiveDate: stats.lastActiveDate,
                studyTarget: stats.studyTarget,
                checkedTasks: stats.checkedTasks
            })
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to save");
            return res.json();
        })
        .then(() => {
            fetch(`${BACKEND_URL}/api/status`)
                .then(r => r.json())
                .then(d => updateStatusBadge(d.configured ? "online" : "local", d.configured ? "Cloudflare D1" : "Local DB Active"))
                .catch(() => updateStatusBadge("offline"));
        })
        .catch(err => {
            console.warn("Failed to sync stats update to backend:", err);
            updateStatusBadge("offline");
        });
    }

    function init() {
        studyStartTime = Date.now();
        
        setInterval(() => {
            const currentMins = Math.floor((Date.now() - studyStartTime) / 60000);
            totalMinutesStudied = currentMins;
            updateDashboardMetrics();
        }, 15000);

        getStats();
        checkStreak();
        renderDashboard();
        setupStudyPlan();

        syncWithBackend();
    }

    function checkStreak() {
        const stats = getStats();
        const todayStr = new Date().toDateString();
        
        if (stats.lastActiveDate !== todayStr) {
            const lastDate = new Date(stats.lastActiveDate);
            const todayDate = new Date(todayStr);
            const diffTime = Math.abs(todayDate - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                stats.streak += 1;
            } else if (diffDays > 1) {
                stats.streak = 1;
            }
            stats.lastActiveDate = todayStr;
            stats.checkedTasks = {};
            saveStats(stats);
        }
    }

    function addPracticeLog(qType, title, score, details) {
        const stats = getStats();
        stats.practiceCount += 1;
        
        if (qType === "Mock Test" && score > stats.highScore) {
            stats.highScore = score;
        }

        const logEntry = {
            id: Date.now().toString(),
            qType,
            title,
            score,
            details,
            date: new Date().toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };

        stats.history.unshift(logEntry);
        
        if (stats.history.length > 50) {
            stats.history.pop();
        }

        cachedStats = stats;
        localStorage.setItem("pte_stats", JSON.stringify(stats));

        renderDashboard();
        setupStudyPlan();

        fetch(`${BACKEND_URL}/api/stats`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                practiceCount: stats.practiceCount,
                streak: stats.streak,
                highScore: stats.highScore,
                lastActiveDate: stats.lastActiveDate,
                studyTarget: stats.studyTarget,
                checkedTasks: stats.checkedTasks
            })
        }).catch(err => console.warn("Failed to save stats to backend:", err));

        fetch(`${BACKEND_URL}/api/history`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(logEntry)
        }).catch(err => console.warn("Failed to save history entry to backend:", err));
    }

    function updateDashboardMetrics() {
        const stats = getStats();
        const timeEl = document.getElementById("dash-study-time");
        if (timeEl) {
            const displayTime = totalMinutesStudied > 0 ? `${totalMinutesStudied}m` : "< 1m";
            timeEl.textContent = displayTime;
        }
    }

    function renderDashboard() {
        const stats = getStats();
        
        const timeEl = document.getElementById("dash-study-time");
        const countEl = document.getElementById("dash-practice-count");
        const streakEl = document.getElementById("dash-streak");
        const scoreEl = document.getElementById("dash-high-score");

        if (timeEl) {
            const displayTime = totalMinutesStudied > 0 ? `${totalMinutesStudied}m` : "< 1m";
            timeEl.textContent = displayTime;
        }
        if (countEl) countEl.textContent = stats.practiceCount;
        if (streakEl) streakEl.textContent = `${stats.streak} ngày`;
        if (scoreEl) scoreEl.textContent = stats.highScore > 0 ? `${stats.highScore}đ` : "Chưa thi";

        const listEl = document.getElementById("dash-history-list");
        if (listEl) {
            if (stats.history.length === 0) {
                listEl.innerHTML = `<div class="no-history-msg">Chưa có bản ghi luyện tập nào. Bắt đầu luyện tập để theo dõi chỉ số!</div>`;
            } else {
                listEl.innerHTML = "";
                stats.history.slice(0, 5).forEach(log => {
                    const item = document.createElement("div");
                    item.className = "history-item";
                    item.innerHTML = `
                        <div class="hist-main">
                            <span class="hist-title">[${log.qType.toUpperCase()}] ${log.title}</span>
                            <span class="hist-date">${log.date} - ${log.details}</span>
                        </div>
                        <div class="hist-score">${log.score}đ</div>
                    `;
                    listEl.appendChild(item);
                });
            }
        }

        drawChart(stats.history);
    }

    function setupStudyPlan() {
        const targetSelect = document.getElementById("study-plan-target");
        const checklistContainer = document.getElementById("plan-checklist-container");
        if (!checklistContainer) return;

        const stats = getStats();
        
        // Sync select value
        if (targetSelect) {
            targetSelect.value = stats.studyTarget || "65";
            
            // Unbind previous and bind change listener
            targetSelect.onchange = function() {
                const newStats = getStats();
                newStats.studyTarget = this.value;
                newStats.checkedTasks = {}; // Reset checklist items on target switch
                saveStats(newStats);
                renderChecklist(checklistContainer, this.value, {});
            };
        }

        renderChecklist(checklistContainer, stats.studyTarget || "65", stats.checkedTasks || {});
    }

    function renderChecklist(container, targetScore, checkedStates) {
        container.innerHTML = "";
        
        const tasks = planTasks[targetScore] || planTasks["65"];

        tasks.forEach(task => {
            const isChecked = !!checkedStates[task.id];
            
            const item = document.createElement("label");
            item.className = `plan-item ${isChecked ? 'checked' : ''}`;
            item.innerHTML = `
                <input type="checkbox" data-id="${task.id}" ${isChecked ? 'checked' : ''}>
                <span>${task.text}</span>
            `;

            // Click listener
            const checkbox = item.querySelector('input');
            checkbox.addEventListener('change', function() {
                const stats = getStats();
                stats.checkedTasks[task.id] = this.checked;
                saveStats(stats);
                
                if (this.checked) {
                    item.classList.add('checked');
                } else {
                    item.classList.remove('checked');
                }
            });

            container.appendChild(item);
        });
    }

    function drawChart(history) {
        const svg = document.getElementById("performance-chart-svg");
        const line = document.getElementById("chart-line-path");
        const area = document.getElementById("chart-area-path");
        const dotGroup = document.getElementById("chart-dots");

        if (!svg || !line || !area || !dotGroup) return;

        dotGroup.innerHTML = "";

        let scores = history
            .filter(item => item.qType === "Mock Test" || item.qType === "Read Aloud" || item.qType === "Write Essay" || item.qType === "SWT Summary" || item.qType === "Reorder Paragraphs" || item.qType === "Highlight Words")
            .map(item => ({ score: item.score, date: item.date.split(" ")[0] }))
            .reverse();

        if (scores.length < 2) {
            scores = [
                { score: 32, date: "Tuần 1" },
                { score: 45, date: "Tuần 2" },
                { score: 58, date: "Tuần 3" },
                { score: 65, date: "Hôm nay" }
            ];
        }

        if (scores.length > 6) {
            scores = scores.slice(-6);
        }

        const width = 500;
        const height = 200;
        const padX_left = 40;
        const padX_right = 480;
        const padY_top = 20;
        const padY_bot = 170;

        const rangeX = padX_right - padX_left;
        const rangeY = padY_bot - padY_top;

        const points = [];
        
        scores.forEach((entry, idx) => {
            const x = padX_left + (idx / (scores.length - 1)) * rangeX;
            const y = padY_bot - (entry.score / 90) * rangeY;
            points.push({ x, y, score: entry.score, label: entry.date });
        });

        let pathD = "";
        points.forEach((pt, idx) => {
            if (idx === 0) {
                pathD += `M ${pt.x} ${pt.y}`;
            } else {
                pathD += ` L ${pt.x} ${pt.y}`;
            }
        });

        line.setAttribute("d", pathD);
        const areaD = `${pathD} L ${points[points.length - 1].x} ${padY_bot} L ${points[0].x} ${padY_bot} Z`;
        area.setAttribute("d", areaD);

        points.forEach(pt => {
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", pt.x);
            circle.setAttribute("cy", pt.y);
            circle.setAttribute("r", 5);
            circle.setAttribute("fill", "white");
            circle.setAttribute("stroke", "var(--accent)");
            circle.setAttribute("stroke-width", 2);

            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", pt.x);
            text.setAttribute("y", pt.y - 10);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("fill", "white");
            text.setAttribute("font-size", 9);
            text.setAttribute("font-weight", 700);
            text.textContent = `${pt.score}đ`;

            const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            labelText.setAttribute("x", pt.x);
            labelText.setAttribute("y", padY_bot + 15);
            labelText.setAttribute("text-anchor", "middle");
            labelText.setAttribute("fill", "rgba(255,255,255,0.4)");
            labelText.setAttribute("font-size", 9);
            labelText.textContent = pt.label;

            dotGroup.appendChild(circle);
            dotGroup.appendChild(text);
            dotGroup.appendChild(labelText);
        });
    }

    return {
        init,
        addPracticeLog,
        getStats
    };
})();
window.dashboard = dashboard;
