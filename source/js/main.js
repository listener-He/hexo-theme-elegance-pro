/**
 * Main JavaScript Entry Point
 * Imports all required modules and initializes components
 */

// Import managers
import './managers/theme-manager.js';
import './managers/i18n-manager.js';

// Import utilities
// Additional utilities can be imported here

// Document ready function
function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

// Initialize when DOM is ready
ready(function() {
  console.log('Elegance Pro theme initialized');
  
  // Initialize theme manager
  if (window.themeManager) {
    console.log('Theme manager initialized');
  }
  
  // Initialize i18n manager
  if (window.i18n) {
    console.log('I18n manager initialized');
  }
  
  // Bind event listeners for theme toggle
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle && window.themeManager) {
    themeToggle.addEventListener('click', () => {
      window.themeManager.toggleTheme();
    });
  }
  
  // Bind event listeners for back to top button
  const backToTopButton = document.querySelector('.back-to-top');
  if (backToTopButton) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('is-visible');
      } else {
        backToTopButton.classList.remove('is-visible');
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