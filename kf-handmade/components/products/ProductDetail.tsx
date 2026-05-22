'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { ShoppingCart, Check, ArrowLeft, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { MediaGallery } from './MediaGallery';
import { ColorSwatch } from './ColorSwatch';
import { DiscountBadge } from './DiscountBadge';
import { formatLKR, discountedPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface Props {
  product: Product;
}

export function ProductDetail({ product }: Props) {
  const { addItem } = useCart();
  const [colorIndex, setColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [added, setAdded] = useState(false);

  const colors = product.colors ?? [];
  const selectedColor = colors[colorIndex] ?? null;

  // Build the media list for the currently selected color (or product fallback)
  const media = useMemo(() => {
    if (selectedColor) {
      return [...selectedColor.images, ...selectedColor.videos];
    }
    return product.images;
  }, [selectedColor, product.images]);

  // Reset color index when colors change (shouldn't happen, but safe)
  const effectivePrice = discountedPrice(product.price, product.discount);

  function handleColorChange(index: number) {
    setColorIndex(index);
    // MediaGallery resets internally via useEffect on media change
  }

  function handleAddToCart() {
    addItem(product, selectedColor, notes.trim(), quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-crimson transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — Media gallery */}
          <div className="w-full">
            <MediaGallery media={media} productName={product.name} />
          </div>

          {/* Right — Product details */}
          <div className="flex flex-col gap-6">
            {/* Name + discount */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-heading text-2xl font-bold text-gray-900 leading-tight sm:text-3xl">
                  {product.name}
                </h1>
                {product.discount > 0 && (
                  <span className="shrink-0 mt-1">
                    <DiscountBadge discount={product.discount} />
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl font-bold text-brand-crimson">
                  {formatLKR(effectivePrice)}
                </span>
                {product.discount > 0 && (
                  <span className="text-base text-gray-400 line-through">
                    {formatLKR(product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm leading-relaxed text-gray-600">
                {product.description}
              </p>
            )}

            {/* Divider */}
            <hr className="border-gray-100" />

            {/* Color selector */}
            {colors.length > 0 && (
              <>
                <ColorSwatch
                  colors={colors}
                  selectedIndex={colorIndex}
                  onChange={handleColorChange}
                />
                <hr className="border-gray-100" />
              </>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-brand-crimson hover:text-brand-crimson disabled:opacity-30 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="w-10 text-center text-lg font-semibold text-gray-900">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-brand-crimson hover:text-brand-crimson transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>

                <span className="text-sm text-gray-400">
                  {quantity > 1 ? `${quantity} pieces` : '1 piece'}
                </span>
              </div>
            </div>

            {/* Additional notes */}
            <div className="space-y-2">
              <label
                htmlFor="product-notes"
                className="block text-sm font-medium text-gray-700"
              >
                Additional Notes{' '}
                <span className="text-xs font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                id="product-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests or customization details..."
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:border-brand-crimson focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 transition-colors"
              />
            </div>

            {/* Add to cart button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex w-full items-center justify-center gap-2.5 rounded-2xl px-6 py-4 text-base font-semibold text-white transition-all duration-200 active:scale-[0.98] ${
                added
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-brand-crimson hover:bg-brand-crimson-dark shadow-lg shadow-brand-crimson/20 hover:shadow-brand-crimson/30'
              }`}
            >
              {added ? (
                <>
                  <Check className="h-5 w-5" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                  {quantity > 1 && (
                    <span className="ml-1 opacity-80">× {quantity}</span>
                  )}
                </>
              )}
            </button>

            {/* Order note */}
            <p className="text-center text-xs text-gray-400">
              Orders are placed via WhatsApp. We&apos;ll confirm availability and delivery details with you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
