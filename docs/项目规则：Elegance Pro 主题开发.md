# AI 编程工具规则：Elegance Pro 主题开发 v2.0

**规则版本**：v2.0  
**适用对象**：所有生成/审查 Elegance Pro 主题代码的 AI  
**核心原则**：Apple 级体验 > 视觉完美 > 性能极致 > 代码优雅 > 充足扩展性  
**强制规范**：必须完全遵守 Hexo 主题开发规范及 Plugin API  
**架构原则**：静态优先，交互增强 - 所有核心内容（包括多语言）在构建时静态生成，CSS 变量与状态机驱动交互，最小化运行时 JS 依赖  
**扩展性原则**：提供 ≥10 个官方注入点（Injects），支持自定义 HTML/JS/CSS 注入，无需修改核心源码

---

## 一、设计系统规则（不可妥协）

### 1.1 全局配置驱动
- **MUST**：所有用户可见文本、颜色、字体、间距、开关必须通过 `_config.elegance.yml` 配置
- **MUST**：使用 Hexo 的 `theme_config` 统一读取配置，禁止硬编码 JSON 文件
- **MUST**：布局模板必须包含以下强制注入点辅助函数调用：
  ```ejs
  <!-- 在 <head> 顶部 -->
  <%- inject('head_begin') %>
  
  <!-- 在 </head> 之前 -->
  <%- inject('head_end') %>
  
  <!-- 在 <body> 顶部 -->
  <%- inject('body_begin') %>
  
  <!-- 在 </body> 之前 -->
  <%- inject('body_end') %>
  
  <!-- 文章区域开始 -->
  <%- inject('post_begin') %>
  
  <!-- 文章区域结束 -->
  <%- inject('post_end') %>
  
  <!-- 评论区位置 -->
  <%- inject('comment_area') %>
  ```
- **MUST**：Inject 实现必须支持数组（多行注入）和字符串配置
- **MUST**：所有 Hexo 官方/社区插件（SEO、Feed、Sitemap、Search、Image）优先适配，主题仅负责样式

### 1.2 颜色系统
- **MUST**：所有颜色必须通过 CSS Variables 定义，禁止硬编码色值
- **MUST**：文本对比度必须达到 WCAG AAA 级（≥7:1）或 AA 级（≥4.5:1）
- **MUST NOT**：任何模式下使用低于 4.5:1 对比度的文本
- **MUST**：使用 HSL 颜色空间定义变量
- **HSL 格式**：必须使用 `hsl(var(--var-name))` 或 `hsl(var(--var-name) / alpha)`

```css
/* ✅ 正确 */
:root {
  --color-text-primary: 215 30% 20%;
  --color-bg-primary: 210 40% 98%;
}
.dark {
  --color-text-primary: 210 40% 98%;
  --color-bg-primary: 222 47% 11%;
}
p { color: hsl(var(--color-text-primary)); }

/* ❌ 错误 */
p { color: #1e293b; } /* 硬编码 */
.dark p { color: #f8fafc; opacity: 0.8; } /* 对比度不足 */
```

### 1.3 字体系统
- **MUST**：中英文字体必须通过 `data-lang` 属性自动切换，禁止 JS 手动切换
- **MUST**：中文使用思源黑体/宋体，英文使用 SF Pro 系列
- **MUST**：中文字号比英文小 2-4px（h1: 32px vs 36px）
- **MUST**：使用 `font-display: optional` 避免 CLS

```css
/* ✅ 正确 */
[data-lang="zh-CN"] { 
  --font-title: "Source Han Sans CN"; 
  --font-size-h1: 32px; 
}
[data-lang="en-US"] { 
  --font-title: "SF Pro Display"; 
  --font-size-h1: 36px; 
}
h1 { font-family: var(--font-title); font-size: var(--font-size-h1); }

/* ❌ 错误 */
h1 { font-family: "Source Han Sans CN"; } /* 未响应语言切换 */
```

### 1.4 间距与圆角
- **MUST**：间距必须遵循 8pt 网格系统（4, 8, 12, 16, 24, 32, 48, 64px）
- **MUST**：圆角必须使用预定义变量（`--radius-sm/md/lg/xl/full`）
- **MUST NOT**：使用任意数值的 `margin`/`padding` 或 `border-radius`

```css
/* ✅ 正确 */
.card { padding: var(--space-6); border-radius: var(--radius-xl); }

/* ❌ 错误 */
.card { padding: 18px; border-radius: 15px; } /* 非标准值 */
```

### 1.5 阴影层级
- **MUST**：阴影必须使用 3 级系统（`--shadow-1/2/3`）
- **MUST**：hover 状态必须提升一级阴影
- **MUST**：暗黑模式阴影透明度 +20%

