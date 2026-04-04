import { create } from 'zustand';

const useThemeStore = create((set) => ({
  isDarkMode: localStorage.getItem('theme') === 'dark',
  toggleTheme: () =>
    set((state) => {
      const newDarkMode = !state.isDarkMode;
      localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { isDarkMode: newDarkMode };
    }),
  initTheme: () => {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
    set({ isDarkMode: isDark });
  }
}));

export default useThemeStore;
