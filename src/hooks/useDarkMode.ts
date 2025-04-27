
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useDarkMode() {
  // Initialize theme from localStorage or default to 'system'
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      return savedTheme || 'system';
    }
    return 'system';
  });
  
  // Determine if dark mode is active
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Apply the theme to the document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark');
    
    // Determine which theme to use
    let themeToApply: 'light' | 'dark';
    
    if (theme === 'system') {
      themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      themeToApply = theme;
    }
    
    // Add the theme class
    root.classList.add(themeToApply);
    
    // Update dark mode state
    setIsDarkMode(themeToApply === 'dark');
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      setIsDarkMode(mediaQuery.matches);
      document.documentElement.classList.toggle('dark', mediaQuery.matches);
      document.documentElement.classList.toggle('light', !mediaQuery.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Initial check
    handleChange();
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  return {
    theme,
    isDarkMode,
    setTheme,
    toggleDarkMode: () => setTheme(isDarkMode ? 'light' : 'dark'),
    setSystemTheme: () => setTheme('system')
  };
}
