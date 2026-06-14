# 晚安问候 GoodNight

一个温馨的晚安问候网页应用，显示实时时间、天气预报，并根据节日自动切换到特殊界面。

## 页面预览

- **主界面** - 晚安问候语 + 实时时间 + 天气信息
- **元旦界面** - 星空背景 + 新年倒计时 + 彩带动画
- **春节界面** - 灯笼动画 + 烟花效果 + 爆竹音效

## 功能特性

- 实时时间显示，按时间段显示问候语（早上好/中午好/下午好/晚上好/夜深了）
- 天气信息获取（需配置高德地图 API Key）
- 天气数据缓存（30分钟），减少 API 调用
- 城市记忆功能，自动保存用户选择
- 深色模式支持（跟随系统或手动切换）
- 节日自动跳转（元旦、春节期间）
- PWA 支持，可添加到桌面实现离线访问
- 无障碍优化（ARIA 标签、键盘导航、减少动画）

## 文件结构

```
Helloweb/
├── index.html          # 主页面
├── gregorian.html      # 元旦界面
├── newyear.html        # 春节界面
├── lunar.js            # 农历新年日期计算
├── time.js             # 时间模块
├── weather.js          # 天气模块
├── darkmode.js         # 深色模式模块
├── sw.js               # Service Worker（离线缓存）
├── manifest.json        # PWA 配置
└── config.js           # API 配置（需创建）
```

## 配置

### 天气 API

1. 到 [高德地图开放平台](https://lbs.amap.com/) 注册账号
2. 创建应用获取 Web API Key
3. 编辑 `config.js`，填入你的 API Key：

```javascript
const API_CONFIG = {
    amapApiKey: '你的高德地图API Key'
};
```

## 运行

### 本地预览

```bash
# 使用 Python
python -m http.server 8080

# 或使用任意静态服务器
# 访问 http://localhost:8080
```

### 部署

本项目可部署到任意静态托管服务（GitHub Pages、Netlify、Vercel 等）。

## 节日跳转逻辑

- **元旦**：12月31日 - 1月1日 → 自动跳转 `gregorian.html`
- **春节**：新年前7天 ~ 新年后15天 → 自动跳转 `newyear.html`
- 特殊界面可独立访问，不受节日限制

农历新年日期支持：2020-2030 年

## 技术栈

- HTML5 + CSS3 + JavaScript（原生，无框架）
- 高德地图 Weather API + IP 定位 API
- Service Worker + Cache API（PWA）
- Canvas 2D（烟花动画）
- Web Audio API（爆竹音效）
