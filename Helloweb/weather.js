// 天气模块
const WeatherModule = {
    CACHE_KEY: 'goodnight_weather_cache',
    CACHE_DURATION: 30 * 60 * 1000, // 30分钟缓存
    CITY_KEY: 'goodnight_user_city',

    // 从缓存获取天气
    getCachedWeather() {
        const cached = localStorage.getItem(this.CACHE_KEY);
        if (cached) {
            const data = JSON.parse(cached);
            if (Date.now() - data.timestamp < this.CACHE_DURATION) {
                return data.weather;
            }
        }
        return null;
    },

    // 缓存天气数据
    cacheWeather(weather) {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify({
            weather,
            timestamp: Date.now()
        }));
    },

    // 获取保存的城市
    getSavedCity() {
        return localStorage.getItem(this.CITY_KEY);
    },

    // 保存城市
    saveCity(city) {
        localStorage.setItem(this.CITY_KEY, city);
    }
};

// 城市映射
const regionMap = {
    '华中地区': '武汉', '华北地区': '北京', '华东地区': '上海',
    '华南地区': '广州', '西北地区': '西安', '西南地区': '成都', '东北地区': '沈阳'
};

// 线条天气图标：与宋韵版式统一，避免 emoji 破坏质感
const weatherIcons = {
    '晴': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.2"/><circle cx="12" cy="12" r="1" fill="var(--vermilion)" stroke="none"/><path d="M12 2.8v2.2M12 19v2.2M2.8 12h2.2M19 12h2.2M5.5 5.5l1.6 1.6M16.9 16.9l1.6 1.6M18.5 5.5l-1.6 1.6M7.1 16.9l-1.6 1.6"/></svg>`,
    '多云': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8.6" cy="8.4" r="3.1"/><path d="M8.6 3.4v1.3M3.6 8.4h1.3M4.9 4.7l.9.9M12.3 4.7l-.9.9"/><path d="M8.4 19.6a4 4 0 0 1-.4-7.98A5.9 5.9 0 0 1 18.7 12.2a3.5 3.5 0 0 1-.5 7.4H8.4Z"/></svg>`,
    '阴': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a4.3 4.3 0 0 1-.5-8.57A6.4 6.4 0 0 1 18.6 10.6a3.8 3.8 0 0 1-.6 7.4H7Z"/><path d="M9 21h9" opacity=".45"/></svg>`,
    '小雨': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16a4.3 4.3 0 0 1-.5-8.57A6.4 6.4 0 0 1 18.6 8.6a3.8 3.8 0 0 1-.6 7.4H7Z"/><path d="M9 19.2l-1 2.2M13 19.2l-1 2.2M17 19.2l-1 2.2"/></svg>`,
    '中雨': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 15.6a4.3 4.3 0 0 1-.5-8.57A6.4 6.4 0 0 1 18.6 8.2a3.8 3.8 0 0 1-.6 7.4H7Z"/><path d="M8 18.8l-1.2 2.6M12 18.8l-1.2 2.6M16 18.8l-1.2 2.6M20 18.8l-1.2 2.6"/></svg>`,
    '大雨': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 15.4a4.3 4.3 0 0 1-.5-8.57A6.4 6.4 0 0 1 18.6 8a3.8 3.8 0 0 1-.6 7.4H7Z"/><path d="M8.4 18.4l-1.6 3.4M13 18.4l-1.6 3.4M17.6 18.4l-1.6 3.4"/></svg>`,
    '暴雨': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 14.8a4.3 4.3 0 0 1-.5-8.57A6.4 6.4 0 0 1 18.6 7.4a3.8 3.8 0 0 1-.6 7.4H7Z"/><path d="M8.2 17.4l-1.4 3M12 17.4l-1.4 3M15.8 17.4l-1.4 3"/><path d="M15.5 16.6l2 3.2h-1.5l1.8 3" stroke="var(--vermilion)"/></svg>`,
    '雷阵雨': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 14.4a4.3 4.3 0 0 1-.5-8.57A6.4 6.4 0 0 1 18.6 7a3.8 3.8 0 0 1-.6 7.4H7Z"/><path d="M13.4 16.2l-2.2 3.4h1.9l-1.1 3.2 3.1-4.2h-1.9l1.2-2.4" stroke="var(--vermilion)"/></svg>`,
    '小雪': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 14.4a4.3 4.3 0 0 1-.5-8.57A6.4 6.4 0 0 1 18.6 7a3.8 3.8 0 0 1-.6 7.4H7Z"/><path d="M12 18.4v4M10 19.4l4 2M14 19.4l-4 2"/></svg>`,
    '中雪': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 14a4.3 4.3 0 0 1-.5-8.57A6.4 6.4 0 0 1 17.6 6.6a3.8 3.8 0 0 1-.6 7.4H6Z"/><path d="M8.4 18.2v3.4M6.9 19l3 1.7M10 19l-3 1.7M15.4 18.2v3.4M13.9 19l3 1.7M17 19l-3 1.7"/></svg>`,
    '大雪': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 13.4v7.4M8.8 15.3l6.4 3.6M15.2 15.3l-6.4 3.6M5.5 12.6a4.3 4.3 0 0 1-.5-8.57A6.4 6.4 0 0 1 17.1 5.2a3.8 3.8 0 0 1-.6 7.4H5.5Z" opacity=".55"/></svg>`,
    '雾': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h16M6 12h12M4 16h16M7 20h10"/><circle cx="12" cy="12" r="1" fill="var(--vermilion)" stroke="none"/></svg>`,
    '霾': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7.5h16M6 11.5h12M4 15.5h16M7 19.5h10"/><path d="M18.8 3.2l2 2M20.8 3.2l-2 2" stroke="var(--vermilion)" opacity=".8"/></svg>`,
    'default': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.2"/><circle cx="12" cy="12" r="1" fill="var(--vermilion)" stroke="none"/><path d="M12 2.8v2.2M12 19v2.2M2.8 12h2.2M19 12h2.2"/></svg>`
};

