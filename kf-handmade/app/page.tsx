import { createClient } from '@/lib/supabase/server';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductSlider } from '@/components/products/ProductSlider';
import type { Product } from '@/types';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('available', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div>
      {/* Full-width slider */}
      <ProductSlider />

      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-crimson mb-3">
            Handcrafted with love
          </p>
          <h1 className="font-heading text-4xl font-bold text-brand-crimson-dark sm:text-5xl">
            K & F Creations
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-gray-500 leading-relaxed">
            Unique paper pulp artworks — traditional figurines, decorative eggs,
            animal sculptures, and more. Each piece crafted by hand in Sri Lanka.
          </p>
          <div className="mt-6 h-px w-16 bg-brand-crimson mx-auto rounded" />
        </div>

        {/* Product Grid */}
        <ProductGrid products={(products as Product[]) ?? []} />
      </div>
    </div>
  );
}
