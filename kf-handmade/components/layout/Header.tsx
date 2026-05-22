'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.jpeg"
            alt="K & F Creations logo"
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
          <div className="leading-tight">
            <span className="block font-heading text-base font-bold text-brand-crimson-dark group-hover:text-brand-crimson transition-colors">
              K & F Creations
            </span>
            <span className="block text-xs text-gray-400 hidden sm:block">
              Hand Made Paper Pulp Products
            </span>
          </div>
        </Link>

        {/* Cart */}
        <Link
          href="/cart"
          className="relative flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-gray-50"
          aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
        >
          <ShoppingCart className="h-5 w-5 text-brand-crimson" />
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">Cart</span>
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-crimson text-xs font-bold text-white">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
