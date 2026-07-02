import { useState } from 'react';
import AnalysisForm from '../components/AnalysisForm';
import { analyzeUrl, analyzeIp, analyzeFile } from '../services/api';

export default function Home({ onResult }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleAnalyze({ mode, url, ip, file }) {
    setError('');
    setLoading(true);
    try {
      let result;
      if (mode === 'url') result = await analyzeUrl(url);
      else if (mode === 'ip') result = await analyzeIp(ip);
      else result = await analyzeFile(file);
      onResult(result);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-brand-700 dark:text-brand-300 mb-3">ThreatLens</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Analyze URLs, IP addresses, and files for potential cybersecurity threats.
        </p>
      </div>

      <AnalysisForm onAnalyze={handleAnalyze} loading={loading} />

      {error && (
        <div className="mt-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
