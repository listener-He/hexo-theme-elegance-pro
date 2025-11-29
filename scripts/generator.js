/**
 * Sitemap and Feed Generator for Elegance Pro
 * Generates sitemap.xml and atom.xml/rss.xml for better SEO
 */

const { join } = require('path');

hexo.extend.generator.register('sitemap', function (locals) {
  const config = this.config;
  const themeConfig = config.theme_config || {};
  
  if (!themeConfig.sitemap) return;

  const posts = locals.posts.sort('-date');
  const pages = locals.pages;
  
  // Generate sitemap content
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add homepage
  sitemap += '  <url>\n';
  sitemap += `    <loc>${config.url}</loc>\n`;
  sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
  sitemap += '    <changefreq>daily</changefreq>\n';
  sitemap += '    <priority>1.0</priority>\n';
  sitemap += '  </url>\n';
  
  // Add posts
  posts.forEach(post => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${config.url}${post.permalink}</loc>\n`;
    sitemap += `    <lastmod>${post.updated.toISOString()}</lastmod>\n`;
    sitemap += '    <changefreq>weekly</changefreq>\n';
    sitemap += '    <priority>0.8</priority>\n';
    sitemap += '  </url>\n';
  });
  
  // Add pages
  pages.forEach(page => {
    if (page.permalink !== '/') {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${config.url}${page.permalink}</loc>\n`;
      sitemap += `    <lastmod>${page.updated.toISOString()}</lastmod>\n`;
      sitemap += '    <changefreq>monthly</changefreq>\n';
      sitemap += '    <priority>0.6</priority>\n';
      sitemap += '  </url>\n';
    }
  });
  
  sitemap += '</urlset>';
  
  return {
    path: themeConfig.sitemap.path || 'sitemap.xml',
    data: sitemap
  };
});

hexo.extend.generator.register('feed', function(locals) {
  const config = this.config;
  const themeConfig = config.theme_config || {};
  
  if (!themeConfig.feed) return;
  
  const feedConfig = themeConfig.feed;
  const posts = locals.posts.sort('-date');
  
  // Limit number of posts
  const feedPosts = posts.limit(feedConfig.limit || 20);
  
  // Generate feed content
  let feed = '<?xml version="1.0" encoding="utf-8"?>\n';
  feed += '<feed xmlns="http://www.w3.org/2005/Atom">\n';
  feed += `  <title><![CDATA[${config.title}]]></title>\n`;
  feed += `  <subtitle><![CDATA[${config.description}]]></subtitle>\n`;
  feed += `  <link href="${config.url}/atom.xml" rel="self"/>\n`;
  feed += `  <link href="${config.url}/"/>\n`;
  feed += `  <updated>${new Date().toISOString()}</updated>\n`;
  feed += `  <id>${config.url}/</id>\n`;
  
  feedPosts.forEach(post => {
    const content = feedConfig.content ? post.content : post.excerpt || post.content;
    
    feed += '  <entry>\n';
    feed += `    <title><![CDATA[${post.title}]]></title>\n`;
    feed += `    <link href="${config.url}${post.permalink}"/>\n`;
    feed += `    <id>${config.url}${post.permalink}</id>\n`;
    feed += `    <published>${post.date.toISOString()}</published>\n`;
    feed += `    <updated>${post.updated.toISOString()}</updated>\n`;
    
    if (post.categories && post.categories.length) {
      post.categories.forEach(category => {
        feed += `    <category term="${category.name}" />\n`;
      });
    }
    
    if (post.tags && post.tags.length) {
      post.tags.forEach(tag => {
        feed += `    <category term="${tag.name}" />\n`;
      });
    }
    
    feed += `    <content type="html"><![CDATA[${content}]]></content>\n`;
    feed += '  </entry>\n';
  });
  
  feed += '</feed>';
  
  return {
    path: feedConfig.path || 'atom.xml',
    data: feed
  };
});