### 1.6 渐变系统
- **MUST**：渐变方向统一为 90° 或 135°
- **MUST**：渐变文字必须添加半透明底消除锯齿
- **MUST**：必须同时设置 `-webkit-background-clip` 和 `-webkit-text-fill-color`

```css
/* ✅ 正确 */
.gradient-text {
  background: linear-gradient(90deg, hsl(var(--color-accent-start)), hsl(var(--color-accent-end)));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}
.gradient-text::after {
  content: attr(data-text-zh);
  position: absolute;
  z-index: -1;
  -webkit-text-fill-color: hsl(var(--color-accent-start) / 0.03);
}

/* ❌ 错误 */
.gradient-text {
  color: transparent; /* Safari 锯齿严重 */
  background: linear-gradient(45deg, #2563eb, #8b5cf6); /* 方向非标准 */
}
```

---

## 二、国际化（i18n）规则（强制）

### 2.1 静态生成优先原则
- **MUST**：多语言内容必须在构建时生成，禁止运行时 JS 动态替换文本
- **MUST**：模板必须遍历 `theme_config.languages` 配置，为每种语言生成独立 DOM 节点
- **MUST**：每个语言节点必须包含 `data-lang-code="..."` 属性
- **MUST**：内容必须通过 Hexo 的 `__('key')` 或自定义 Helper 获取

```ejs
<!-- ✅ 正确 -->
<h1 class="hero-title">
  <% theme_config.languages.forEach(lang => { %>
    <span class="i18n-node" data-lang-code="<%= lang %>">
      <%= __('hero.title', { lang: lang }) %>
    </span>
  <% }) %>
</h1>

<!-- CSS 控制 -->
<style>
.i18n-node { display: none; }
html[data-lang="zh-CN"] .i18n-node[data-lang-code="zh-CN"],
html[data-lang="en-US"] .i18n-node[data-lang-code="en-US"] {
  display: inline-block;
  animation: fadeIn 0.3s ease;
}
</style>

<!-- ❌ 错误 -->
<h1 id="hero-title">默认文本</h1>
<script>document.getElementById('hero-title').innerText = translations[lang].hero.title;</script>
```

### 2.2 语言切换机制
- **MUST**：语言切换仅修改 `html[data-lang]` 属性和 `localStorage`，不刷新页面
- **MUST**：切换后更新 `html[lang]` 属性和 `og:locale` meta
- **MUST**：切换后触发 `window.dispatchEvent(new CustomEvent('lang-change', {detail}))`
- **MUST**：倒计时/随机文本等动态内容必须在切换后重新渲染

```javascript
// ✅ 正确（内联在 head 的轻量脚本）
(function() {
  const savedLang = localStorage.getItem('lang');
  const browserLang = navigator.language;
  const initialLang = savedLang || (browserLang.startsWith('en') ? 'en-US' : 'zh-CN');
  document.documentElement.setAttribute('data-lang', initialLang);
  document.documentElement.setAttribute('lang', initialLang.split('-')[0]);
})();
```

### 2.3 语言包结构
- **MUST**：翻译文件必须按命名空间组织（`common`, `post`, `archive` 等）
- **MUST**：键名使用小驼峰，禁止拼音或无意义缩写
- **MUST**：复数形式必须支持插值参数

```javascript
// ✅ 正确
{
  "post": {
    "readingTime": "阅读 {{minutes}} 分钟",
    "views": "浏览 {{count}} 次"
  }
}

// ❌ 错误
{
  "post": {
    "ydsj": "阅读 {{minutes}} 分钟" /* 无意义缩写 */
  }
}
```

### 2.4 性能要求
- **MUST**：语言包必须在构建时打包，禁止运行时动态导入
- **MUST**：翻译结果通过静态 HTML 输出，浏览器无计算开销
- **MUST**：CSS 切换方案避免任何 JS 重排

---

## 三、图标与媒体资源规则

### 3.1 统一图标系统
- **MUST**：全站图标必须使用 Tabler Icons（SVG）
- **MUST**：创建 `icon(name, class)` 辅助函数，优先读取 `theme_config.icons.custom`
- **MUST NOT**：在模板中硬编码 `<svg>` 字符串或使用 `<i class="fa ...">`（FontAwesome）

```ejs
<!-- ✅ 正确 -->
<%- icon('brand-github', 'w-6 h-6') %>

<!-- 辅助函数实现（scripts/helpers/icon.js） -->
hexo.extend.helper.register('icon', function(name, className) {
  const custom = this.theme_config.icons?.custom?.[name];
  if (custom) return custom;
  
  const tabler = getTablerIcon(name); // 从 tabler-icons 包读取
  return tabler.replace('<svg', `<svg class="${className}" role="img"`);
});
```

