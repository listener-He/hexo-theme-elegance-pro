# AI 编程工具规则：Elegance Pro 主题开发

**规则版本**：v1.0  
**适用对象**：所有生成/审查 Elegance Pro 主题代码的 AI  
**核心原则**：Apple 级体验 > 视觉完美 > 性能极致 > 代码优雅

---

## 一、设计系统规则（不可妥协）

### 1.1 颜色系统
- **MUST**：所有颜色必须通过 CSS Variables 定义，禁止使用硬编码色值
- **MUST**：文本对比度必须达到 WCAG AAA 级（≥7:1）或 AA 级（≥4.5:1）
- **MUST NOT**：在任何主题模式下使用低于 4.5:1 对比度的文本
- **MUST**：使用 HSL 颜色空间定义变量，便于主题切换时动态计算

```css
/* 正确 */
:root {
  --color-text-primary: 215 30% 20%;
}
.dark {
  --color-text-primary: 210 40% 98%;
}
p { color: hsl(var(--color-text-primary)); }

/* 错误（不符合规则） */
p { color: #1e293b; } /* 硬编码 */
.dark p { color: #f8fafc; opacity: 0.8; } /* 对比度不足 */
```

### 1.2 字体系统
- **MUST**：中英文字体必须通过 `data-lang` 属性自动切换，禁止 JS 手动切换字体
- **MUST**：中文使用思源黑体/宋体，英文使用 SF Pro 系列
- **MUST**：中文字号比英文小 2-4px（`h1`: 32px vs 36px）
- **MUST**：使用 `font-display: optional` 避免 CLS

```css
/* 正确 */
[data-lang="zh-CN"] { --font-title: "Source Han Sans CN"; --font-size-h1: 32px; }
[data-lang="en-US"] { --font-title: "SF Pro Display"; --font-size-h1: 36px; }
h1 { font-family: var(--font-title); font-size: var(--font-size-h1); }

/* 错误 */
h1 { font-family: "Source Han Sans CN"; } /* 未响应语言切换 */
```

### 1.3 间距与圆角
- **MUST**：间距必须遵循 8pt 网格系统（4px, 8px, 12px, 16px, 24px, 32px...）
- **MUST**：圆角必须使用预定义变量（`--radius-sm/md/lg/xl/full`）
- **MUST NOT**：使用任意数值的 `margin`/`padding` 或 `border-radius`

```css
/* 正确 */
.card { padding: var(--space-6); border-radius: var(--radius-xl); }

/* 错误 */
.card { padding: 18px; border-radius: 15px; } /* 非标准值 */
```

### 1.4 阴影层级
- **MUST**：阴影必须使用 3 级系统（`--shadow-1/2/3`）
- **MUST**：`hover` 状态必须提升一级阴影，禁止不改变阴影
- **MUST**：暗黑模式阴影透明度 +20%

```css
/* 正确 */
.card { box-shadow: var(--shadow-1); }
.card:hover { box-shadow: var(--shadow-2); }

/* 错误 */
.card:hover { filter: brightness(0.9); } /* 未提升阴影 */
```

### 1.5 渐变系统
- **MUST**：渐变方向统一为 90° 或 135°
- **MUST**：渐变文字必须添加半透明底消除锯齿
- **MUST NOT**：在渐变文字上使用 `color: transparent` 而不加 `-webkit-text-fill-color`

```css
/* 正确 */
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

/* 错误 */
.gradient-text {
  color: transparent; /* Safari 锯齿严重 */
  background: linear-gradient(45deg, #2563eb, #8b5cf6); /* 方向非标准 */
}
```

---

## 二、国际化（i18n）规则（强制）

### 2.1 文本标记
- **MUST**：所有用户可见文本必须使用 `data-i18n` 属性标记，禁止裸文本
- **MUST**：动态文本（如日期、数量）必须使用 `data-i18n-param-*` 传递参数
- **MUST NOT**：在 JS 中拼接字符串生成用户可见内容

