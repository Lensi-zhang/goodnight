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

    // 二十四节气（按常用日期估算，误差 1 天以内）
    getSolarTerm(now) {
        const terms = [
            ['小寒', 1, 6], ['大寒', 1, 20], ['立春', 2, 4], ['雨水', 2, 19],
            ['惊蛰', 3, 6], ['春分', 3, 21], ['清明', 4, 5], ['谷雨', 4, 20],
            ['立夏', 5, 6], ['小满', 5, 21], ['芒种', 6, 6], ['夏至', 6, 21],
            ['小暑', 7, 7], ['大暑', 7, 23], ['立秋', 8, 8], ['处暑', 8, 23],
            ['白露', 9, 8], ['秋分', 9, 23], ['寒露', 10, 8], ['霜降', 10, 23],
            ['立冬', 11, 7], ['小雪', 11, 22], ['大雪', 12, 7], ['冬至', 12, 22]
        ];
        const md = (now.getMonth() + 1) * 100 + now.getDate();
        let current = '冬至';
        for (const [name, month, day] of terms) {
            if (month * 100 + day <= md) current = name;
            else break;
        }
        return current;
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

        const st = document.getElementById('solar-term');
        const term = this.getSolarTerm(now);
        if (st && st.textContent !== term) {
            st.textContent = term;
        }
    },

    start() {
        this.update();
        setInterval(() => this.update(), 1000);
    }
};
