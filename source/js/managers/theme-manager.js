/**
 * Theme Manager
 * Handles light/dark theme switching and persistence
 */

class ThemeManager {
  constructor() {
    this.currentTheme = document.documentElement.getAttribute('data-theme') || 'day';
    this.init();
  }

  init() {
    // Apply saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemDark ? 'night' : 'day');
    
    this.setTheme(theme);
    this.bindEvents();
  }

  bindEvents() {
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'night' : 'day');
        }
      });
  }

  setTheme(theme) {
    if (theme === this.currentTheme) return;
    
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    // Dispatch event for other components to react
    window.dispatchEvent(new CustomEvent('theme-change', { 
      detail: { theme } 
    }));
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'day' ? 'night' : 'day';
    this.setTheme(newTheme);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
  });
} else {
  window.themeManager = new ThemeManager();
}