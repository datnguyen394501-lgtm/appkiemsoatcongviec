// APEUni Clone - Central App Coordinator

const app = (function() {
    let currentViewId = "home-view";
    let isVip = false;

    function init() {
        setupNavigation();
        setupVipToggle();

        // Initialize sub-modules
        if (window.vocab) window.vocab.init();
        if (window.practice) window.practice.init();
        if (window.mocktest) window.mocktest.init();
        if (window.dashboard) window.dashboard.init();

        // Check if VIP previously active
        const savedVip = localStorage.getItem("pte_vip");
        if (savedVip === "true") {
            setVipStatus(true);
        }

        console.log("APEUni Clone App Initialized Successfully.");
    }

    function setupNavigation() {
        const navItems = document.querySelectorAll(".nav-item");
        
        navItems.forEach(item => {
            item.addEventListener("click", function() {
                const targetViewId = this.dataset.target;
                switchView(targetViewId);
            });
        });

        // Logo redirects to home view
        const logo = document.getElementById("logo-home");
        if (logo) {
            logo.addEventListener("click", () => {
                switchView("home-view");
            });
        }
    }

    function switchView(viewId) {
        if (viewId === currentViewId) return;

        // Cleanup practice timers if leaving practice room
        if (currentViewId === "practice-view" && window.practice) {
            window.practice.cleanupTimers();
        }

        const currentView = document.getElementById(currentViewId);
        const targetView = document.getElementById(viewId);

        if (currentView && targetView) {
            currentView.classList.remove("active");
            targetView.classList.remove("hidden");
            targetView.classList.add("active");

            // Update nav item active visual state
            const navItems = document.querySelectorAll(".nav-item");
            navItems.forEach(item => {
                if (item.dataset.target === viewId) {
                    item.classList.add("active");
                } else {
                    item.classList.remove("active");
                }
            });

            currentViewId = viewId;

            // Trigger dashboard re-render on dashboard tab click
            if (viewId === "dashboard-view" && window.dashboard) {
                window.dashboard.init();
            }
        }
    }

    function setupVipToggle() {
        const vipBtn = document.getElementById("vip-toggle");
        const modal = document.getElementById("vip-modal");
        const closeBtn = document.getElementById("vip-modal-close");
        const activateBtn = document.getElementById("activate-vip-btn");

        if (vipBtn && modal) {
            vipBtn.addEventListener("click", () => {
                if (isVip) {
                    // Turn off VIP
                    setVipStatus(false);
                    alert("Đã hủy chế độ trải nghiệm VIP.");
                } else {
                    // Show activation modal
                    modal.classList.remove("hidden");
                }
            });
        }

        if (closeBtn && modal) {
            closeBtn.addEventListener("click", () => {
                modal.classList.add("hidden");
            });
        }

        if (activateBtn && modal) {
            activateBtn.addEventListener("click", () => {
                setVipStatus(true);
                modal.classList.add("hidden");
                alert("Chúc mừng! Bạn đã kích hoạt thành công tài khoản trải nghiệm VIP.");
            });
        }

        // Close modal on click outside content
        if (modal) {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) {
                    modal.classList.add("hidden");
                }
            });
        }
    }

    function setVipStatus(status) {
        isVip = status;
        localStorage.setItem("pte_vip", status.toString());

        const vipBtn = document.getElementById("vip-toggle");
        if (vipBtn) {
            if (status) {
                vipBtn.classList.add("active-vip");
                vipBtn.querySelector("span").textContent = "VIP Active";
            } else {
                vipBtn.classList.remove("active-vip");
                vipBtn.querySelector("span").textContent = "VIP Member";
            }
        }
    }

    return {
        init,
        switchView,
        isVip: () => isVip
    };
})();

// Document Ready Bootstrap
document.addEventListener("DOMContentLoaded", () => {
    app.init();
});
window.app = app;