let currentWeatherData = null;

function getWeatherData() {
    // 未配置高德 API Key 时保留占位展示，避免页面停留在“加载中”
    if (typeof API_CONFIG === 'undefined' || !API_CONFIG.amapApiKey || /^YOUR_/.test(API_CONFIG.amapApiKey)) {
        const savedCity = WeatherModule.getSavedCity();
        if (savedCity) document.getElementById('location').textContent = savedCity;
        return;
    }

    const cached = WeatherModule.getCachedWeather();
    if (cached) {
        updateWeather(cached);
        return;
    }

    document.getElementById('temperature').textContent = '加载中...';
    document.getElementById('weather-desc').textContent = '获取天气信息中...';
    document.getElementById('humidity-wind').textContent = '';

    const savedCity = WeatherModule.getSavedCity();
    if (savedCity) {
        getWeatherByCity(savedCity);
    } else {
        getLocationByIP();
    }
}

function getLocationByIP() {
    const amapApiKey = API_CONFIG.amapApiKey;
    const url = `https://restapi.amap.com/v3/ip?key=${amapApiKey}`;
    const cb = 'cb_' + Date.now();
    window[cb] = function(data) {
        if (data.status === '1') {
            let city = data.city || data.province;
            if (regionMap[city]) city = regionMap[city];
            WeatherModule.saveCity(city);
            getWeatherByCity(city);
        }
        cleanup(cb);
    };
    createScript(url + '&output=jsonp&callback=' + cb, cb);
}

function createScript(url, cb) {
    const s = document.createElement('script');
    s.id = 'p-' + cb;
    s.src = url;
    s.onerror = () => cleanup(cb);
    document.head.appendChild(s);
}

function cleanup(cb) {
    setTimeout(() => {
        const el = document.getElementById('p-' + cb);
        if (el && el.parentNode) el.parentNode.removeChild(el);
        delete window[cb];
    }, 0);
}

