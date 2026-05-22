'use client';

import { useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BUCKET_NAME } from '@/lib/constants';
import { Upload, X, Play } from 'lucide-react';

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function VideoUploader({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setUploading(true);

      const newUrls: string[] = [];

      for (const file of Array.from(files)) {
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: file.name,
              contentType: file.type,
            }),
          });

          if (!res.ok) throw new Error('Failed to get upload URL');

          const { token, path, publicUrl } = await res.json();

          const supabase = createClient();
          const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .uploadToSignedUrl(path, token, file, {
              contentType: file.type,
            });

          if (!error) {
            newUrls.push(publicUrl);
          } else {
            console.error('Upload error:', error);
          }
        } catch (err) {
          console.error('Failed to upload video:', err);
        }
      }

      onChange([...value, ...newUrls]);
      setUploading(false);
    },
    [value, onChange]
  );

  function removeVideo(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-3">
      {/* Preview grid */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {value.map((url, i) => (
            <div
              key={url}
              className="relative h-24 w-24 overflow-hidden rounded-xl border border-gray-200 bg-gray-900 flex items-center justify-center"
            >
              <video
                src={url}
                className="h-full w-full object-cover opacity-80"
                muted
                preload="metadata"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Play className="h-6 w-6 text-white drop-shadow" />
              </div>
              <button
                type="button"
                onClick={() => removeVideo(url)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow z-10"
                aria-label={`Remove video ${i + 1}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 transition-all ${
          dragOver
            ? 'border-brand-crimson bg-brand-crimson/5'
            : 'border-gray-200 hover:border-brand-crimson/50 hover:bg-gray-50'
        } ${uploading ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        <Upload
          className={`h-7 w-7 ${dragOver ? 'text-brand-crimson' : 'text-gray-300'}`}
        />
        <p className="text-sm text-gray-500">
          {uploading ? (
            <span className="text-brand-crimson font-medium">Uploading...</span>
          ) : (
            <>
              <span className="font-medium text-brand-crimson">Click to upload</span>{' '}
              or drag and drop
            </>
          )}
        </p>
        <p className="text-xs text-gray-400">MP4, MOV, WEBM up to 100MB each</p>
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          multiple
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
