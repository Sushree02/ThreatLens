import { formatFileSize } from '../utils/validators';

function Section({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-5 last:mb-0 pt-5 first:pt-0 border-t first:border-t-0 border-slate-200 dark:border-slate-700">
      <h4 className="text-sm font-semibold text-brand-700 dark:text-brand-300 mb-2">{title}</h4>
      <ul className="space-y-1.5">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ResultCard({ result }) {
  if (!result) return null;

  const { summary, findings, riskIndicators, target, type, warnings } = result;

  return (
    <div className="card" id="result-card">
      <h3 className="text-lg font-semibold mb-4">Analysis Summary</h3>

      {type === 'file' ? (
        <dl className="grid grid-cols-2 gap-y-1.5 text-sm mb-4">
          <dt className="text-slate-500 dark:text-slate-400">File Name</dt>
          <dd className="font-mono break-all">{result.fileName}</dd>
          <dt className="text-slate-500 dark:text-slate-400">File Type</dt>
          <dd className="uppercase">{result.fileType || 'Unknown'}</dd>
          <dt className="text-slate-500 dark:text-slate-400">File Size</dt>
          <dd>{formatFileSize(result.fileSize || 0)}</dd>
          <dt className="text-slate-500 dark:text-slate-400">SHA256</dt>
          <dd className="font-mono text-xs break-all">{result.sha256 || 'Unavailable'}</dd>
        </dl>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Target ({type.toUpperCase()}): <span className="font-mono text-slate-700 dark:text-slate-200">{target}</span>
        </p>
      )}

      {warnings && warnings.length > 0 && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300 text-sm">
          {warnings.map((w, idx) => (
            <p key={idx}>{w}</p>
          ))}
        </div>
      )}

      <Section title="Threat Intelligence Summary" items={summary} />
      <Section title="Threat Findings" items={findings} />
      <Section title="Risk Indicators" items={riskIndicators} />
    </div>
  );
}
