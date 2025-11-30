/**
 * Icon Renderer Component
 * Dynamically renders Tabler Icons as SVG elements
 */

class IconRenderer {
  constructor() {
    this.iconCache = new Map();
  }

  /**
   * Render a Tabler Icon as SVG
   * @param {string} name - Icon name
   * @param {Object} options - Icon options
   * @param {number} options.size - Icon size (default: 24)
   * @param {string} options.className - Additional CSS classes
   * @param {string} options.color - Icon color
   * @returns {string} SVG HTML string
   */
  render(name, options = {}) {
    const size = options.size || 24;
    const className = options.className || '';
    const color = options.color || 'currentColor';
    
    // Check cache first
    const cacheKey = `${name}-${size}-${color}-${className}`;
    if (this.iconCache.has(cacheKey)) {
      return this.iconCache.get(cacheKey);
    }
    
    // Generate SVG
    const svgHTML = `
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="icon icon-${name} ${className}"
        width="${size}" 
        height="${size}" 
        viewBox="0 0 24 24" 
        stroke-width="2" 
        stroke="${color}" 
        fill="none" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        ${this.getIconPath(name)}
      </svg>
    `;
    
    // Cache the result
    this.iconCache.set(cacheKey, svgHTML);
    
    return svgHTML;
  }
  
  /**
   * Get SVG path for specific icon
   * @param {string} name - Icon name
   * @returns {string} SVG path
   */
  getIconPath(name) {
    // This is a simplified implementation
    // In a real-world scenario, you would have paths for each icon
    const iconPaths = {
      'home': '<path d="M5 12l-2 0l9 -9l9 9l-2 0"></path><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path>',
      'archive': '<path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2"></path><path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10"></path><path d="M10 12l4 0"></path>',
      'folder': '<path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"></path>',
      'tag': '<path d="M7.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3z"></path>',
      'user': '<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>',
      'calendar': '<path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z"></path><path d="M16 3v4"></path><path d="M8 3v4"></path><path d="M4 11h16"></path><path d="M11 15h1"></path><path d="M12 15v3"></path>',
      'search': '<path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path>',
      'arrow-up': '<path d="M12 5l0 14"></path><path d="M18 11l-6 -6"></path><path d="M6 11l6 -6"></path>',
      'link': '<path d="M9 15l6 -6"></path><path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"></path><path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"></path>',
      'github': '<path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"></path>',
      'twitter': '<path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z"></path>',
      'email': '<path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"></path><path d="M3 7l9 6l9 -6"></path>',
      'rss': '<path d="M5 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M4 4a16 16 0 0 1 16 16"></path><path d="M4 11a9 9 0 0 1 9 9"></path>',
      'menu': '<path d="M4 6l16 0"></path><path d="M4 12l16 0"></path><path d="M4 18l16 0"></path>',
      'code': '<path d="M7 8l-4 4l4 4"></path><path d="M17 8l4 4l-4 4"></path><path d="M14 4l-4 16"></path>',
      'server': '<path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"></path><path d="M3 12m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"></path><path d="M7 8l0 .01"></path><path d="M7 16l0 .01"></path>',
      'database': '<path d="M12 6m-8 0a8 3 0 1 0 16 0a8 3 0 1 0 -16 0"></path><path d="M4 6v6a8 3 0 0 0 16 0v-6"></path><path d="M4 12v6a8 3 0 0 0 16 0v-6"></path>',
      'close': '<path d="M18 6l-12 12"></path><path d="M6 6l12 12"></path>',
      'clock': '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path><path d="M12 7v5l3 3"></path>',
      'thumb-up': '<path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3"></path>',
      'share': '<path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path><path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path><path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path><path d="M8.7 10.7l6.6 -3.4"></path><path d="M8.7 13.3l6.6 3.4"></path>',
      'bookmark': '<path d="M3 15l9 -9l9 9v11a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>'
    };
    
    return iconPaths[name] || '<circle cx="12" cy="12" r="9"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>';
  }
}

// Create a global instance
const iconRenderer = new IconRenderer();

// Export for use in other modules
window.iconRenderer = iconRenderer;
export default IconRenderer;