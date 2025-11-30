/**
 * Injection Manager
 * Handles custom code injection (scripts, styles, HTML) at various points in the page
 */

class InjectionManager {
  constructor() {
    this.config = window.themeConfig || {};
    this.init();
  }

  init() {
    // Inject head injections
    this.injectHead();
    
    // Inject footer injections
    this.injectFooter();
    
    // Inject body start/end injections
    this.injectBody();
    
    // Inject specific page injections
    this.injectPageSpecific();
  }

  injectHead() {
    const headInjections = this.config.injections?.head || [];
    const head = document.head;
    
    headInjections.forEach(injection => {
      if (injection.type === 'script') {
        const script = document.createElement('script');
        if (injection.src) {
          script.src = injection.src;
        } else {
          script.textContent = injection.content;
        }
        if (injection.async) script.async = true;
        if (injection.defer) script.defer = true;
        head.appendChild(script);
      } else if (injection.type === 'style') {
        if (injection.href) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = injection.href;
          head.appendChild(link);
        } else {
          const style = document.createElement('style');
          style.textContent = injection.content;
          head.appendChild(style);
        }
      } else if (injection.type === 'html') {
        const temp = document.createElement('div');
        temp.innerHTML = injection.content;
        while (temp.firstChild) {
          head.appendChild(temp.firstChild);
        }
      }
    });
  }

  injectFooter() {
    const footerInjections = this.config.injections?.footer || [];
    const body = document.body;
    
    footerInjections.forEach(injection => {
      if (injection.type === 'script') {
        const script = document.createElement('script');
        if (injection.src) {
          script.src = injection.src;
        } else {
          script.textContent = injection.content;
        }
        if (injection.async) script.async = true;
        if (injection.defer) script.defer = true;
        body.appendChild(script);
      } else if (injection.type === 'style') {
        // Styles should typically go in head, but we'll allow it for completeness
        const style = document.createElement('style');
        style.textContent = injection.content;
        body.appendChild(style);
      } else if (injection.type === 'html') {
        const temp = document.createElement('div');
        temp.innerHTML = injection.content;
        while (temp.firstChild) {
          body.appendChild(temp.firstChild);
        }
      }
    });
  }

  injectBody() {
    const bodyStartInjections = this.config.injections?.bodyStart || [];
    const bodyEndInjections = this.config.injections?.bodyEnd || [];
    const body = document.body;
    
    // Inject at body start
    bodyStartInjections.forEach(injection => {
      const container = document.createElement('div');
      container.innerHTML = injection.content;
      while (container.firstChild) {
        body.insertBefore(container.firstChild, body.firstChild);
      }
    });
    
    // Inject at body end
    bodyEndInjections.forEach(injection => {
      const container = document.createElement('div');
      container.innerHTML = injection.content;
      while (container.firstChild) {
        body.appendChild(container.firstChild);
      }
    });
  }

  injectPageSpecific() {
    const pageInjections = this.config.injections?.pages || {};
    const currentPagePath = window.location.pathname;
    
    // Check for specific page injections
    Object.keys(pageInjections).forEach(pagePath => {
      if (currentPagePath === pagePath || 
          (pagePath.endsWith('*') && currentPagePath.startsWith(pagePath.slice(0, -1)))) {
        const injections = pageInjections[pagePath];
        this.injectSpecific(injections);
      }
    });
  }

  injectSpecific(injections) {
    injections.forEach(injection => {
      if (injection.position === 'head') {
        this.injectToHead(injection);
      } else if (injection.position === 'footer') {
        this.injectToFooter(injection);
      } else if (injection.position === 'body-start') {
        this.injectToBodyStart(injection);
      } else if (injection.position === 'body-end') {
        this.injectToBodyEnd(injection);
      } else if (injection.position) {
        // Inject to specific element by selector
        const targetElement = document.querySelector(injection.position);
        if (targetElement) {
          const temp = document.createElement('div');
          temp.innerHTML = injection.content;
          while (temp.firstChild) {
            if (injection.method === 'prepend') {
              targetElement.insertBefore(temp.firstChild, targetElement.firstChild);
            } else if (injection.method === 'append') {
              targetElement.appendChild(temp.firstChild);
            } else if (injection.method === 'before') {
              targetElement.parentNode.insertBefore(temp.firstChild, targetElement);
            } else if (injection.method === 'after') {
              targetElement.parentNode.insertBefore(temp.firstChild, targetElement.nextSibling);
            } else {
              targetElement.appendChild(temp.firstChild);
            }
          }
        }
      }
    });
  }

  injectToHead(injection) {
    const head = document.head;
    if (injection.type === 'script') {
      const script = document.createElement('script');
      if (injection.src) {
        script.src = injection.src;
      } else {
        script.textContent = injection.content;
      }
      if (injection.async) script.async = true;
      if (injection.defer) script.defer = true;
      head.appendChild(script);
    } else if (injection.type === 'style') {
      if (injection.href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = injection.href;
        head.appendChild(link);
      } else {
        const style = document.createElement('style');
        style.textContent = injection.content;
        head.appendChild(style);
      }
    } else if (injection.type === 'html') {
      const temp = document.createElement('div');
      temp.innerHTML = injection.content;
      while (temp.firstChild) {
        head.appendChild(temp.firstChild);
      }
    }
  }

  injectToFooter(injection) {
    const body = document.body;
    if (injection.type === 'script') {
      const script = document.createElement('script');
      if (injection.src) {
        script.src = injection.src;
      } else {
        script.textContent = injection.content;
      }
      if (injection.async) script.async = true;
      if (injection.defer) script.defer = true;
      body.appendChild(script);
    } else if (injection.type === 'style') {
      const style = document.createElement('style');
      style.textContent = injection.content;
      body.appendChild(style);
    } else if (injection.type === 'html') {
      const temp = document.createElement('div');
      temp.innerHTML = injection.content;
      while (temp.firstChild) {
        body.appendChild(temp.firstChild);
      }
    }
  }

  injectToBodyStart(injection) {
    const body = document.body;
    const container = document.createElement('div');
    container.innerHTML = injection.content;
    while (container.firstChild) {
      body.insertBefore(container.firstChild, body.firstChild);
    }
  }

  injectToBodyEnd(injection) {
    const body = document.body;
    const container = document.createElement('div');
    container.innerHTML = injection.content;
    while (container.firstChild) {
      body.appendChild(container.firstChild);
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.injectionManager = new InjectionManager();
  });
} else {
  window.injectionManager = new InjectionManager();
}

export default InjectionManager;