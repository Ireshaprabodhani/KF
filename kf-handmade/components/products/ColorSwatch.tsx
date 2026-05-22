'use client';

import type { ProductColor } from '@/types';

interface Props {
  colors: ProductColor[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export function ColorSwatch({ colors, selectedIndex, onChange }: Props) {
  if (colors.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">
        Color:{' '}
        <span className="font-semibold text-gray-900">{colors[selectedIndex]?.name}</span>
      </p>
      <div className="flex flex-wrap gap-2.5">
        {colors.map((color, i) => {
          const isSelected = i === selectedIndex;
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onChange(i)}
              title={color.name}
              aria-label={`Select color: ${color.name}`}
              aria-pressed={isSelected}
              className={`relative h-9 w-9 rounded-full border-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-crimson focus-visible:ring-offset-2 ${
                isSelected
                  ? 'border-brand-crimson scale-110 shadow-md'
                  : 'border-transparent hover:border-gray-300 hover:scale-105'
              }`}
              style={{ backgroundColor: color.hex }}
            >
              {/* White inner ring for contrast on light colors */}
              {isSelected && (
                <span className="absolute inset-0.5 rounded-full ring-2 ring-white pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
