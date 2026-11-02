// 深色模式模块
const DarkModeModule = {
    STORAGE_KEY: 'goodnight_dark_mode',

    init() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            this.applyTheme(saved === 'dark');
        } else {
            // 跟随系统主题
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.applyTheme(prefersDark);
        }

        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.STORAGE_KEY)) {
                this.applyTheme(e.matches);
            }
        });

        // 绑定切换按钮
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    },

    applyTheme(isDark) {
        const root = document.documentElement;
        root.dataset.theme = isDark ? 'dark' : 'light';
        root.style.colorScheme = isDark ? 'dark' : 'light';

        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.textContent = isDark ? '☀' : '☾';
            toggleBtn.setAttribute('aria-label', isDark ? '切换到浅色模式' : '切换到深色模式');
        }
    },

    toggle() {
        const isDark = document.documentElement.dataset.theme !== 'dark';
        localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
        this.applyTheme(isDark);
    }
};