### 3.2 社交链接规范
- **MUST**：社交链接区域必须通过遍历 `theme_config.social` 配置生成
- **MUST**：每个社交项必须包含：icon（SVG name）、link、i18n_key（用于 aria-label）

---

## 四、性能规则（红线）

### 4.1 加载性能
- **MUST**：首屏加载时间 ≤1.2s（3G）
- **MUST**：LCP ≤0.7s
- **MUST**：FID ≤50ms
- **MUST**：CLS ≤0.01
- **MUST NOT**：阻塞渲染的同步 JS 或 CSS

### 4.2 资源优化
- **MUST**：图片必须生成 WebP/AVIF 格式，并使用 `<picture>` 标签
- **MUST**：所有图片必须添加 `loading="lazy"` 和 `onerror` 降级
- **MUST**：字体文件必须子集化，体积 < 200KB
- **MUST**：字体加载使用 `font-display: optional`
- **MUST NOT**：加载未使用的 CSS（生产环境必须 Purge）

```html
<!-- ✅ 正确 -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" loading="lazy" onerror="this.src='fallback.svg'">
</picture>
```

### 4.3 动画性能
- **MUST**：所有动画必须使用 `requestAnimationFrame`，禁止使用 `setInterval`
- **MUST**：动画属性必须触发合成层（`transform`, `opacity`），禁止改变 `layout` 属性
- **MUST**：为频繁动画元素添加 `will-change`
- **MUST NOT**：在滚动事件中同步操作 DOM

```javascript
// ✅ 正确
window.addEventListener('scroll', () => {
  requestAnimationFrame(updateParallax);
}, { passive: true });
```

### 4.4 毛玻璃性能降级
- **MUST**：毛玻璃仅在支持且非低端设备上启用
- **MUST**：低端设备（内存 < 4GB）自动降级为纯色背景
- **MUST NOT**：在滚动元素上使用毛玻璃

---

## 五、兼容性规则（底线）

### 5.1 Safari 兼容
- **MUST**：所有渐变必须添加 `-webkit-background-clip` 和 `-webkit-text-fill-color`
- **MUST**：毛玻璃必须添加 `-webkit-backdrop-filter`
- **MUST**：Safari < 14 必须自动降级（纯色背景替代毛玻璃）
- **MUST NOT**：使用 `aspect-ratio` 时不提供降级方案

```css
/* ✅ 正确 */
@supports not (aspect-ratio: 1) {
  .card::before {
    padding-top: 56.25%;
    content: '';
    display: block;
  }
}
```

### 5.2 降级策略
- **MUST**：功能检测先于浏览器嗅探
- **MUST**：降级后体验必须完整，禁止功能缺失
- **MUST**：在 `html` 上添加特性标记（如 `data-glass="disabled"`）

### 5.3 渐进增强
- **MUST**：所有现代特性必须提供降级方案
- **MUST**：使用 `@supports` 检测特性，而非 UA 嗅探

---

## 六、无障碍与 SEO 规则

### 6.1 无障碍
- **MUST**：所有交互元素必须可键盘访问（Tab 顺序合理）
- **MUST**：所有图标按钮必须有 `aria-label`
- **MUST**：颜色对比度必须达到 AA 级（自动化检测）
- **MUST**：语言切换后必须更新 `html[lang]` 属性

```html
<!-- ✅ 正确 -->
<button aria-label="<%= __('common.close') %>">
  <%- icon('x', 'w-5 h-5') %>
</button>
```

### 6.2 SEO
- **MUST**：每个页面必须有唯一的 `<title>` 和 `<meta description>`
- **MUST**：支持 Open Graph、Twitter Card、微信分享优化
- **MUST**：多语言页面必须添加 `hreflang` 标签
- **MUST**：图片必须有 `alt` 属性（装饰图可为空）
- **MUST**：使用语义化标签（`<article>`, `<nav>`, `<time>`）

```html
<!-- ✅ 正确 -->
<link rel="alternate" hreflang="zh-CN" href="/zh-CN/post/hello">
<link rel="alternate" hreflang="en-US" href="/en-US/post/hello-world">
```

---

## 七、文件组织规范

```
themes/elegance-pro/
├── layout/                 # 模板
│   ├── _partial/          # 页面片段
│   ├── _widget/           # 小组件
│   ├── _i18n/             # 国际化模板片段
│   ├── layout.ejs         # 基础布局
│   ├── index.ejs          # 首页
│   ├── post.ejs           # 文章页
│   ├── archive.ejs        # 归档页
│   └── ...
├── source/
│   ├── css/               # 样式
│   │   ├── _tokens.css    # 设计变量
│   │   ├── base.css       # 基础样式
│   │   ├── components.css # 组件样式
│   │   └── pages.css      # 页面样式
│   ├── js/
│   │   ├── i18n-switch.js # 语言切换（<1KB）
│   │   └── theme-switch.js# 主题切换（<1KB）
│   ├── fonts/             # 字体子集
│   └── images/            # 图标等静态资源
├── scripts/               # Hexo 脚本
│   ├── helpers/           # 自定义辅助函数
│   ├── generators/        # 生成器
│   └── filters/           # 过滤器
├── locales/               # 语言包
│   ├── zh-CN.yml
│   └── en-US.yml
└── _config.yml            # 主题配置
```

