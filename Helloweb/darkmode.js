// 深色模式模块
const DarkModeModule = {
    STORAGE_KEY: 'goodnight_dark_mode',
    THEMES: {
        light: {
            '--bg-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '--card-bg': 'rgba(255, 255, 255, 0.9)',
            '--text-primary': '#333',
            '--text-secondary': '#666',
            '--text-tertiary': '#888'
        },
        dark: {
            '--bg-gradient': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            '--card-bg': 'rgba(30, 30, 50, 0.9)',
            '--text-primary': '#e0e0e0',
            '--text-secondary': '#b0b0b0',
            '--text-tertiary': '#808080'
        }
    },

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
        const theme = isDark ? this.THEMES.dark : this.THEMES.light;

        root.style.setProperty('--bg-gradient', theme['--bg-gradient']);
        root.style.setProperty('--card-bg', theme['--card-bg']);
        root.style.setProperty('--text-primary', theme['--text-primary']);
        root.style.setProperty('--text-secondary', theme['--text-secondary']);
        root.style.setProperty('--text-tertiary', theme['--text-tertiary']);

        document.body.dataset.theme = isDark ? 'dark' : 'light';

        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.textContent = isDark ? '☀️' : '🌙';
            toggleBtn.setAttribute('aria-label', isDark ? '切换到浅色模式' : '切换到深色模式');
        }
    },

    toggle() {
        const isDark = document.body.dataset.theme !== 'dark';
        localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
        this.applyTheme(isDark);
    }
};
