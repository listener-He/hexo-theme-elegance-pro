/**
 * Custom Code Injector for Elegance Pro
 * Handles injection of custom HTML, CSS, and JavaScript into various parts of the theme
 */

hexo.extend.helper.register('inject_point', function(point) {
  const injections = this.theme.injections || {};
  let output = '';
  
  // Handle global injections
  switch(point) {
    case 'head':
      const headInjections = injections.head || [];
      headInjections.forEach(injection => {
        if (injection.type === 'script' && injection.src) {
          const attrs = [`src="${injection.src}"`];
          if (injection.async) attrs.push('async');
          if (injection.defer) attrs.push('defer');
          output += `<script ${attrs.join(' ')}></script>\n`;
        } else if (injection.type === 'style' && injection.href) {
          output += `<link rel="stylesheet" href="${injection.href}"${injection.media ? ` media="${injection.media}"` : ''}>\n`;
        } else if (injection.type === 'script' && injection.content) {
          output += `<script>${injection.content}</script>\n`;
        } else if (injection.type === 'html' && injection.content) {
          output += `${injection.content}\n`;
        }
      });
      break;
      
    case 'body-start':
      const bodyStartInjections = injections.bodyStart || [];
      bodyStartInjections.forEach(injection => {
        if (injection.type === 'html' && injection.content) {
          output += `${injection.content}\n`;
        }
      });
      break;
      
    case 'body-end':
      const bodyEndInjections = injections.bodyEnd || [];
      bodyEndInjections.forEach(injection => {
        if (injection.type === 'script' && injection.src) {
          const attrs = [`src="${injection.src}"`];
          if (injection.async) attrs.push('async');
          if (injection.defer) attrs.push('defer');
          output += `<script ${attrs.join(' ')}></script>\n`;
        } else if (injection.type === 'script' && injection.content) {
          output += `<script>${injection.content}</script>\n`;
        } else if (injection.type === 'html' && injection.content) {
          output += `${injection.content}\n`;
        }
      });
      break;
      
    case 'footer':
      const footerInjections = injections.footer || [];
      footerInjections.forEach(injection => {
        if (injection.type === 'script' && injection.src) {
          const attrs = [`src="${injection.src}"`];
          if (injection.async) attrs.push('async');
          if (injection.defer) attrs.push('defer');
          output += `<script ${attrs.join(' ')}></script>\n`;
        } else if (injection.type === 'script' && injection.content) {
          output += `<script>${injection.content}</script>\n`;
        } else if (injection.type === 'html' && injection.content) {
          output += `${injection.content}\n`;
        }
      });
      break;
  }
  
  // Handle page-specific injections
  const pageInjections = injections.pages || {};
  const pagePath = this.page.path || '';
  
  Object.keys(pageInjections).forEach(pattern => {
    // Simple pattern matching
    const regexPattern = pattern.replace(/\*/g, '.*').replace(/\//g, '\\/');
    const regex = new RegExp(`^${regexPattern}$`);
    
    if (regex.test(pagePath)) {
      pageInjections[pattern].forEach(injection => {
        if (injection.position === point) {
          if (injection.type === 'script' && injection.src) {
            const attrs = [`src="${injection.src}"`];
            if (injection.async) attrs.push('async');
            if (injection.defer) attrs.push('defer');
            output += `<script ${attrs.join(' ')}></script>\n`;
          } else if (injection.type === 'script' && injection.content) {
            output += `<script>${injection.content}</script>\n`;
          } else if (injection.type === 'html' && injection.content) {
            output += `${injection.content}\n`;
          } else if (injection.type === 'style' && injection.href) {
            output += `<link rel="stylesheet" href="${injection.href}"${injection.media ? ` media="${injection.media}"` : ''}>\n`;
          }
        }
      });
    }
  });
  
  return output;
});