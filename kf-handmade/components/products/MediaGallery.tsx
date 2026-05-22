'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  media: string[];
  productName: string;
}

function isVideo(url: string): boolean {
  return /\.(mp4|webm|mov|avi)(\?.*)?$/i.test(url);
}

export function MediaGallery({ media, productName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset to first item whenever the media list changes (e.g. color switch)
  useEffect(() => {
    setActiveIndex(0);
  }, [media]);

  if (media.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-gray-100 text-gray-300">
        <svg
          className="h-20 w-20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  const current = media[activeIndex];
  const currentIsVideo = isVideo(current);

  function prev() {
    setActiveIndex((i) => (i === 0 ? media.length - 1 : i - 1));
  }
  function next() {
    setActiveIndex((i) => (i === media.length - 1 ? 0 : i + 1));
  }

  return (
    <div className="space-y-3">
      {/* Main viewer */}
      <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-square w-full">
        {currentIsVideo ? (
          <video
            key={current}
            src={current}
            controls
            autoPlay={false}
            muted
            playsInline
            className="h-full w-full object-contain"
          />
        ) : (
          <Image
            key={current}
            src={current}
            alt={`${productName} — view ${activeIndex + 1}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={activeIndex === 0}
          />
        )}

        {/* Arrows (show only if multiple media) */}
        {media.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm hover:bg-white transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm hover:bg-white transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Index indicator */}
        {media.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/40 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
            {activeIndex + 1} / {media.length}
          </span>
        )}
      </div>

      {/* Thumbnail strip */}
      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {media.map((url, i) => {
            const thumb = isVideo(url);
            const isActive = i === activeIndex;
            return (
              <button
                key={url}
                onClick={() => setActiveIndex(i)}
                className={`relative flex-shrink-0 h-16 w-16 overflow-hidden rounded-xl border-2 transition-all ${
                  isActive
                    ? 'border-brand-crimson shadow-md'
                    : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                }`}
                aria-label={`View ${thumb ? 'video' : 'image'} ${i + 1}`}
              >
                {thumb ? (
                  <>
                    <video
                      src={url}
                      muted
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Play className="h-4 w-4 text-white drop-shadow" />
                    </div>
                  </>
                ) : (
                  <Image
                    src={url}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
