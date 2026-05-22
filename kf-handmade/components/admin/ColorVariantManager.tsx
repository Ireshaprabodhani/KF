'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, ArrowUp, ArrowDown } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { VideoUploader } from './VideoUploader';

export interface ProductColorDraft {
  draftId: string;
  name: string;
  hex: string;
  images: string[];
  videos: string[];
  sort_order: number;
}

interface Props {
  value: ProductColorDraft[];
  onChange: (colors: ProductColorDraft[]) => void;
}

export function ColorVariantManager({ value, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function addColor() {
    const newColor: ProductColorDraft = {
      draftId: crypto.randomUUID(),
      name: '',
      hex: '#c41e3a',
      images: [],
      videos: [],
      sort_order: value.length,
    };
    const updated = [...value, newColor];
    onChange(updated);
    setExpandedId(newColor.draftId);
  }

  function removeColor(draftId: string) {
    onChange(value.filter((c) => c.draftId !== draftId));
    if (expandedId === draftId) setExpandedId(null);
  }

  function updateColor(draftId: string, field: keyof ProductColorDraft, val: unknown) {
    onChange(
      value.map((c) => (c.draftId === draftId ? { ...c, [field]: val } : c))
    );
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...value];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next.map((c, i) => ({ ...c, sort_order: i })));
  }

  function moveDown(index: number) {
    if (index === value.length - 1) return;
    const next = [...value];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next.map((c, i) => ({ ...c, sort_order: i })));
  }

  return (
    <div className="space-y-3">
      {value.length === 0 && (
        <p className="text-sm text-gray-400 italic">
          No color variants yet. Add one below.
        </p>
      )}

      {value.map((color, index) => {
        const isExpanded = expandedId === color.draftId;
        const mediaCount = `${color.images.length} image${color.images.length !== 1 ? 's' : ''}, ${color.videos.length} video${color.videos.length !== 1 ? 's' : ''}`;

        return (
          <div
            key={color.draftId}
            className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden"
          >
            {/* Collapsed header */}
            <div className="flex items-center gap-3 px-4 py-3">
              {/* Color swatch */}
              <span
                className="h-6 w-6 flex-shrink-0 rounded-full border border-gray-300 shadow-sm"
                style={{ backgroundColor: color.hex }}
              />

              <span className="flex-1 text-sm font-medium text-gray-800 truncate">
                {color.name || <span className="text-gray-400 italic">Unnamed color</span>}
              </span>

              {!isExpanded && (
                <span className="text-xs text-gray-400 hidden sm:inline">{mediaCount}</span>
              )}

              {/* Move up/down */}
              <button
                type="button"
                onClick={() => moveUp(index)}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
                aria-label="Move up"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => moveDown(index)}
                disabled={index === value.length - 1}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
                aria-label="Move down"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>

              {/* Expand/collapse */}
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : color.draftId)}
                className="p-1 text-gray-400 hover:text-brand-crimson transition-colors"
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => removeColor(color.draftId)}
                className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                aria-label="Remove color"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Expanded body */}
            {isExpanded && (
              <div className="border-t border-gray-200 bg-white px-4 py-4 space-y-4">
                {/* Name + Hex */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Color Name <span className="text-brand-crimson">*</span>
                    </label>
                    <input
                      value={color.name}
                      onChange={(e) => updateColor(color.draftId, 'name', e.target.value)}
                      placeholder="e.g. Crimson Red"
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-brand-crimson focus:outline-none focus:ring-2 focus:ring-brand-crimson/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Hex Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => updateColor(color.draftId, 'hex', e.target.value)}
                        className="h-9 w-10 flex-shrink-0 cursor-pointer rounded-lg border border-gray-200 p-0.5"
                      />
                      <input
                        type="text"
                        value={color.hex}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
                            updateColor(color.draftId, 'hex', val);
                          }
                        }}
                        maxLength={7}
                        placeholder="#000000"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-crimson focus:outline-none focus:ring-2 focus:ring-brand-crimson/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Images for this color
                  </label>
                  <ImageUploader
                    value={color.images}
                    onChange={(urls) => updateColor(color.draftId, 'images', urls)}
                  />
                </div>

                {/* Videos */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Videos for this color
                  </label>
                  <VideoUploader
                    value={color.videos}
                    onChange={(urls) => updateColor(color.draftId, 'videos', urls)}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addColor}
        className="flex items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-3 text-sm font-medium text-gray-500 hover:border-brand-crimson/50 hover:text-brand-crimson transition-colors w-full justify-center"
      >
        <Plus className="h-4 w-4" />
        Add Color Variant
      </button>
    </div>
  );
}
