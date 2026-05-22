import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ProductDetail } from '@/components/products/ProductDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('name, description')
    .eq('id', id)
    .eq('available', true)
    .single();

  if (!data) return { title: 'Product Not Found' };

  return {
    title: data.name,
    description: data.description ?? undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('*, colors:product_colors(*)')
    .eq('id', id)
    .eq('available', true)
    .order('sort_order', { referencedTable: 'product_colors', ascending: true })
    .single();

  if (error || !product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