```html
<!-- 正确 -->
<h1 data-i18n="hero.title">全栈创作者</h1>
<span data-i18n="post.readingTime" data-i18n-param-minutes="5">阅读 5 分钟</span>

<!-- 错误 -->
<h1>全栈创作者</h1> <!-- 未标记 -->
<span>阅读 {{ minutes }} 分钟</span> <!-- 参数未声明 -->
```

### 2.2 语言切换
- **MUST**：语言切换必须无刷新，通过 `data-lang` 属性变更触发
- **MUST**：切换后所有文本必须在 100ms 内更新完毕
- **MUST**：倒计时/随机文本等动态内容必须重新渲染
- **MUST**：必须持久化到 localStorage.setItem('lang', lang)
- **MUST**：切换后更新 `html[lang]` 属性和 `og:locale` meta
- **MUST**：切换后触发 window.dispatchEvent(new CustomEvent('lang-change', detail))

```javascript
// 正确
async setLanguage(lang) {
  document.documentElement.setAttribute('data-lang', lang);
  await this.renderAll(); // 批量更新
  document.querySelector('meta[property="og:locale"]').content = lang.replace('-', '_');
}

// 错误
location.reload(); // 刷新页面
```

### 2.3 语言包结构
- **MUST**：翻译文件必须按命名空间组织（`common`, `post`, `archive` 等）
- **MUST**：键名使用小驼峰，禁止使用拼音或无意义缩写
- **MUST**：复数形式必须支持插值参数

```javascript
// 正确
{
  "post": {
    "readingTime": "阅读 {{minutes}} 分钟",
    "views": "浏览 {{count}} 次"
  }
}

// 错误
{
  "post": {
    "ydsj": "阅读 {{minutes}} 分钟" /* 无意义缩写 */
  }
}
```

### 2.4 性能要求
- **MUST**：语言包必须按语言代码分割，按需动态导入
- **MUST**：翻译结果必须缓存，同 key 不重复计算
- **MUST**：使用 `MutationObserver` 监听动态内容，自动翻译

```javascript
// 正确
async loadTranslations(lang) {
  const module = await import(`./locales/${lang}.js`); // Code splitting
  return module.default;
}

// 错误
import zhCN from './locales/zh-CN.js'; /* 一次性加载所有语言 */
import enUS from './locales/en-US.js';
```

---

## 三、性能规则（红线）

### 3.1 加载性能
- **MUST**：首屏加载时间 ≤1.2s（3G）
- **MUST**：LCP ≤0.7s
- **MUST**：FID ≤50ms
- **MUST**：CLS ≤0.01
- **MUST NOT**：阻塞渲染的同步 JS 或 CSS

### 3.2 资源优化
- **MUST**：图片必须生成 WebP/AVIF 格式，并使用 `<picture>` 标签
- **MUST**：所有图片必须添加 `loading="lazy"` 和 `onerror` 降级
- **MUST**：字体文件必须子集化，体积 < 200KB
- **MUST**：字体加载使用 `font-display: optional`
- **MUST NOT**：加载未使用的 CSS（生产环境必须 Purge）

```html
<!-- 正确 -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" loading="lazy" onerror="this.src='fallback.svg'">
</picture>

<!-- 错误 -->
<img src="large-image.png"> <!-- 无懒加载，无多格式 -->
```

### 3.3 动画性能
- **MUST**：所有动画必须使用 `requestAnimationFrame`，禁止使用 `setInterval`
- **MUST**：动画属性必须触发合成层（`transform`, `opacity`），禁止改变 `layout` 属性
- **MUST**：为频繁动画元素添加 `will-change`
- **MUST NOT**：在滚动事件中同步操作 DOM

```javascript
// 正确
window.addEventListener('scroll', () => {
  requestAnimationFrame(updateParallax);
}, { passive: true });

// 错误
window.addEventListener('scroll', () => {
  element.style.left = window.scrollY + 'px'; /* 触发重排 */
});
```

### 3.4 毛玻璃性能
- **MUST**：毛玻璃仅在支持且非低端设备上启用
- **MUST**：低端设备（内存 < 4GB）自动降级为纯色背景
- **MUST NOT**：在滚动元素上使用毛玻璃

