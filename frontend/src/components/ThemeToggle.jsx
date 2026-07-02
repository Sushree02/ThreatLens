import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark and light mode"
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
    >
      {theme === 'dark' ? (
        <>
          <span aria-hidden="true">☀️</span>
          <span className="hidden sm:inline">Light Mode</span>
        </>
      ) : (
        <>
          <span aria-hidden="true">🌙</span>
          <span className="hidden sm:inline">Dark Mode</span>
        </>
      )}
    </button>
  );
}
