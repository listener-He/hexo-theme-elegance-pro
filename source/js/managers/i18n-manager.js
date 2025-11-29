/**
 * Internationalization (i18n) Manager
 * Handles language switching and text translation
 */

class I18nManager {
  constructor() {
    this.currentLang = document.documentElement.getAttribute('data-lang') || 'zh-CN';
    this.translations = {};
    this.observers = new Set();
    
    this.init();
  }

  init() {
    // Load translations then initialize
    this.loadTranslations().then(() => {
      this.scanElements();
      this.bindEvents();
      this.render();
    });
    
    this.setupMutationObserver();
  }

  async loadTranslations() {
    const lang = this.currentLang;
    try {
      // Dynamic import for code splitting
      const module = await import(`../../locales/${lang}.js`);
      this.translations = module.default;
      return this.translations;
    } catch (e) {
      console.warn(`Failed to load language pack: ${lang}`, e);
      this.translations = {};
      return {};
    }
  }

  scanElements() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const params = this.parseParams(el);
      
      this.observers.add({
        element: el,
        key: key,
        params: params,
        originalText: el.textContent
      });
    });
  }

  parseParams(el) {
    const params = {};
    const paramAttrs = Array.from(el.attributes).filter(attr => 
      attr.name.startsWith('data-i18n-param-')
    );
    
    paramAttrs.forEach(attr => {
      const paramName = attr.name.replace('data-i18n-param-', '');
      params[paramName] = attr.value;
    });
    
    return params;
  }

  bindEvents() {
    const langToggle = document.querySelector('[data-action="toggle-lang"]');
    if (langToggle) {
      langToggle.addEventListener('click', () => this.switchLanguage());
    }
    
    // Listen for system language changes
    window.matchMedia('(prefers-language: en-US)').addEventListener('change', (e) => {
      if (!localStorage.getItem('lang')) {
        this.setLanguage(e.matches ? 'en-US' : 'zh-CN');
      }
    });
  }

  async switchLanguage() {
    const newLang = this.currentLang === 'zh-CN' ? 'en-US' : 'zh-CN';
    await this.setLanguage(newLang);
  }

  async setLanguage(lang) {
    if (lang === this.currentLang) return;
    
    // Update DOM attribute immediately (avoid flickering)
    document.documentElement.setAttribute('data-lang', lang);
    this.currentLang = lang;
    
    // Reload translations
    this.translations = await this.loadTranslations();
    
    // Rescan and re-render
    this.scanElements();
    this.render();
    
    // Persist setting
    localStorage.setItem('lang', lang);
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('lang-change', { 
      detail: { lang, translations: this.translations } 
    }));
    
    // Update meta tags
    this.updateMetaTag();
  }

  render() {
    this.observers.forEach(({ element, key, params }) => {
      const translation = this.getTranslation(key, params);
      if (translation) {
        element.textContent = translation;
        this.updateDirAttribute(element);
      }
    });
  }

  getTranslation(key, params = {}) {
    const keys = key.split('.');
    let value = this.translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (!value) return null;
    }
    
    // Handle interpolation
    if (typeof value === 'string') {
      return this.interpolate(value, params);
    }
    
    return value;
  }

  interpolate(template, params) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] || match;
    });
  }

  updateDirAttribute(element) {
    const text = element.textContent;
    const isRTL = /[\u0600-\u06FF]/.test(text); // Arabic characters
    if (isRTL) {
      element.setAttribute('dir', 'rtl');
    } else {
      element.removeAttribute('dir');
    }
  }

  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      const shouldReRender = mutations.some(mutation => 
        Array.from(mutation.addedNodes).some(node => 
          node.querySelector?.('[data-i18n]')
        )
      );
      
      if (shouldReRender) {
        this.scanElements();
        this.render();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  updateMetaTag() {
    document.documentElement.setAttribute('lang', this.currentLang);
    
    // Update og:locale
    const meta = document.querySelector('meta[property="og:locale"]');
    if (meta) {
      meta.content = this.currentLang.replace('-', '_'); // zh-CN -> zh_CN
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.i18n = new I18nManager();
  });
} else {
  window.i18n = new I18nManager();
}