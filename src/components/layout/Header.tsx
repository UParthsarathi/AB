import { Folder, Moon, Sun, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Header() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <header className="w-full flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-200">
      <div className="flex items-center gap-2">
        <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-1.5 rounded-md transition-colors duration-200">
          <Folder className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Projects</h1>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={() => setIsDark(!isDark)}
          className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          title="Toggle Dark Mode"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">parthu3915@gmail.com</span>
        <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </header>
  );
}
