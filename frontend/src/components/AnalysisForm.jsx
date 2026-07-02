import { useState } from 'react';
import { isValidURL, isValidIP } from '../utils/validators';
import FileDropzone, { validateSelectedFile } from './FileDropzone';

const MODES = [
  { id: 'url', label: 'Analyze URL' },
  { id: 'ip', label: 'Analyze IP' },
  { id: 'file', label: 'Analyze File' }
];

export default function AnalysisForm({ onAnalyze, loading }) {
  const [mode, setMode] = useState('url');
  const [url, setUrl] = useState('');
  const [ip, setIp] = useState('');
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  function switchMode(newMode) {
    setMode(newMode);
    setErrors({});
  }

  function validate() {
    const newErrors = {};

    if (mode === 'url') {
      if (!url.trim()) newErrors.url = 'Please enter a URL.';
      else if (!isValidURL(url.trim())) newErrors.url = 'Enter a valid URL, e.g. https://example.com';
    }

    if (mode === 'ip') {
      if (!ip.trim()) newErrors.ip = 'Please enter an IP address.';
      else if (!isValidIP(ip.trim())) newErrors.ip = 'Enter a valid IPv4 or IPv6 address.';
    }

    if (mode === 'file') {
      const fileError = validateSelectedFile(file);
      if (fileError) newErrors.file = fileError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onAnalyze({ mode, url: url.trim(), ip: ip.trim(), file });
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => switchMode(m.id)}
            className={`px-4 py-3 rounded-lg font-medium border transition-colors ${
              mode === m.id
                ? 'bg-brand-600 border-brand-600 text-white'
                : 'bg-transparent border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {mode === 'url' && (
          <div>
            <label htmlFor="url-input" className="block text-sm font-medium mb-1">
              URL
            </label>
            <input
              id="url-input"
              type="text"
              placeholder="https://example.com"
              className="input-field"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
          </div>
        )}

        {mode === 'ip' && (
          <div>
            <label htmlFor="ip-input" className="block text-sm font-medium mb-1">
              IP Address
            </label>
            <input
              id="ip-input"
              type="text"
              placeholder="8.8.8.8"
              className="input-field"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
            />
            {errors.ip && <p className="text-red-500 text-sm mt-1">{errors.ip}</p>}
          </div>
        )}

        {mode === 'file' && (
          <div>
            <label className="block text-sm font-medium mb-1">File</label>
            <FileDropzone file={file} onFileSelect={setFile} error={errors.file} />
          </div>
        )}
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
    </form>
  );
}
