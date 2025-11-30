// Import modules
import './managers/theme-manager.js';
import './managers/injection-manager.js';
import IconManager from './icon-manager.js';
import IconRenderer from './components/icon-renderer.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize icon manager
  window.iconManager = new IconManager();
  window.iconRenderer = new IconRenderer();
  
  iconManager.loadIcons([
    'github', 'twitter', 'email', 'facebook', 'linkedin', 'instagram',
    'youtube', 'wechat', 'weibo', 'zhihu', 'douban', 'reddit',
    'pinterest', 'tumblr', 'snapchat', 'whatsapp', 'telegram', 'discord',
    'home', 'archive', 'folder', 'tag', 'calendar', 'search',
    'arrow-up', 'menu', 'close', 'link', 'clock', 'user', 'rss'
  ]).then(() => {
    console.log('Icons loaded successfully');
    // Replace placeholder elements with actual icons
    renderTablerIcons();
  }).catch(err => {
    console.warn('Failed to load icons:', err);
  });

  // Back to top button functionality
  const backToTopButton = document.querySelector('.back-to-top');
  
  if (backToTopButton) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.remove('is-hidden');
      } else {
        backToTopButton.classList.add('is-hidden');
      }
    });
    
    // Scroll to top when clicked
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Initialize scroll animations
  initScrollAnimations();
});

// Initialize scroll animations
function initScrollAnimations() {
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.1
    });
    
    animateElements.forEach(el => {
      observer.observe(el);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    animateElements.forEach(el => {
      el.classList.add('is-visible');
    });
  }
}

// Render Tabler Icons
function renderTablerIcons() {
  const iconPlaceholders = document.querySelectorAll('[data-icon]');
  
  iconPlaceholders.forEach((placeholder) => {
    const iconName = placeholder.getAttribute('data-icon');
    const size = placeholder.style.width ? parseInt(placeholder.style.width) : 24;
    
    // Use our icon renderer to generate the SVG
    const iconHTML = iconRenderer.render(iconName, { size: size });
    placeholder.innerHTML = iconHTML;
  });
}