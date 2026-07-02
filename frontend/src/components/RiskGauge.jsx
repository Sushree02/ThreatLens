const LEVEL_COLORS = {
  Safe: { stroke: '#16a34a', text: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
  'Moderate Risk': { stroke: '#d97706', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  'High Risk': { stroke: '#dc2626', text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' }
};

export default function RiskGauge({ riskScore, riskLevel, confidence, detectionRatio }) {
  const colors = LEVEL_COLORS[riskLevel] || LEVEL_COLORS.Safe;

  // Circle math for the gauge ring
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (riskScore / 100) * circumference;

  return (
    <div className={`card flex flex-col items-center ${colors.bg}`} id="risk-gauge">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} stroke="#e2e8f0" strokeWidth="14" fill="none" className="dark:opacity-20" />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={colors.stroke}
            strokeWidth="14"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold">{riskScore}%</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">Risk Score</span>
        </div>
      </div>
      <p className={`mt-4 text-lg font-semibold ${colors.text}`}>{riskLevel}</p>

      {(confidence !== undefined || detectionRatio) && (
        <div className="mt-3 flex items-center gap-3 flex-wrap justify-center text-sm">
          {confidence !== undefined && (
            <span className="px-3 py-1 rounded-full bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-600">
              Confidence: {confidence}%
            </span>
          )}
          {detectionRatio && (
            <span className="px-3 py-1 rounded-full bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-600">
              Detection Ratio: {detectionRatio}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
