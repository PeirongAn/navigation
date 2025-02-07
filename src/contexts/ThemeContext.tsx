import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: (checked: boolean) => void;
}

// 创建一个空的 noop 函数
const noop = (checked: boolean) => {
  console.warn('ThemeContext not initialized');
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  toggleTheme: noop,  // 使用 noop 函数替代空函数
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  const toggleTheme = (checked: boolean) => {
    setIsDarkMode(checked);
    document.documentElement.classList.toggle('light-theme', !checked);
    document.body.style.backgroundColor = checked ? '#141414' : '#ffffff';
    localStorage.setItem('theme', checked ? 'dark' : 'light');
  };

  // 初始化主题
  useEffect(() => {
    document.documentElement.classList.toggle('light-theme', !isDarkMode);
    document.body.style.backgroundColor = isDarkMode ? '#141414' : '#ffffff';
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 