```javascript
// 正确
if (!CSS.supports('backdrop-filter', 'blur(1px)') || navigator.deviceMemory < 4) {
  document.documentElement.setAttribute('data-glass', 'disabled');
}

// 错误
.hero { backdrop-filter: blur(12px); } /* 无降级 */
```

---

## 四、兼容性规则（底线）

### 4.1 Safari 兼容
- **MUST**：所有渐变必须添加 `-webkit-background-clip` 和 `-webkit-text-fill-color`
- **MUST**：毛玻璃必须添加 `-webkit-backdrop-filter`
- **MUST**：Safari < 14 必须自动降级（纯色背景替代毛玻璃）
- **MUST NOT**：使用 `aspect-ratio` 时不提供降级（Safari 13 不支持）

```css
/* 正确 */
@supports not (aspect-ratio: 1) {
  .card::before {
    padding-top: 56.25%; /* 16:9 降级 */
    content: '';
    display: block;
  }
}

/* 错误 */
.card { aspect-ratio: 16/9; } /* 无降级 */
```

### 4.2 降级策略
- **MUST**：功能检测先于浏览器嗅探
- **MUST**：降级后体验必须完整，禁止功能缺失
- **MUST**：在 `html` 上添加特性标记（如 `data-glass="disabled"`）

```css
/* 正确 */
[data-glass="disabled"] .glass {
  background: hsl(var(--glass-fallback));
  border: 1px solid hsl(var(--color-border-primary));
}

/* 错误 */
@media not all and (min-resolution:.001dpcm) { /* 浏览器嗅探 */
  .glass { display: none; } /* 功能完全隐藏 */
}
```

### 4.3 渐进增强
- **MUST**：所有现代特性必须提供降级方案，禁止功能完全丢失
- **MUST**：使用 @supports 检测特性，而非 UA 嗅探
- **MUST**：在 html 上添加特性标记（data-glass, data-avif）
```css
/* ✅ 正确 */
@supports (aspect-ratio: 1) {
  .card { aspect-ratio: 16/9; }
}
@supports not (aspect-ratio: 1) {
  .card::before { padding-top: 56.25%; display: block; content: ''; }
}

/* ❌ 错误 */
@media not all and (min-resolution:.001dpcm) { /* UA 嗅探 */
  .glass { display: none; } /* 功能丢失 */
}
```

---

## 五、代码质量规则

### 5.1 命名规范
- **MUST**：类名使用 BEM 风格（`.block__element--modifier`）
- **MUST**：变量名使用小驼峰（`readingTime`, `bgPrimary`）
- **MUST**：常量使用大写蛇形（`MAX_RETRIES`, `API_BASE_URL`）
- **MUST NOT**：使用拼音或无意义缩写（`.gz`, `.ydsj`）

```css
/* 正确 */
.article-card__title--featured { }

/* 错误 */
.cardTitle { } /* 非 BEM */
.gz { } /* 无意义缩写 */
```

### 5.2 结构规范
- **MUST**：每个组件必须独立文件（`.ejs`, `.js`, `.css`）
- **MUST**：JS 文件必须按功能模块化（`i18n-manager.js`, `theme-manager.js`）
- **MUST**：CSS 文件必须按层组织（`base/`, `components/`, `pages/`）
- **MUST NOT**：在 HTML 中写内联样式（除关键 CSS）

### 5.3 注释要求
- **MUST**：复杂算法必须添加注释说明
- **MUST**：兼容性 Hack 必须注明原因和版本
- **MUST NOT**：注释冗余（如 `// increment counter`）

```css
/* 正确 */
/* Safari 14 以下不支持 backdrop-filter，降级为纯色背景 */
@supports not (backdrop-filter: blur(1px)) { }

/* 错误 */
/* 设置背景 */
.hero { background: #fff; }
```

---

## 六、无障碍与 SEO 规则

