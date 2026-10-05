'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ThemeKey, AccentColorKey, accentPalettes } from '../../styles/tokens';

export interface ThemeContextValue {
  theme: ThemeKey;
  resolvedTheme: 'dark' | 'light' | 'amoled' | 'sepia' | 'high-contrast';
  setTheme: (theme: ThemeKey) => void;
  accent: AccentColorKey;
  setAccent: (accent: AccentColorKey) => void;
  dir: 'ltr' | 'rtl';
  setDir: (dir: 'ltr' | 'rtl') => void;
  toggleDir: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_THEME = 'alizia_theme';
const STORAGE_ACCENT = 'alizia_accent';
const STORAGE_DIR = 'alizia_dir';

export function ThemeScript() {
  const scriptContent = `
    (function() {
      try {
        var cookies = document.cookie.split(';');
        var cookieTheme = null;
        var cookieAccent = null;
        var cookieDir = null;
        for (var i = 0; i < cookies.length; i++) {
          var c = cookies[i].trim();
          if (c.indexOf('alizia_theme=') === 0) cookieTheme = c.substring(13);
          if (c.indexOf('alizia_accent=') === 0) cookieAccent = c.substring(14);
          if (c.indexOf('alizia_dir=') === 0) cookieDir = c.substring(11);
        }
        var theme = localStorage.getItem('${STORAGE_THEME}') || cookieTheme || 'dark';
        var accent = localStorage.getItem('${STORAGE_ACCENT}') || cookieAccent || 'gemini';
        var dir = localStorage.getItem('${STORAGE_DIR}') || cookieDir || 'ltr';

        var resolvedTheme = theme;
        if (theme === 'system') {
          var mq = window.matchMedia('(prefers-color-scheme: dark)');
          resolvedTheme = mq.matches ? 'dark' : 'light';
        }

        document.documentElement.setAttribute('data-theme', resolvedTheme);
        document.documentElement.setAttribute('data-accent', accent);
        document.documentElement.setAttribute('dir', dir);
      } catch (e) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: scriptContent }} />;
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  defaultAccent = 'gemini',
  defaultDir = 'ltr',
}: {
  children: React.ReactNode;
  defaultTheme?: ThemeKey;
  defaultAccent?: AccentColorKey;
  defaultDir?: 'ltr' | 'rtl';
}) {
  const [theme, setThemeState] = useState<ThemeKey>(defaultTheme);
  const [accent, setAccentState] = useState<AccentColorKey>(defaultAccent);
  const [dir, setDirState] = useState<'ltr' | 'rtl'>(defaultDir);
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light' | 'amoled' | 'sepia' | 'high-contrast'>('dark');

  const applyTheme = useCallback((th: ThemeKey, ac: AccentColorKey, d: 'ltr' | 'rtl') => {
    let resolved: 'dark' | 'light' | 'amoled' | 'sepia' | 'high-contrast' = 'dark';
    if (th === 'system') {
      const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolved = isDark ? 'dark' : 'light';
    } else {
      resolved = th;
    }

    setResolvedTheme(resolved);
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.setAttribute('data-accent', ac);
    document.documentElement.setAttribute('dir', d);

    // Save to cookies for SSR
    document.cookie = `${STORAGE_THEME}=${th};path=/;max-age=31536000;SameSite=Lax`;
    document.cookie = `${STORAGE_ACCENT}=${ac};path=/;max-age=31536000;SameSite=Lax`;
    document.cookie = `${STORAGE_DIR}=${d};path=/;max-age=31536000;SameSite=Lax`;

    try {
      localStorage.setItem(STORAGE_THEME, th);
      localStorage.setItem(STORAGE_ACCENT, ac);
      localStorage.setItem(STORAGE_DIR, d);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const savedTheme = (localStorage.getItem(STORAGE_THEME) as ThemeKey) || defaultTheme;
      const savedAccent = (localStorage.getItem(STORAGE_ACCENT) as AccentColorKey) || defaultAccent;
      const savedDir = (localStorage.getItem(STORAGE_DIR) as 'ltr' | 'rtl') || defaultDir;
      
      setThemeState(savedTheme);
      setAccentState(savedAccent);
      setDirState(savedDir);
      applyTheme(savedTheme, savedAccent, savedDir);

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemChange = () => {
        if (savedTheme === 'system') {
          applyTheme('system', savedAccent, savedDir);
        }
      };
      mediaQuery.addEventListener('change', handleSystemChange);
      return () => mediaQuery.removeEventListener('change', handleSystemChange);
    } catch {}
  }, [applyTheme, defaultTheme, defaultAccent, defaultDir]);

  const setTheme = useCallback((newTheme: ThemeKey) => {
    setThemeState(newTheme);
    applyTheme(newTheme, accent, dir);
  }, [accent, dir, applyTheme]);

  const setAccent = useCallback((newAccent: AccentColorKey) => {
    setAccentState(newAccent);
    applyTheme(theme, newAccent, dir);
  }, [theme, dir, applyTheme]);

  const setDir = useCallback((newDir: 'ltr' | 'rtl') => {
    setDirState(newDir);
    applyTheme(theme, accent, newDir);
  }, [theme, accent, applyTheme]);

  const toggleDir = useCallback(() => {
    setDir(dir === 'ltr' ? 'rtl' : 'ltr');
  }, [dir, setDir]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        accent,
        setAccent,
        dir,
        setDir,
        toggleDir,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
