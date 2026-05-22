import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  return (
    <div className="flex min-h-screen flex-col">
      {/* Admin Navbar */}
      <nav className="border-b bg-brand-crimson-dark px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="font-heading text-lg font-bold text-white hover:text-white/80 transition-colors"
            >
              K & F Admin
            </Link>
            <span className="text-white/30">|</span>
            <Link
              href="/"
              className="text-sm text-white/60 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Site ↗
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-white/50 hidden sm:block">
              {user.email}
            </span>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 bg-gray-50 p-6">{children}</div>
    </div>
  );
}
