const CACHE_NAME = 'goodnight-v1';
const urlsToCache = [
    '/Helloweb/',
    '/Helloweb/index.html',
    '/Helloweb/gregorian.html',
    '/Helloweb/newyear.html',
    '/Helloweb/lunar.js',
    '/Helloweb/config.js',
    '/Helloweb/weather.js',
    '/Helloweb/time.js',
    '/Helloweb/darkmode.js'
];

// 安装事件 - 缓存资源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// 请求拦截 - 缓存优先
self.addEventListener('fetch', (event) => {
    // 跳过非GET请求和API请求
    if (event.request.method !== 'GET' ||
        event.request.url.includes('restapi.amap.com') ||
        event.request.url.includes('api.map.com')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 返回缓存或 fetch 网络
                if (response) {
                    return response;
                }
                return fetch(event.request).then((response) => {
                    // 不缓存非成功的响应
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                });
            })
    );
});