### 7.1 命名规范
- **MUST**：类名使用 BEM 风格（`.block__element--modifier`）
- **MUST**：变量名使用小驼峰（`readingTime`, `bgPrimary`）
- **MUST**：常量使用大写蛇形（`MAX_RETRIES`）
- **MUST NOT**：使用拼音或无意义缩写（`.gz`, `.ydsj`）

---

## 八、组件设计规范

### 8.1 按钮组件
```ejs
<!-- 模板使用 -->
<%- partial('_widget/button', { 
  text: 'hero.cta', 
  i18n: true,
  href: '/about',
  variant: 'primary',
  size: 'md'
}) %>

<!-- 组件实现 -->
<button class="btn btn--<%= variant %> btn--<%= size %>">
  <% if (i18n) { %>
    <% languages.forEach(lang => { %>
      <span class="i18n-node" data-lang-code="<%= lang %>"><%= __(text, {lang}) %></span>
    <% }) %>
  <% } else { %>
    <span><%= text %></span>
  <% } %>
</button>
```

### 8.2 卡片组件
```css
.card {
  background: hsl(var(--card-bg));
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-1);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-2);
}
```

### 8.3 注入点配置示例
```yaml
# _config.elegance.yml
inject:
  head_begin:
    - '<meta name="my-meta" content="value">'
    - '<link rel="preconnect" href="https://fonts.googleapis.com">'
  body_end:
    - '<script src="/js/custom.js"></script>'
  comment_area:
    - '<div id="waline"></div>'
```

---

## 九、构建流程与自检清单

### 9.1 构建命令
```bash
# 开发模式
npm run dev      # 启动 Hexo + 监听文件 + PostCSS

# 生产构建
npm run build    # 生成 + 压缩 + PurgeCSS

# 质量检查
npm run lint:i18n      # 检查所有 data-i18n 标记
npm run lint:contrast  # 检查对比度
npm run test:accessibility # 运行 axe-core
```

### 9.2 AI 自检清单（生成代码后）
在最终输出前，AI **必须**验证：

- [ ] 所有用户可见文本都有 `data-i18n` 属性或静态多语言节点
- [ ] 没有硬编码颜色、字体、间距值
- [ ] 颜色对比度全部 ≥4.5:1（运行自动化检测）
- [ ] 动画使用 `transform`/`opacity` + RAF
- [ ] 图片有 `loading="lazy"` 和 `onerror` 降级
- [ ] 字体加载使用 `font-display: optional`
- [ ] 提供 Safari 降级方案（`@supports not`）
- [ ] 所有交互元素支持键盘访问和 `aria-label`
- [ ] 无内联样式（除关键 CSS）
- [ ] Lighthouse CI 性能评分 ≥95
- [ ] 注入点辅助函数在所有布局文件中正确调用

**若任何 Critical 项未通过，AI 必须拒绝生成代码并说明原因。**

---

## 十、规则违反等级

### Critical（阻断级，必须修复）
- 硬编码颜色/字体导致主题切换失效
- 文本对比度 < 4.5:1
- 未使用静态生成多语言节点
- 同步 JS 阻塞渲染 > 100ms
- 未提供 Safari 降级方案
- Lighthouse 性能评分 < 90

### Major（严重级，24h 内修复）
- 动画帧率 < 50fps
- 未处理图片加载失败
- 未添加 `aria-label`
- 注入点缺失

### Minor（轻微级，建议修复）
- 类名不符合 BEM
- 注释不清晰
- 文件未按规范组织

---

## 十一、快速开始

```bash
# 1. 安装主题
git clone https://github.com/listener-He/hexo-theme-elegance-pro.git themes/elegance-pro

# 2. 配置主题
cp themes/elegance-pro/_config.yml _config.elegance.yml

# 3. 修改 Hexo 配置
# _config.yml
theme: elegance-pro
language: [zh-CN, en-US]

# 4. 开发
cd themes/elegance-pro && npm install && npm run dev
```

---

**本规范自 v2.0 起生效，所有 AI 生成代码必须严格遵守。违反 Critical 规则的代码将无法通过 CI 检测。**
**若任何 Critical 项未通过，AI 必须拒绝生成代码并说明原因。**
