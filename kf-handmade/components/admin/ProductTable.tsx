'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { formatLKR, discountedPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface Props {
  products: Product[];
}

export function ProductTable({ products }: Props) {
  const [list, setList] = useState<Product[]>(products);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(id);
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setList((prev) => prev.filter((p) => p.id !== id));
    }
    setDeleting(null);
  }

  async function handleToggle(product: Product) {
    setToggling(product.id);
    const res = await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: !product.available }),
    });
    if (res.ok) {
      const updated = await res.json();
      setList((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }
    setToggling(null);
  }

  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
        <p className="text-gray-400">No products yet.</p>
        <Link
          href="/admin/dashboard/products/new"
          className="mt-4 inline-block text-sm text-brand-crimson hover:underline"
        >
          Add your first product →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="px-4 py-3 font-semibold text-gray-500">Product</th>
              <th className="px-4 py-3 font-semibold text-gray-500 hidden sm:table-cell">
                Price
              </th>
              <th className="px-4 py-3 font-semibold text-gray-500 hidden md:table-cell">
                Discount
              </th>
              <th className="px-4 py-3 font-semibold text-gray-500">Status</th>
              <th className="px-4 py-3 font-semibold text-gray-500 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {list.map((product) => {
              const mainImage = product.images[0] ?? null;
              const effective = discountedPrice(product.price, product.discount);

              return (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  {/* Product info */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {mainImage ? (
                          <Image
                            src={mainImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <span className="flex h-full items-center justify-center text-gray-300 text-lg">
                            🎨
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate max-w-[180px]">
                          {product.name}
                        </p>
                        {product.description && (
                          <p className="text-xs text-gray-400 truncate max-w-[180px]">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="font-medium text-brand-crimson">
                      {formatLKR(effective)}
                    </span>
                    {product.discount > 0 && (
                      <span className="ml-1.5 text-xs text-gray-400 line-through">
                        {formatLKR(product.price)}
                      </span>
                    )}
                  </td>

                  {/* Discount */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    {product.discount > 0 ? (
                      <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-brand-crimson">
                        -{product.discount}%
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(product)}
                      disabled={toggling === product.id}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all disabled:opacity-50 ${
                        product.available
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      title={
                        product.available
                          ? 'Click to hide from customers'
                          : 'Click to show to customers'
                      }
                    >
                      {product.available ? (
                        <>
                          <Eye className="h-3 w-3" />
                          Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Hidden
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/dashboard/products/${product.id}`}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-brand-crimson transition-colors"
                        title="Edit product"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deleting === product.id}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
