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
    }
  }

  /**
   * Get icon by name
   * @param {string} name - Icon name
   * @returns {string} Icon component or character
   */
  getIcon(name) {
    return this.icons.get(name) || 'default';
  }

  /**
   * Render icon HTML
   * @param {string} name - Icon name
   * @param {Object} options - Rendering options
   * @returns {string} HTML string for the icon
   */
  renderIcon(name, options = {}) {
    const className = options.className || '';
    const size = options.size || 24;
    const ariaLabel = options.ariaLabel || name;

    // Create a placeholder for rendering
    return `<span class="icon icon-${name} ${className}" data-icon="${name}" style="display:inline-block;width:${size}px;height:${size}px;" aria-label="${ariaLabel}"></span>`;
  }
}

// Initialize icon manager
const iconManager = new IconManager();

// Export for use in other modules
window.iconManager = iconManager;
export default IconManager;
