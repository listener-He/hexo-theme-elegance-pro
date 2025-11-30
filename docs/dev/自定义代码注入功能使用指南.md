# 自定义代码注入功能使用指南

本文档详细介绍了如何在 Elegance Pro 主题中使用自定义代码注入功能，允许您在页面的关键位置插入自定义脚本、样式和 HTML 内容。

## 注入点概述

Elegance Pro 主题提供了以下五个主要注入点：

1. **head** - 在 `<head>` 部分注入代码
2. **bodyStart** - 在 `<body>` 标签后立即注入代码
3. **bodyEnd** - 在 `</body>` 标签前注入代码
4. **footer** - 在页脚部分注入代码
5. **页面特定位置** - 在指定页面的特定元素位置注入代码

## 配置方式

所有自定义注入都在主题配置文件 `_config.yml` 的 `injections` 部分进行配置。

### 1. Head 注入

在 `<head>` 部分注入脚本、样式或 HTML：

```yaml
injections:
  head:
    - type: script
      src: https://example.com/script.js
      async: true
    - type: style
      href: https://example.com/style.css
    - type: script
      content: |
        console.log('Custom script in head');
    - type: html
      content: <meta name="custom-meta" content="value">
```

### 2. Body Start 注入

在 `<body>` 标签后立即注入 HTML 内容：

```yaml
injections:
  bodyStart:
    - type: html
      content: <div id="custom-body-start">Body start content</div>
```

### 3. Body End 注入

在 `</body>` 标签前注入 HTML 内容：

```yaml
injections:
  bodyEnd:
    - type: html
      content: <div id="custom-body-end">Body end content</div>
```

### 4. Footer 注入

在页脚部分注入脚本、样式或 HTML：

```yaml
injections:
  footer:
    - type: script
      src: https://example.com/footer-script.js
    - type: script
      content: |
        console.log('Footer script');
```

### 5. 页面特定注入

为特定页面或页面组注入代码：

```yaml
injections:
  pages:
    /about/:  # 为关于页面注入
      - position: head
        type: script
        content: console.log('About page script');
      - position: '#main-content'
        method: append
        type: html
        content: <div>Custom content for about page</div>
    /posts/*:  # 为所有文章页面注入
      - position: body-start
        type: html
        content: <div>Custom content for all posts</div>
```

## 注入类型详解

### Script 注入

注入 JavaScript 代码，支持外部脚本和内联脚本：

```yaml
- type: script
  src: https://example.com/script.js  # 外部脚本
  async: true  # 是否异步加载
  defer: false # 是否延迟执行

- type: script
  content: |  # 内联脚本
    console.log('Hello from custom script');
```

### Style 注入

注入 CSS 样式，支持外部样式表和内联样式：

```yaml
- type: style
  href: https://example.com/style.css  # 外部样式表

- type: style
  content: |  # 内联样式
    .custom-class {
      color: red;
    }
```

### HTML 注入

注入任意 HTML 内容：

```yaml
- type: html
  content: |
    <div class="custom-component">
      <h2>Custom Component</h2>
      <p>This is a custom HTML component</p>
    </div>
```

## 页面特定注入的位置和方法

对于页面特定注入，您可以指定精确的注入位置和方法：

### 位置 (position)
- `head` - 注入到页面头部
- `body-start` - 注入到 body 开始处
- `body-end` - 注入到 body 结束前
- `footer` - 注入到页脚
- CSS 选择器 - 注入到匹配的元素（如 `#main-content`、`.post-content` 等）

### 方法 (method)
- `append` - 将内容添加到元素内部末尾（默认）
- `prepend` - 将内容添加到元素内部开头
- `before` - 将内容插入到元素前面
- `after` - 将内容插入到元素后面

## 实际应用示例

### 1. 添加 Google AdSense

```yaml
injections:
  head:
    - type: script
      src: https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js
      async: true
      content: |
        (adsbygoogle = window.adsbygoogle || []).push({});
  bodyEnd:
    - type: html
      content: |
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-xxxxxxxxxx"
             data-ad-slot="xxxxxxxxxx"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
```

### 2. 添加百度统计

```yaml
injections:
  footer:
    - type: script
      content: |
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?your-baidu-statistics-id";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();
```

### 3. 为文章页面添加 Disqus 评论

```yaml
injections:
  pages:
    /posts/*:
      - position: '#comments'
        method: append
        type: html
        content: |
          <div id="disqus_thread"></div>
          <script>
          var disqus_config = function () {
            this.page.url = window.location.href;
            this.page.identifier = window.location.pathname;
          };
          (function() {
          var d = document, s = d.createElement('script');
          s.src = 'https://your-site.disqus.com/embed.js';
          s.setAttribute('data-timestamp', +new Date());
          (d.head || d.body).appendChild(s);
          })();
          </script>
```

## 注意事项

1. **性能考虑**：避免注入过多的外部资源，这可能会影响页面加载速度
2. **安全性**：只注入您信任的代码
3. **兼容性**：确保注入的代码与主题的其他部分兼容
4. **维护性**：在注入的代码中添加注释，以便日后维护

通过这些自定义注入点，您可以轻松地扩展主题功能，添加分析工具、广告、社交媒体插件等，而无需修改主题的核心代码。