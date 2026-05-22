'use client';

import type { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface Props {
  products: Product[];
}

export function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-5xl mb-4">🎨</div>
        <p className="text-lg text-gray-400">No products available at the moment.</p>
        <p className="text-sm text-gray-300 mt-1">Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
