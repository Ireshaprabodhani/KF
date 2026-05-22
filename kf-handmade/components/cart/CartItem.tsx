'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatLKR, discountedPrice } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/types';

interface Props {
  item: CartItemType;
}

export function CartItem({ item }: Props) {
  const { increment, decrement, removeItem } = useCart();
  const unitPrice = discountedPrice(item.product.price, item.product.discount);
  const lineTotal = unitPrice * item.quantity;

  // Use the selected color's first image, then product's fallback
  const mainImage =
    item.selectedColor?.images[0] ?? item.product.images[0] ?? null;

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* Image */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-200 text-3xl">
            🎨
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <h3 className="font-heading text-sm font-semibold text-gray-900 line-clamp-2">
          {item.product.name}
        </h3>

        {/* Selected color */}
        {item.selectedColor && (
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-full border border-gray-200 shrink-0"
              style={{ backgroundColor: item.selectedColor.hex }}
            />
            <span className="text-xs text-gray-500">{item.selectedColor.name}</span>
          </div>
        )}

        {/* Notes */}
        {item.notes && (
          <p className="text-xs text-gray-400 italic line-clamp-2">
            Note: {item.notes}
          </p>
        )}

        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-sm font-bold text-brand-crimson">
            {formatLKR(unitPrice)}
          </span>
          {item.product.discount > 0 && (
            <span className="text-xs text-gray-400 line-through">
              {formatLKR(item.product.price)}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500">
          Subtotal: {formatLKR(lineTotal)}
        </span>
      </div>

      {/* Quantity controls */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => decrement(item.cartItemId)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-brand-crimson hover:text-brand-crimson transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3 w-3" />
          </button>

          <span className="w-6 text-center text-sm font-semibold">
            {item.quantity}
          </span>

          <button
            onClick={() => increment(item.cartItemId)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-brand-crimson hover:text-brand-crimson transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        <button
          onClick={() => removeItem(item.cartItemId)}
          className="flex h-7 w-7 items-center justify-center rounded-full text-gray-300 hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
