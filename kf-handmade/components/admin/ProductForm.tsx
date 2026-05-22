'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploader } from './ImageUploader';
import { ColorVariantManager, type ProductColorDraft } from './ColorVariantManager';
import type { Product } from '@/types';

interface Props {
  initial?: Partial<Product>;
  productId?: string;
}

export function ProductForm({ initial, productId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    price: initial?.price?.toString() ?? '',
    discount: initial?.discount?.toString() ?? '0',
    images: initial?.images ?? [],
    available: initial?.available ?? true,
  });
  const [colors, setColors] = useState<ProductColorDraft[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load existing colors when editing
  useEffect(() => {
    if (!productId) return;
    fetch(`/api/products/${productId}/colors`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setColors(
            data.map((c) => ({
              draftId: c.id,
              name: c.name,
              hex: c.hex,
              images: c.images ?? [],
              videos: c.videos ?? [],
              sort_order: c.sort_order ?? 0,
            }))
          );
        }
      })
      .catch(() => {});
  }, [productId]);

  function update<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Validate color names
    const missingName = colors.find((c) => !c.name.trim());
    if (missingName) {
      setError('Each color variant must have a name.');
      setSaving(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: parseFloat(form.price),
      discount: parseFloat(form.discount) || 0,
      images: form.images,
      available: form.available,
    };

    if (isNaN(payload.price) || payload.price <= 0) {
      setError('Please enter a valid price.');
      setSaving(false);
      return;
    }

    const url = productId ? `/api/products/${productId}` : '/api/products';
    const method = productId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? 'Something went wrong. Please try again.');
      setSaving(false);
      return;
    }

    const savedProduct = await res.json();
    const savedId = productId ?? savedProduct.id;

    // Save colors: delete all existing, then insert each draft
    try {
      await fetch(`/api/products/${savedId}/colors`, { method: 'DELETE' });

      for (const [i, color] of colors.entries()) {
        await fetch(`/api/products/${savedId}/colors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: color.name.trim(),
            hex: color.hex,
            images: color.images,
            videos: color.videos,
            sort_order: i,
          }),
        });
      }
    } catch {
      setError('Product saved but colors could not be saved. Please try again.');
      setSaving(false);
      return;
    }

    router.push('/admin/dashboard');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      {/* Name */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Product Name <span className="text-brand-crimson">*</span>
        </label>
        <input
          required
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="e.g. Traditional Couple Figurine"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-crimson focus:outline-none focus:ring-2 focus:ring-brand-crimson/20"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Description{' '}
          <span className="text-xs text-gray-400">(optional)</span>
        </label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Describe this product..."
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-crimson focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 resize-none"
        />
      </div>

      {/* Price + Discount */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Price (LKR) <span className="text-brand-crimson">*</span>
          </label>
          <input
            required
            type="number"
            min="1"
            step="0.01"
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
            placeholder="0.00"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-crimson focus:outline-none focus:ring-2 focus:ring-brand-crimson/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Discount (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={form.discount}
            onChange={(e) => update('discount', e.target.value)}
            placeholder="0"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-crimson focus:outline-none focus:ring-2 focus:ring-brand-crimson/20"
          />
        </div>
      </div>

      {/* Availability */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
        <input
          type="checkbox"
          id="available"
          checked={form.available}
          onChange={(e) => update('available', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 accent-brand-crimson"
        />
        <div>
          <label
            htmlFor="available"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Visible to customers
          </label>
          <p className="text-xs text-gray-400 mt-0.5">
            Uncheck to hide this product without deleting it
          </p>
        </div>
      </div>

      {/* General Images (fallback / hero) */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Product Images{' '}
          <span className="text-xs text-gray-400">(shown on the product card)</span>
        </label>
        <ImageUploader
          value={form.images}
          onChange={(urls) => update('images', urls)}
        />
      </div>

      {/* Color Variants */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Color Variants{' '}
          <span className="text-xs text-gray-400">(optional — each color has its own images &amp; videos)</span>
        </label>
        <ColorVariantManager value={colors} onChange={setColors} />
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-xl bg-brand-crimson px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-crimson-dark disabled:opacity-60 active:scale-95"
        >
          {saving ? 'Saving...' : productId ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
