/**
 * Icon Manager for Elegance Pro Theme
 * Handles icon loading and rendering for the theme
 */

class IconManager {
  constructor() {
    this.icons = new Map();
    this.loaded = false;
  }

  /**
   * Load icons from Tabler Icons
   * @param {Array} iconNames - List of icon names to load
   */
  async loadIcons(iconNames) {
    if (this.loaded) return;

    try {
      // For now we'll use our own renderer
      // In a full React implementation, we would import the components
      iconNames.forEach(name => {
        this.icons.set(name, name); // Store the name for our renderer
      });

      this.loaded = true;
      console.log('Icon system initialized successfully');
    } catch (error) {
      console.warn('Failed to initialize icon system:', error);
      this._loadFallbackIcons();
    }
  }

  /**
   * Load fallback emoji icons
   * @private
   */
  _loadFallbackIcons() {
    const defaultIcons = {
      'github': '💻',
      'twitter': '🐦',
      'email': '✉️',
      'facebook': '📘',
      'linkedin': '💼',
      'instagram': '📸',
      'youtube': '📺',
      'wechat': '💬',
      'weibo': '📢',
      'zhihu': '知',
      'douban': '豆',
      'reddit': '🐰',
      'pinterest': '📌',
      'tumblr': 'ⓣ',
      'snapchat': '👻',
      'whatsapp': '💬',
      'telegram': '✈️',
      'discord': '🔊',
      'home': '🏠',
      'archive': '📚',
      'folder': '📁',
      'tag': '🏷️',
      'calendar': '📅',
      'search': '🔍',
      'arrow-up': '↑',
      'menu': '☰',
      'close': '✕',
      'link': '🔗',
      'clock': '🕒',
      'user': '👤',
      'rss': '📡'
    };

    Object.entries(defaultIcons).forEach(([name, icon]) => {
      this.icons.set(name, icon);
    });

    this.loaded = true;
  }

  /**
   * Get icon by name
   * @param {string} name - Icon name
   * @returns {ReactComponent|string} Icon component or character
   */
  getIcon(name) {
    return this.icons.get(name) || '🔹';
  }

  /**
   * Render icon HTML
   * @param {string} name - Icon name
   * @param {Object} options - Rendering options
   * @returns {string} HTML string for the icon
   */
  renderIcon(name, options = {}) {
    const icon = this.getIcon(name);
    const className = options.className || '';
    const size = options.size || 24;
    const ariaLabel = options.ariaLabel || name;
    
    // If it's an emoji-like icon
    if (icon.length <= 2) {
      return `<span class="icon icon-${name} ${className}" aria-hidden="true">${icon}</span>`;
    }
    
    // If it's a Tabler Icon name, create a placeholder for rendering
    return `<span class="icon icon-${name} ${className}" data-icon="${name}" style="display:inline-block;width:${size}px;height:${size}px;"></span>`;
  }
}

// Initialize icon manager
const iconManager = new IconManager();

// Export for use in other modules
window.iconManager = iconManager;
export default IconManager;