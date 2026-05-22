import type { CartItem, CustomerInfo } from '@/types';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '94000000000';

function formatPrice(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString('en-LK')}`;
}

function getEffectivePrice(price: number, discount: number): number {
  return price * (1 - discount / 100);
}

export function buildWhatsAppMessage(items: CartItem[], customer: CustomerInfo): string {
  const lines: string[] = [];

  lines.push('*KF Order* 🛒');
  lines.push(`Name: ${customer.name.trim()}`);

  if (customer.phone.trim()) {
    lines.push(`Phone: ${customer.phone.trim()}`);
  }

  lines.push('');
  lines.push('*Items:*');

  let total = 0;

  for (const item of items) {
    const unitPrice = getEffectivePrice(item.product.price, item.product.discount);
    const lineTotal = unitPrice * item.quantity;
    total += lineTotal;

    const discountNote =
      item.product.discount > 0 ? ` _(${item.product.discount}% off)_` : '';

    const colorNote = item.selectedColor
      ? `\n  Color: ${item.selectedColor.name}`
      : '';

    const notesNote = item.notes?.trim()
      ? `\n  Note: ${item.notes.trim()}`
      : '';

    lines.push(
      `- ${item.product.name} x${item.quantity} — ${formatPrice(lineTotal)}${discountNote}${colorNote}${notesNote}`
    );
  }

  lines.push('');
  lines.push(`*Total: ${formatPrice(total)}*`);

  return lines.join('\n');
}

export function buildWhatsAppURL(items: CartItem[], customer: CustomerInfo): string {
  const message = buildWhatsAppMessage(items, customer);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}
