'use client';

import { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { buildWhatsAppURL } from '@/lib/whatsapp';
import { formatLKR } from '@/lib/utils';
import type { CartItem, CustomerInfo } from '@/types';

interface Props {
  items: CartItem[];
  totalPrice: number;
  onClose: () => void;
  onOrderSent: () => void;
}

export function OrderModal({ items, totalPrice, onClose, onOrderSent }: Props) {
  const [customer, setCustomer] = useState<CustomerInfo>({ name: '', phone: '' });
  const [error, setError] = useState('');

  function handleSend() {
    if (!customer.name.trim()) {
      setError('Please enter your name to continue.');
      return;
    }
    setError('');
    const url = buildWhatsAppURL(items, customer);
    window.open(url, '_blank', 'noopener,noreferrer');
    onOrderSent();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8 animate-in slide-in-from-bottom-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="font-heading text-xl font-bold text-brand-crimson-dark mb-1">
          Complete Your Order
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Your order details will be sent to us via WhatsApp.
        </p>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="order-name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Your Name <span className="text-brand-crimson">*</span>
            </label>
            <input
              id="order-name"
              type="text"
              value={customer.name}
              onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
              placeholder="e.g. Kamala Perera"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-brand-crimson focus:outline-none focus:ring-2 focus:ring-brand-crimson/20"
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="order-phone"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Phone Number{' '}
              <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              id="order-phone"
              type="tel"
              value={customer.phone}
              onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
              placeholder="e.g. 0771234567"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-brand-crimson focus:outline-none focus:ring-2 focus:ring-brand-crimson/20"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* Order Summary */}
        <div className="mt-5 rounded-xl bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
            Order Summary
          </p>
          <div className="space-y-1">
            {items.map((item) => (
              <div key={item.cartItemId} className="flex justify-between text-sm text-gray-600">
                <span className="truncate mr-4">
                  {item.product.name} ×{item.quantity}
                  {item.selectedColor && (
                    <span className="text-xs text-gray-400 ml-1">
                      ({item.selectedColor.name})
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 border-t border-gray-200 pt-3 flex justify-between">
            <span className="text-sm font-semibold text-gray-700">Total</span>
            <span className="font-heading text-base font-bold text-brand-crimson">
              {formatLKR(totalPrice)}
            </span>
          </div>
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl bg-green-500 py-3 font-semibold text-white transition-colors hover:bg-green-600 active:scale-95"
        >
          <MessageCircle className="h-5 w-5" />
          Send Order via WhatsApp
        </button>
        <p className="mt-2.5 text-center text-xs text-gray-400">
          WhatsApp will open with your order details pre-filled.
        </p>
      </div>
    </div>
  );
}
