// Theme utilities for dark/light mode

export const THEME_KEY = 'silvermoon-theme';
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

export const getInitialTheme = () => {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
    return savedTheme;
  }

  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return THEMES.DARK;
  }

  return THEMES.LIGHT;
};

export const setTheme = (theme) => {
  if (!Object.values(THEMES).includes(theme)) {
    console.error('Invalid theme:', theme);
    return;
  }

  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
};

export const toggleTheme = (currentTheme) => {
  const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
  setTheme(newTheme);
  return newTheme;
};

// Initialize theme on load
export const initializeTheme = () => {
  const theme = getInitialTheme();
  setTheme(theme);
  return theme;
};
