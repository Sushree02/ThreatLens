import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M16 2 L28 7 V15 C28 23 22.5 28.5 16 30 C9.5 28.5 4 23 4 15 V7 Z" fill="#264e9c" />
            <path d="M12 16 L15 19 L21 12" stroke="#eef4ff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xl font-bold text-brand-700 dark:text-brand-300 tracking-tight">
            ThreatLens
          </span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
