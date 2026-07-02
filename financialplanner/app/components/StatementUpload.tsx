'use client';

import { useState, useCallback } from 'react';
import { UploadIcon, FileIcon, XIcon, CheckIcon } from './ui/icons';
import { UploadProgress } from '../../lib/types';
import { Button } from './ui/button';

interface StatementUploadProps {
  onUpload: (file: File) => Promise<void>;
  progress: UploadProgress;
}

export function StatementUpload({ onUpload, progress }: StatementUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const validateAndSelectFile = (file: File) => {
    const validTypes = ['text/csv', 'application/csv', '.csv', 'application/pdf', '.pdf'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    const isValid = validTypes.includes(file.type) || validTypes.includes(fileExtension);

    if (!isValid) {
      setSelectedFile(null);
      const error = 'Unsupported file type. Please upload a CSV or PDF statement.';
      window.alert(error);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setSelectedFile(null);
      window.alert('File size must be less than 10MB.');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      await onUpload(selectedFile);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
  };

  if (progress.stage === 'complete') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
          Statement processed successfully
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400">
          Your dashboard has been populated with your real transaction insights.
        </p>
      </div>
    );
  }

  if (progress.stage === 'error') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <XIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
          We could not process that file
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          {progress.error || 'An error occurred during upload'}
        </p>
        <Button onClick={() => setSelectedFile(null)} size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-white">
          Upload your bank statement
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          CSV files and structured PDF bank statements are supported. Scanned image-only PDFs are not yet supported.
        </p>
      </div>

      {progress.stage !== 'uploading' && progress.stage !== 'parsing' && progress.stage !== 'analyzing' && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center transition-all
            ${dragActive 
              ? 'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800' 
              : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600'
            }
          `}
        >
          <input
            type="file"
            accept=".csv,.pdf"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={['uploading', 'parsing', 'analyzing'].includes(progress.stage)}
          />

          {!selectedFile ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                <UploadIcon className="w-8 h-8 text-zinc-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
                  Drag & drop your statement here
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  or click to browse files
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs text-zinc-500 dark:text-zinc-500">
                <span className="flex items-center gap-1">
                  <FileIcon className="w-4 h-4" />
                  CSV
                </span>
                <span className="flex items-center gap-1">
                  <FileIcon className="w-4 h-4" />
                  PDF
                </span>
                <span>Max 10MB</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                <FileIcon className="w-8 h-8 text-zinc-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-zinc-900 dark:text-white mb-1">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpload();
                }}
                size="sm"
              >
                Process statement
              </Button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="px-6 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}

      {(progress.stage === 'uploading' || progress.stage === 'parsing' || progress.stage === 'analyzing') && (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                {progress.stage === 'uploading' ? 'Uploading...' :
                 progress.stage === 'parsing' ? 'Parsing statement...' :
                 'Analyzing with AI...'}
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {progress.progress}%
              </span>
            </div>
            <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-900 dark:bg-white transition-all duration-300"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {progress.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
