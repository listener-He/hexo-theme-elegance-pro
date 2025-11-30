# Elegance Pro 主题项目结构说明

本文档详细描述了 Elegance Pro Hexo 主题的项目结构和组织规范，确保项目符合 Hexo 主题开发的最佳实践。

## 项目根目录结构

```
hexo-theme-elegance-pro/
├── _config.yml                 # 主题配置文件
├── package.json                # npm 包配置文件
├── package-lock.json           # npm 包锁定文件
├── README.md                   # 项目说明文档
├── LICENSE                     # 开源许可证
├── docs/                       # 文档目录
├── layout/                     # 页面模板目录
├── source/                     # 静态资源目录
├── scripts/                    # 自定义脚本目录
├── locales/                    # 国际化语言包目录
└── node_modules/               # npm 依赖包目录
```

## 各目录详细说明

### 1. layout/ - 页面模板目录

包含所有页面的 EJS 模板文件，这是 Hexo 主题的核心部分。

```
layout/
├── layout.ejs                  # 基础模板文件
├── index.ejs                   # 首页模板
├── post.ejs                    # 文章页模板
├── page.ejs                    # 页面模板
├── archive.ejs                 # 归档页模板
├── categories.ejs              # 分类页模板
├── tags.ejs                    # 标签页模板
├── about.ejs                   # 关于页模板
├── 404.ejs                     # 404 错误页模板
├── _partial/                   # 页面组件片段目录
│   ├── head.ejs                # HTML 头部
│   ├── header.ejs              # 页面头部
│   ├── footer.ejs              # 页面底部
│   ├── author-sidebar.ejs      # 作者侧边栏
│   └── ads.ejs                 # 广告组件
└── _widget/                    # 功能组件目录
    ├── comments.ejs            # 评论组件
    └── search.ejs              # 搜索组件
```

### 2. source/ - 静态资源目录

包含所有前端静态资源文件，包括 CSS、JavaScript 和图片等。

```
source/
├── css/                        # 样式文件目录
│   ├── main.css                # 主样式文件
│   ├── _tokens.css             # 设计令牌
│   ├── base/                   # 基础样式
│   │   └── reset.css           # 样式重置
│   ├── layout/                 # 布局样式
│   │   ├── header.css
│   │   ├── footer.css
│   │   └── author-sidebar.css
│   ├── components/             # 组件样式
│   │   ├── button.css
│   │   ├── card.css
│   │   ├── tag.css
│   │   ├── breadcrumb.css
│   │   ├── pagination.css
│   │   ├── input.css
│   │   ├── progress.css
│   │   ├── ad.css
│   │   └── ...
│   ├── pages/                  # 页面特定样式
│   │   ├── index.css
│   │   ├── post.css
│   │   ├── page.css
│   │   ├── archive.css
│   │   ├── categories.css
│   │   ├── tags.css
│   │   ├── about.css
│   │   └── 404.css
│   └── utilities/              # 工具类样式
│       └── helpers.css
└── js/                         # JavaScript 文件目录
    ├── main.js                 # 主入口文件
    └── managers/               # 功能管理器
        ├── theme-manager.js    # 主题管理器
        └── i18n-manager.js     # 国际化管理器
```

### 3. locales/ - 国际化语言包

包含所有支持的语言翻译文件。

```
locales/
├── zh-CN.js                    # 简体中文语言包
└── en-US.js                    # 英语语言包
```

### 4. scripts/ - 自定义脚本

包含用于扩展 Hexo 功能的自定义脚本。

```
scripts/
├── generator.js                # 内容生成器（sitemap、feed等）
├── lint-i18n.js                # 国际化检查脚本
└── check-contrast.js           # 对比度检查脚本
```

### 5. docs/ - 文档目录

包含项目相关文档。

```
docs/
├── project-structure.md        # 项目结构说明（本文档）
└── ...                         # 其他文档
```

## 设计原则与规范

### 1. 组件化设计

所有功能都被分解为可重用的组件，遵循以下原则：

- **可重用性**：组件可在多个地方重复使用
- **独立性**：组件尽可能独立，减少相互依赖
- **一致性**：组件具有统一的设计风格和交互模式

### 2. 国际化支持

- 所有用户可见文本均支持国际化
- 使用 `data-i18n` 属性标记需要翻译的元素
- 语言包按 ISO 标准命名（如 zh-CN、en-US）

### 3. 响应式设计

- 移动优先的设计理念
- 使用 CSS 媒体查询适配不同屏幕尺寸
- 组件具有良好的跨设备兼容性

### 4. 主题系统

- 支持明暗主题切换
- 主题变量集中管理
- 自动适配系统主题偏好

## 最佳实践

1. **样式组织**：遵循 ITCSS（Inverted Triangle CSS）方法论组织样式文件
2. **命名规范**：使用 BEM（Block Element Modifier）命名约定
3. **设计令牌**：所有设计值（颜色、间距、字体等）集中定义在 `_tokens.css` 中
4. **可访问性**：遵循 WAI-ARIA 标准，确保网站对所有用户友好
5. **性能优化**：合理使用 CSS Grid/Flexbox，避免复杂选择器

## 配置说明

主题的所有可配置项都在 [_config.yml](../_config.yml) 文件中定义，包括：

- 主题模式设置
- 语言设置
- 导航菜单
- 社交链接
- 评论系统
- 分析跟踪
- SEO 设置

开发者可以通过修改此文件来自定义主题的各种行为和外观。