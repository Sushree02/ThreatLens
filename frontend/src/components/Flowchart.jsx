const STEPS = [
  { label: 'Input URL / IP / File', icon: '⌨️' },
  { label: 'Threat Intelligence Scan', icon: '🔍' },
  { label: 'Threat Detection', icon: '🧪' },
  { label: 'Risk Classification', icon: '📊' },
  { label: 'Recommendations', icon: '🛡️' },
  { label: 'Final Verdict', icon: '✅' }
];

// This flowchart is intentionally website-only (not embedded in the
// PDF report) to keep the PDF compact and professional.
export default function Flowchart() {
  return (
    <div className="card" id="flowchart">
      <h3 className="text-lg font-semibold mb-6">Security Analysis Flow</h3>
      <div className="flex flex-col items-center">
        {STEPS.map((step, idx) => (
          <div key={step.label} className="flex flex-col items-center w-full">
            <div className="w-full max-w-xs flex items-center gap-3 px-4 py-3 rounded-xl border border-brand-200 dark:border-brand-800 bg-gradient-to-r from-brand-50 to-white dark:from-brand-900/30 dark:to-slate-800 shadow-sm">
              <span className="text-xl flex-shrink-0" aria-hidden="true">{step.icon}</span>
              <span className="font-medium text-brand-800 dark:text-brand-200">{step.label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className="text-brand-400 text-xl leading-none my-1.5" aria-hidden="true">
                ↓
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
