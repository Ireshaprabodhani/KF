import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProductForm } from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/dashboard"
          className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-brand-crimson transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-800">
            Add Product
          </h1>
          <p className="text-sm text-gray-400">Create a new product listing</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <ProductForm />
      </div>
    </div>
  );
}
