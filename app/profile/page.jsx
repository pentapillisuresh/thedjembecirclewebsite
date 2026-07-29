'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaPhone, FaSave, FaUserCircle, 
  FaArrowLeft, FaCheckCircle, FaShieldAlt, FaCalendarAlt
} from 'react-icons/fa';
import { useAuth } from '@/lib/auth';
import ApiService from '@/services/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch fresh profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetching(true);
        const data = await ApiService.getProfile();
        if (data.success && data.data) {
          const profile = data.data;
          // Update form and user context
          setForm({
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
          });
          // Optionally update user in auth context
          if (setUser) {
            setUser(profile);
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Could not load profile data');
      } finally {
        setFetching(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await ApiService.updateProfile({
        name: form.name,
        email: form.email,
        // phone might not be updatable via API; if your backend allows it, include it.
        // If not, you can skip it. The backend route is PUT /api/users/profile.
      });

      if (data.success) {
        // Update user context with new data
        if (setUser && data.data) {
          setUser(data.data);
        }
        toast.success(data.message || 'Profile updated successfully!');
      } else {
        throw new Error(data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // If user is null or fetching profile
  if (!user || fetching) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  // If no user (should be redirected by auth middleware)
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-2">Please Login</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to view your profile</p>
          <Link href="/login" className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 shadow-lg shadow-primary/30 group">
            <span>Go to Login</span>
            <FaArrowLeft className="ml-2 rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-black relative overflow-hidden py-16 px-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/5 blur-3xl"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-2 mb-4 border-l-4 border-primary">
            <FaUser className="text-primary mr-2" />
            <span className="text-primary text-sm font-semibold tracking-wider">PROFILE</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Your <span className="text-primary">Profile</span>
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Update your personal information
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 border border-white/10 bg-white/5 backdrop-blur-sm p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <FaPhone />
                  </div>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300"
                    placeholder="Enter your mobile number"
                    required
                    disabled // phone might not be editable; you can remove disabled if your API allows it
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
              </div>

              <button 
                type="submit" 
                className="w-full flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed group"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                    Update Profile
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-6 sticky top-24">
              {/* Profile Avatar */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto border-2 border-primary/30">
                  <FaUserCircle className="text-5xl text-primary" />
                </div>
                <h3 className="text-white font-bold text-lg mt-3">{user.name || 'User'}</h3>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-300 border-b border-white/10 pb-3">
                  <FaCheckCircle className="text-green-500" />
                  <span>Account Verified</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 border-b border-white/10 pb-3">
                  <FaShieldAlt className="text-primary" />
                  <span>Secure Profile</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FaCalendarAlt className="text-primary" />
                  <span>Member since {new Date(user.createdAt).getFullYear()}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <Link
                  href="/my-bookings"
                  className="w-full flex items-center justify-center px-6 py-3 border border-white/10 text-white font-semibold hover:border-primary/50 transition-all duration-300 group"
                >
                  <span>My Bookings</span>
                  <FaArrowLeft className="ml-2 rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}