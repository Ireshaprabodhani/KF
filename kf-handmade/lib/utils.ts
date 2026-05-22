import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLKR(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString('en-LK')}`;
}

export function discountedPrice(price: number, discount: number): number {
  if (!discount || discount <= 0) return price;
  return price * (1 - discount / 100);
}
