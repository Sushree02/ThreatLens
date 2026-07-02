const LEVEL_STYLES = {
  Safe: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-300 dark:border-green-700',
    text: 'text-green-700 dark:text-green-300',
    badge: 'bg-green-600',
    icon: '✅'
  },
  'Moderate Risk': {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-300 dark:border-amber-700',
    text: 'text-amber-700 dark:text-amber-300',
    badge: 'bg-amber-500',
    icon: '⚠️'
  },
  'High Risk': {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-300 dark:border-red-700',
    text: 'text-red-700 dark:text-red-300',
    badge: 'bg-red-600',
    icon: '⛔'
  }
};

export default function VerdictCard({ riskLevel, finalVerdict }) {
  const styles = LEVEL_STYLES[riskLevel] || LEVEL_STYLES.Safe;

  return (
    <div className={`card border-2 ${styles.bg} ${styles.border}`} id="verdict-card">
      <div className="flex items-center gap-3 flex-wrap justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">{styles.icon}</span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Final Verdict
            </p>
            <p className={`text-xl font-bold ${styles.text}`}>{finalVerdict}</p>
          </div>
        </div>
        <span className={`text-white text-xs font-semibold px-3 py-1 rounded-full ${styles.badge}`}>
          {riskLevel.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
