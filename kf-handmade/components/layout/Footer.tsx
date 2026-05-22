import { SITE_NAME } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="font-heading text-sm font-semibold text-brand-crimson-dark">
              {SITE_NAME}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              Handcrafted with love in Sri Lanka
            </p>
          </div>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} K & F Creations. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
