'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Check, Palette } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { DiscountBadge } from './DiscountBadge';
import { formatLKR, discountedPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const effectivePrice = discountedPrice(product.price, product.discount);
  const mainImage = product.images[0] ?? null;
  const hasColors = (product.colors?.length ?? 0) > 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault(); // don't trigger the card link
    if (hasColors) return; // shouldn't be called, but guard
    addItem(product, null, '');
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-crimson"
    >
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden rounded-t-2xl bg-gray-50">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <svg
              className="h-16 w-16"
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
        )}
        {product.discount > 0 && <DiscountBadge discount={product.discount} />}

        {/* Color count badge */}
        {hasColors && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm">
            <Palette className="h-3 w-3" />
            {product.colors!.length} colors
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-base font-semibold text-gray-900 line-clamp-2 leading-snug">
          {product.name}
        </h3>

        {product.description && (
          <p className="mt-1.5 text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-brand-crimson">
            {formatLKR(effectivePrice)}
          </span>
          {product.discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              {formatLKR(product.price)}
            </span>
          )}
        </div>

        {/* Action button */}
        {hasColors ? (
          <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-crimson px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 group-hover:bg-brand-crimson-dark active:scale-95">
            <Palette className="h-4 w-4" />
            Select Options
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 active:scale-95
              ${
                added
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-brand-crimson hover:bg-brand-crimson-dark'
              }`}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </button>
        )}
      </div>
    </Link>
  );
}
