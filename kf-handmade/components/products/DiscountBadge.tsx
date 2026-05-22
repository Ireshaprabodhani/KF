interface Props {
  discount: number;
}

export function DiscountBadge({ discount }: Props) {
  return (
    <span className="absolute right-2 top-2 rounded-full bg-brand-crimson px-2 py-0.5 text-xs font-bold text-white shadow">
      -{discount}%
    </span>
  );
}
