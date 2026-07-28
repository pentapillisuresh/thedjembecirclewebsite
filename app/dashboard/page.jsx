'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaTicketAlt,
  FaCalendar,
  FaHeart,
  FaClock,
  FaShieldAlt,
  FaArrowRight,
  FaSpinner,
} from 'react-icons/fa';
import { useAuth } from '@/lib/auth';
import ApiService from '@/services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [counts, setCounts] = useState({ totalBookings: 0, upcomingBookings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Fetch booking counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getUserCounts();
        if (data.success) {
          setCounts(data.data);
        } else {
          setError(data.message || 'Failed to fetch counts');
        }
      } catch (err) {
        console.error('Failed to fetch counts:', err);
        setError('Could not load booking statistics');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCounts();
    }
  }, [user]);

  // If no user (loading or not logged in), show loading or redirect
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <FaSpinner className="text-4xl text-primary animate-spin" />
      </div>
    );
  }

  // User creation date
  const userCreateDate = new Date(user.createdAt);
  const year = userCreateDate.getFullYear();

  const dashboardItems = [
    {
      icon: FaTicketAlt,
      title: 'My Bookings',
      description: 'View all your event bookings',
      href: '/my-bookings',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
    },
    {
      icon: FaUser,
      title: 'Profile',
      description: 'Update your information',
      href: '/profile',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
    },
    {
      icon: FaCalendar,
      title: 'Book New',
      description: 'Book a new event ticket',
      href: '/booking',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
  ];

  return (
    <section className="min-h-screen bg-black relative overflow-hidden py-16 px-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/5 blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-2 mb-4 border-l-4 border-primary">
            <FaShieldAlt className="text-primary mr-2" />
            <span className="text-primary text-sm font-semibold tracking-wider">DASHBOARD</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                Welcome Back,{' '}
                <span className="text-primary">
                  {user.fullName || user.name || 'User'}
                </span>
              </h1>
              <div className="w-24 h-1 bg-primary mt-4"></div>
              <p className="mt-4 text-lg text-gray-300">
                Manage your bookings and profile from one place
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400 border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <FaClock className="text-primary" />
                <span>Member since {year}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Bookings</p>
                {loading ? (
                  <div className="w-10 h-8 bg-gray-700 animate-pulse rounded"></div>
                ) : (
                  <p className="text-3xl font-bold text-white">
                    {counts.totalBookings || 0}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <FaTicketAlt className="text-primary text-xl" />
              </div>
            </div>
          </div>
          <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Upcoming Events</p>
                {loading ? (
                  <div className="w-10 h-8 bg-gray-700 animate-pulse rounded"></div>
                ) : (
                  <p className="text-3xl font-bold text-white">
                    {counts.upcomingBookings || 0}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <FaCalendar className="text-green-500 text-xl" />
              </div>
            </div>
          </div>
          <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Member Since</p>
                <p className="text-xl font-bold text-white">{year}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                <FaHeart className="text-purple-500 text-xl" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dashboardItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              >
                <Link
                  href={item.href}
                  className="group block border border-white/10 bg-white/5 backdrop-blur-sm p-8 hover:border-primary/40 transition-all duration-500 hover:-translate-y-2"
                >
                  <div
                    className={`w-16 h-16 ${item.bgColor} rounded-full flex items-center justify-center mb-4 border ${item.borderColor} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`text-3xl ${item.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-2 group-hover:text-gray-300 transition-colors duration-300">
                    {item.description}
                  </p>
                  <div className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium">Get Started</span>
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 border border-white/10 bg-white/5 backdrop-blur-sm p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 border border-primary/30">
              <FaShieldAlt className="text-primary" />
            </div>
            <div>
              <h4 className="text-white font-semibold">Quick Tip</h4>
              <p className="text-gray-400 text-sm mt-1">
                You can manage all your bookings, update your profile, and book new events from your dashboard.
                Stay tuned for upcoming events!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}