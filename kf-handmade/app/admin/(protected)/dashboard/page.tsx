import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ProductTable } from '@/components/admin/ProductTable';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
  }

  const list = products ?? [];
  const visibleCount = list.filter((p) => p.available).length;
  const hiddenCount = list.length - visibleCount;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-800">
            Products
          </h1>
          <p className="mt-0.5 text-sm text-gray-400">
            {list.length} total · {visibleCount} visible · {hiddenCount} hidden
          </p>
        </div>
        <Link
          href="/admin/dashboard/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-crimson px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-crimson-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <ProductTable products={list} />
    </div>
  );
}
