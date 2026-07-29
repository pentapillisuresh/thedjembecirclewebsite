'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser, FaTicketAlt, FaHome, FaCalendarPlus, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/lib/auth';

export default function DashboardMenu() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: FaHome },
    { name: 'My Bookings', href: '/my-bookings', icon: FaTicketAlt },
    { name: 'Profile', href: '/profile', icon: FaUser },
    { name: 'Book New', href: '/booking', icon: FaCalendarPlus },
  ];

  const isActive = (href) => pathname === href;

  return (
    <div className="glass-card p-4">
      <div className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              isActive(item.href)
                ? 'bg-primary/20 text-primary'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className="text-lg" />
            <span>{item.name}</span>
          </Link>
        ))}
        
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition w-full text-gray-400 hover:text-white hover:bg-white/5"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}