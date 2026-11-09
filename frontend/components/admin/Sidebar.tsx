'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Tag, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLogout } from '@/hooks/useAuth';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useLogout();

  return (
    <aside className="w-60 bg-gray-900 text-white min-h-screen flex flex-col flex-shrink-0">
      <div className="p-5 border-b border-gray-800">
        <Link href="/" className="text-lg font-bold tracking-widest uppercase">
          BRAND
        </Link>
        <p className="text-xs text-gray-500 mt-0.5">Admin Panel</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 w-full transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
