# 社交链接配置指南

本文档详细介绍如何在 Elegance Pro 主题中配置和使用社交链接功能。

## 配置方式

社交链接支持两种配置格式：新格式（推荐）和旧格式（向后兼容）。

### 新格式（推荐）

使用新格式可以获得更多的自定义选项，包括自定义名称、图标和国际化支持：

```yaml
social:
  links:
    - name: github
      url: "https://github.com/username"
      icon: "💻"
      i18n: social.github
    - name: twitter
      url: "https://twitter.com/username"
      icon: "🐦"
      i18n: social.twitter
    - name: email
      url: "mailto:me@example.com"
      icon: "✉️"
      i18n: social.email
    # 可以添加更多自定义社交链接
    - name: linkedin
      url: "https://linkedin.com/in/username"
      icon: "💼"
      i18n: social.linkedin
```

### 旧格式（向后兼容）

为了保持向后兼容性，仍然支持旧的简单格式：

```yaml
social:
  github: "https://github.com/username"
  twitter: "https://twitter.com/username"
  email: "mailto:me@example.com"
```

当使用旧格式时，系统会自动映射默认的图标和国际化键。

## 配置项说明

### name
社交网络的名称，用于标识和 aria-label 属性。

### url
社交网络的完整链接地址。

### icon
显示在按钮上的图标字符。可以是 emoji 或其他字符。

### i18n
国际化键，用于多语言支持。对应语言包中的键值。

## 支持的社交网络

系统内置了常见社交网络的图标映射：

| 名称 | 图标 | 国际化键 |
|------|------|----------|
| github | 💻 | social.github |
| twitter | 🐦 | social.twitter |
| email | ✉️ | social.email |
| facebook | 📘 | social.facebook |
| linkedin | 💼 | social.linkedin |
| instagram | 📸 | social.instagram |
| youtube | 📺 | social.youtube |
| wechat | 💬 | social.wechat |
| weibo | 📢 | social.weibo |
| zhihu | 知 | social.zhihu |
| douban | 豆 | social.douban |
| reddit | 🐰 | social.reddit |
| pinterest | 📌 | social.pinterest |
| tumblr | ⓣ | social.tumblr |
| snapchat | 👻 | social.snapchat |
| whatsapp | 💬 | social.whatsapp |
| telegram | ✈️ | social.telegram |
| discord | 🔊 | social.discord |

对于不在列表中的社交网络，会默认使用 🔗 图标。

## 自定义社交网络

你可以轻松添加任何自定义的社交网络：

```yaml
social:
  links:
    - name: mastodon
      url: "https://mastodon.social/@username"
      icon: "🐘"
      i18n: social.mastodon
```

然后在语言包中添加对应的国际化键：

```javascript
// locales/zh-CN.js
export default {
  social: {
    mastodon: "Mastodon"
    // ... 其他键
  }
  // ... 其他翻译
};
```

```javascript
// locales/en-US.js
export default {
  social: {
    mastodon: "Mastodon"
    // ... 其他键
  }
  // ... 其他翻译
};
```

## 在模板中的使用

社交链接会在两个位置自动显示：
1. 页脚区域
2. 作者侧边栏

这两个位置都会使用相同的配置，并且支持国际化。

## 最佳实践

1. **使用 HTTPS 链接**：确保所有社交链接都使用 HTTPS 协议
2. **提供合适的图标**：选择能够清楚表达社交网络含义的图标
3. **添加国际化支持**：为更好的用户体验，添加适当的国际化键
4. **保持一致性**：在整个网站中保持社交链接的一致性

通过这种灵活的配置方式，你可以轻松自定义网站的社交链接，满足各种个性化需求。