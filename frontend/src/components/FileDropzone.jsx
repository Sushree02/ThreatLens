import { useRef, useState } from 'react';
import {
  ALLOWED_FILE_EXTENSIONS,
  isAllowedFileType,
  isValidFileSize,
  formatFileSize
} from '../utils/validators';

export default function FileDropzone({ file, onFileSelect, error }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  function handleFiles(fileList) {
    const selected = fileList && fileList[0];
    if (!selected) return;
    onFileSelect(selected);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        className={`cursor-pointer rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
          isDragging
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
            : 'border-slate-300 dark:border-slate-600 hover:border-brand-400'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="text-3xl mb-2" aria-hidden="true">📁</p>
        {file ? (
          <div>
            <p className="font-medium break-all">{file.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {formatFileSize(file.size)}
            </p>
          </div>
        ) : (
          <>
            <p className="font-medium">Drag & drop a file here, or click to browse</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Allowed: {ALLOWED_FILE_EXTENSIONS.map((ext) => `.${ext}`).join(', ')} (max 32MB)
            </p>
          </>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

export function validateSelectedFile(file) {
  if (!file) return 'Please select a file.';
  if (!isAllowedFileType(file.name)) {
    return `File type not supported. Allowed: ${ALLOWED_FILE_EXTENSIONS.map((ext) => `.${ext}`).join(', ')}`;
  }
  if (!isValidFileSize(file.size)) {
    return 'File is too large. Maximum allowed size is 32MB.';
  }
  return null;
}