function getWeatherByCity(city) {
    if (typeof API_CONFIG === 'undefined' || !API_CONFIG.amapApiKey || /^YOUR_/.test(API_CONFIG.amapApiKey)) {
        const el = document.getElementById('location');
        if (el) el.textContent = city;
        return;
    }

    const amapApiKey = API_CONFIG.amapApiKey;
    const url = `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(city)}&key=${amapApiKey}`;
    const cb = 'gc_' + Date.now();
    window[cb] = function(data) {
        if (data.status === '1' && data.geocodes && data.geocodes.length > 0) {
            const loc = data.geocodes[0].location;
            const parts = loc.split(',');
            getAmapWeather(parseFloat(parts[1]), parseFloat(parts[0]), city);
        }
        cleanup(cb);
    };
    createScript(url + '&output=jsonp&callback=' + cb, cb);
}

function getAmapWeather(lat, lon, city) {
    const amapApiKey = API_CONFIG.amapApiKey;
    const url = `https://restapi.amap.com/v3/geocode/regeo?location=${lon},${lat}&key=${amapApiKey}`;
    const cb = 'rg_' + Date.now();
    window[cb] = function(data) {
        if (data.status === '1' && data.regeocode && data.regeocode.addressComponent) {
            const ad = data.regeocode.addressComponent.adcode;
            if (ad) fetchWeather(ad, city);
        }
        cleanup(cb);
    };
    createScript(url + '&output=jsonp&callback=' + cb, cb);
}

function fetchWeather(adcode, city) {
    const amapApiKey = API_CONFIG.amapApiKey;
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${adcode}&key=${amapApiKey}`;
    const cb = 'w_' + Date.now();
    window[cb] = function(data) {
        if (data.status === '1' && data.lives && data.lives.length > 0) {
            const w = data.lives[0];
            const weatherData = {
                city,
                temperature: w.temperature,
                description: w.weather,
                humidity: w.humidity,
                windSpeed: w.windpower,
                weatherType: w.weather
            };
            WeatherModule.cacheWeather(weatherData);
            updateWeather(weatherData);
        }
        cleanup(cb);
    };
    createScript(url + '&output=jsonp&callback=' + cb, cb);
}

function updateWeather(d) {
    currentWeatherData = d;
    const c = document.querySelector('.weather-container');
    c.style.transform = 'translateY(5px)';
    c.style.opacity = '0.9';
    setTimeout(() => {
        document.getElementById('location').textContent = d.city;
        document.getElementById('temperature').textContent = d.temperature + '°C';
        document.getElementById('weather-icon').innerHTML = weatherIcons[d.weatherType] || weatherIcons.default;
        document.getElementById('weather-desc').textContent = d.description;
        document.getElementById('humidity-wind').textContent = `湿度 ${d.humidity}% · 风速 ${d.windSpeed} 级`;
        c.style.transform = 'translateY(0)';
        c.style.opacity = '1';
    }, 200);
    updateGreeting();
}

function updateGreeting() {
    if (!currentWeatherData) return;
    const city = currentWeatherData.city || '未知位置';
    const weather = currentWeatherData.description || '未知天气';
    const temp = currentWeatherData.temperature || '--';
    const h = new Date().getHours();
    const list = [
        `${city}的${h}点，${weather}${temp}°C，愿你心情如阳光般温暖！`,
        `${weather}的${city}，${temp}°C，${h}点的时光最适合享受生活！`,
        `在${city}${weather}的${h}点，${temp}°C的温度，祝你有个愉快的一天！`,
        `${h}点的${city}，${weather}宜人，${temp}°C正舒适，一切都会好起来的！`,
        `今天${city}${weather}，${temp}°C，${h}点的你，最美最棒！`
    ];
    const el = document.getElementById('greeting');
    el.style.opacity = '0';
    setTimeout(() => {
        el.textContent = list[Math.floor(Math.random() * list.length)];
        el.style.opacity = '1';
    }, 300);
}

// 城市选择
const presetCities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '重庆'];

function initCitySelector() {
    const selector = document.getElementById('citySelector');
    if (!selector) return;

    presetCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        selector.appendChild(option);
    });

    const savedCity = WeatherModule.getSavedCity();
    if (savedCity) {
        selector.value = savedCity;
    }

    selector.addEventListener('change', (e) => {
        const city = e.target.value;
        WeatherModule.saveCity(city);
        getWeatherByCity(city);
    });
}
