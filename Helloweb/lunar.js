// 农历新年算法
var LunarNewYear = {
    // 农历新年日期表 (月, 日) - 覆盖 2020-2030 年
    dates: {
        2020: [1, 25], 2021: [2, 12], 2022: [2, 1], 2023: [1, 22],
        2024: [2, 10], 2025: [1, 29], 2026: [2, 17], 2027: [2, 6],
        2028: [1, 26], 2029: [2, 13], 2030: [2, 3]
    },
    // 获取指定年份的农历新年日期
    getDate: function(year) {
        if (this.dates[year]) {
            var d = this.dates[year];
            return new Date(year, d[0] - 1, d[1], 0, 0, 0);
        }
        // 默认返回 2月1日
        return new Date(year, 1, 1, 0, 0, 0);
    },
    // 判断当前是否在新年期间（新年前7天 ~ 新年后15天）
    isDuringNewYear: function() {
        var now = new Date();
        var year = now.getFullYear();
        var thisYearNY = this.getDate(year);
        var lastYearNY = this.getDate(year - 1);
        var nextYearNY = this.getDate(year + 1);

        // 检查当前时间是否在任一农历新年期间
        return this.isInPeriod(now, lastYearNY) ||
               this.isInPeriod(now, thisYearNY) ||
               this.isInPeriod(now, nextYearNY);
    },
    // 检查时间是否在某个新年期间内
    isInPeriod: function(now, newYearDate) {
        var start = new Date(newYearDate);
        start.setDate(start.getDate() - 7); // 新年前7天开始
        var end = new Date(newYearDate);
        end.setDate(end.getDate() + 15); // 新年后15天结束
        return now >= start && now <= end;
    },
    // 获取最近的新年日期（用于倒计时）
    getNearestNewYear: function() {
        var now = new Date();
        var year = now.getFullYear();
        var thisYearNY = this.getDate(year);
        var nextYearNY = this.getDate(year + 1);

        if (now < thisYearNY) {
            return thisYearNY;
        } else {
            return nextYearNY;
        }
    }
};
