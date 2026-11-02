// 时间模块
const TimeModule = {
    getGreetingByHour(h) {
        if (h >= 0 && h < 6) return '夜深了';
        if (h >= 6 && h < 12) return '早上好';
        if (h >= 12 && h < 14) return '中午好';
        if (h >= 14 && h < 18) return '下午好';
        if (h >= 18 && h < 22) return '晚上好';
        return '夜深了';
    },

    formatTime(now) {
        const h = now.getHours();
        const m = now.getMinutes();
        const s = now.getSeconds();
        return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    },

    formatDate(now) {
        const digits = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        const toCN = (n) => {
            if (n === 10) return '十';
            if (n < 10) return digits[n];
            if (n < 20) return '十' + digits[n - 10];
            return digits[Math.floor(n / 10)] + '十' + (n % 10 ? digits[n % 10] : '');
        };
        const year = String(now.getFullYear()).split('').map(d => digits[+d]).join('');
        return `${year}年${toCN(now.getMonth() + 1)}月${toCN(now.getDate())}日`;
    },

    update() {
        const now = new Date();
        const h = now.getHours();
        const greeting = this.getGreetingByHour(h);

        const h1 = document.querySelector('h1');
        if (h1 && h1.textContent !== greeting) {
            h1.style.opacity = '0';
            setTimeout(() => {
                h1.textContent = greeting;
                h1.style.opacity = '1';
            }, 200);
        }

        const td = document.getElementById('time-display');
        const dd = document.getElementById('date-display');
        if (td) {
            td.style.opacity = '0.7';
            setTimeout(() => {
                td.textContent = this.formatTime(now);
                td.style.opacity = '1';
            }, 50);
        }
        if (dd && dd.textContent !== this.formatDate(now)) {
            dd.style.opacity = '0';
            setTimeout(() => {
                dd.textContent = this.formatDate(now);
                dd.style.opacity = '1';
            }, 200);
        }
    },

    start() {
        this.update();
        setInterval(() => this.update(), 1000);
    }
};