### 6.1 无障碍
- **MUST**：所有交互元素必须可键盘访问（Tab 顺序合理）
- **MUST**：所有图标按钮必须有 `aria-label`
- **MUST**：颜色对比度必须达到 AA 级（自动化检测）
- **MUST**：语言切换后必须更新 `html[lang]` 属性

```html
<!-- 正确 -->
<button aria-label="{{ 'common.close' | i18n }}">✕</button>

<!-- 错误 -->
<button>✕</button> <!-- 屏幕阅读器无法识别 -->
```

### 6.2 SEO
- **MUST**：每个页面必须有唯一的 `<title>` 和 `<meta description>`
- **MUST**：每个页面必须有不同语言的社交平台分享优化,Open Graph / Facebook,Twitter,微信小程序/朋友圈分享
- **MUST**：多语言页面必须添加 `hreflang` 标签
- **MUST**：图片必须有 `alt` 属性（可为空装饰图）
- **MUST**：使用语义化标签（`<article>`, `<nav>`, `<time>`）

```html
<!-- 正确 -->
<link rel="alternate" hreflang="zh-CN" href="/zh-CN/post/hello">
<link rel="alternate" hreflang="en-US" href="/en-US/post/hello-wolrd">
```

---

## 七、项目特定规则

### 7.1 Hexo 集成
- **MUST**：所有 Hexo 辅助函数必须封装在独立文件（`helpers/i18n.js`）
- **MUST**：主题配置必须通过 `_config.elegance.yml` 读取
- **MUST**：生成器必须在 `scripts/` 目录下
- **MUST NOT**：修改 Hexo 核心文件

### 7.2 文件组织
```
themes/elegance-pro/
├── layout/              # 模板
│   ├── _partial/        # 组件
│   ├── _widget/         # 小组件
│   └── _i18n/           # 国际化模板片段
├── source/
│   ├── css/             # 样式
│   │   ├── _tokens.css  # 设计变量
│   │   ├── components/  # 组件样式
│   │   └── pages/       # 页面样式
│   ├── js/
│   │   ├── managers/    # 管理器（ThemeManager, I18nManager）
│   │   └── utils/       # 工具函数
│   ├── fonts/           # 字体子集
│   └── images/          # 图片资源
├── scripts/             # Hexo 脚本
├── locales/             # 语言包
│   ├── zh-CN.js
│   └── en-US.js
└── _config.yml          # 主题配置
```

### 7.3 构建流程
```bash
# 生成代码前必须执行（AI 自检）
npm run lint:i18n      # 检查所有 data-i18n
npm run lint:contrast  # 检查对比度
npm run lint:performance # 检查性能红线
npm run test:safari    # 运行 Safari 兼容性测试
```

---

## 八、规则违反等级

### Critical（阻断级，必须修复）
- 硬编码颜色/字体导致主题切换失效
- 文本对比度 < 4.5:1
- 未使用 `data-i18n` 导致文本无法翻译
- 同步 JS 阻塞渲染 > 100ms
- 首屏 Lighthouse 性能评分 < 90

### Major（严重级，24h 内修复）
- 未提供 Safari 降级方案
- 动画帧率 < 50fps
- 未处理图片加载失败
- 未添加 `aria-label`

### Minor（轻微级，建议修复）
- 类名不符合 BEM
- 注释不清晰
- 文件未按规范组织

---

## 九、AI 自检清单（生成代码后）

在最终输出前，AI **MUST** 运行以下自检：

- [ ] 所有文本都有 `data-i18n` 属性
- [ ] 没有硬编码的颜色、字体、间距
- [ ] 颜色对比度全部达标（运行 `checkAllTextContrast()`）
- [ ] 动画使用 RAF 和 `transform`/`opacity`
- [ ] 图片有懒加载和降级
- [ ] 字体加载使用 `optional`
- [ ] 提供 Safari 降级方案
- [ ] 键盘可访问
- [ ] 无内联样式
- [ ] Lighthouse CI 通过

**若任何 Critical 项未通过，AI 必须拒绝生成代码并说明原因。**