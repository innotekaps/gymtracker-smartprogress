/**
 * GymTracker - Dark/Light Theme Manager
 * Automatically detects system preference and allows manual override
 */

const THEME_KEY = 'gymtracker-theme';
const THEME_DARK = 'dark';
const THEME_LIGHT = 'light';

class ThemeManager {
  constructor() {
    this.initializeTheme();
    this.createToggleButton();
    this.setupMediaQueryListener();
  }

  /**
   * Initialize theme on page load
   */
  initializeTheme() {
    const savedTheme = this.getSavedTheme();
    const preferredTheme = savedTheme || this.getSystemPreference();
    this.applyTheme(preferredTheme);
  }

  /**
   * Get saved theme from localStorage
   */
  getSavedTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      console.warn('localStorage not available:', e);
      return null;
    }
  }

  /**
   * Get system color scheme preference
   */
  getSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return THEME_LIGHT;
    }
    return THEME_DARK;
  }

  /**
   * Apply theme to the document
   */
  applyTheme(theme) {
    const html = document.documentElement;
    
    // Validate theme
    if (theme !== THEME_DARK && theme !== THEME_LIGHT) {
      theme = THEME_DARK;
    }

    html.setAttribute('data-theme', theme);
    
    // Update toggle button icon
    this.updateToggleIcon(theme);
    
    // Save preference
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.warn('localStorage not available:', e);
    }
  }

  /**
   * Toggle between dark and light themes
   */
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || THEME_DARK;
    const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    this.applyTheme(newTheme);
  }

  /**
   * Update toggle button icon
   */
  updateToggleIcon(theme) {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    if (theme === THEME_DARK) {
      btn.innerHTML = '☀️'; // Sun icon for light mode
      btn.setAttribute('aria-label', 'Switch to light mode');
      btn.setAttribute('title', 'Light Mode');
    } else {
      btn.innerHTML = '🌙'; // Moon icon for dark mode
      btn.setAttribute('aria-label', 'Switch to dark mode');
      btn.setAttribute('title', 'Dark Mode');
    }
  }

  /**
   * Create and inject theme toggle button
   */
  createToggleButton() {
    // Check if button already exists (for SPA navigation)
    if (document.getElementById('themeToggle')) {
      return;
    }

    // Fallback if body doesn't exist yet
    if (!document.body) {
      setTimeout(() => this.createToggleButton(), 100);
      return;
    }

    const btn = document.createElement('button');
    btn.id = 'themeToggle';
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'Toggle dark/light mode');
    btn.setAttribute('type', 'button');
    
    const currentTheme = document.documentElement.getAttribute('data-theme') || THEME_DARK;
    this.updateToggleIcon(currentTheme);

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleTheme();
    });

    document.body.appendChild(btn);
    console.log('✓ Theme toggle button created');
  }

  /**
   * Listen for system theme changes
   */
  setupMediaQueryListener() {
    if (!window.matchMedia) return;

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Modern browsers
    if (darkModeQuery.addEventListener) {
      darkModeQuery.addEventListener('change', (e) => {
        // Only apply if user hasn't manually set a theme
        if (!this.getSavedTheme()) {
          const newTheme = e.matches ? THEME_DARK : THEME_LIGHT;
          this.applyTheme(newTheme);
        }
      });
    } 
    // Legacy browsers
    else if (darkModeQuery.addListener) {
      darkModeQuery.addListener((e) => {
        if (!this.getSavedTheme()) {
          const newTheme = e.matches ? THEME_DARK : THEME_LIGHT;
          this.applyTheme(newTheme);
        }
      });
    }
  }
}

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🌙 DOMContentLoaded: Initializing ThemeManager...');
    new ThemeManager();
  });
} else {
  console.log('🌙 Document already loaded: Initializing ThemeManager...');
  new ThemeManager();
}

// Fallback initialization in case of issues
if (document.readyState === 'complete') {
  setTimeout(() => {
    if (!document.getElementById('themeToggle')) {
      console.log('🌙 Fallback: Creating theme toggle...');
      new ThemeManager();
    }
  }, 500);
}
