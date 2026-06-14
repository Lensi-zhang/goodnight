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

const weatherIcons = {
    '晴': '☀️', '多云': '☁️', '阴': '☁️', '小雨': '🌦️', '中雨': '🌧️',
    '大雨': '⛈️', '暴雨': '⛈️', '雷阵雨': '⛈️', '小雪': '❄️', '中雪': '❄️',
    '大雪': '❄️', '雾': '🌫️', '霾': '🌫️', 'default': '☀️'
};

let currentWeatherData = null;

function getWeatherData() {
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
        document.getElementById('weather-icon').textContent = weatherIcons[d.weatherType] || weatherIcons.default;
        document.getElementById('weather-desc').textContent = d.description;
        document.getElementById('humidity-wind').textContent = `湿度: ${d.humidity}% | 风速: ${d.windSpeed} 级`;
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
