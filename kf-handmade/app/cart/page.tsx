'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/components/cart/CartItem';
import { OrderModal } from '@/components/cart/OrderModal';
import { formatLKR } from '@/lib/utils';

export default function CartPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [showModal, setShowModal] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="font-heading text-2xl font-bold text-gray-700 mb-2">
          Your cart is empty
        </h1>
        <p className="text-gray-400 mb-8">
          Add some beautiful handcrafted items to get started.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-crimson px-6 py-3 font-semibold text-white hover:bg-brand-crimson-dark transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="text-gray-400 hover:text-brand-crimson transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-crimson-dark">
            Your Cart
          </h1>
          <p className="text-sm text-gray-400">
            {totalItems} item{totalItems !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-3 mb-8">
        {items.map((item) => (
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>

      {/* Summary & Checkout */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600 font-medium">Total</span>
          <span className="font-heading text-2xl font-bold text-brand-crimson">
            {formatLKR(totalPrice)}
          </span>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-crimson py-3.5 font-semibold text-white hover:bg-brand-crimson-dark transition-colors active:scale-95"
        >
          <ShoppingBag className="h-5 w-5" />
          Place Order via WhatsApp
        </button>

        <button
          onClick={clearCart}
          className="mt-3 w-full text-center text-sm text-gray-400 hover:text-red-500 transition-colors py-1"
        >
          Clear cart
        </button>
      </div>

      {showModal && (
        <OrderModal
          items={items}
          totalPrice={totalPrice}
          onClose={() => setShowModal(false)}
          onOrderSent={clearCart}
        />
      )}
    </div>
  );
}
