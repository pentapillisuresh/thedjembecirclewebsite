'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaArrowRight, FaUserCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ApiService from '../../services/api';
import { useAuth } from '../../lib/auth';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [form, setForm] = useState({ phone: '', pin: '' });
  const { login: userLogin, isAuthenticated, user } = useAuth();

  // Check if user is already logged in
  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated && user) {
      router.push('/booking');
      return;
    }

    // Check for existing token and user data
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Set token in ApiService
        ApiService.setToken(token);
        // Login user through context
        userLogin(parsedUser);
        router.push('/booking');
      } catch (error) {
        console.error('Error restoring session:', error);
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isLogin');
        ApiService.setToken(null);
      }
    }
  }, [isAuthenticated, user, router, userLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation - only check if fields exist, no length restrictions
    if (!form.phone || !form.pin) {
      toast.error('Phone and PIN are required');
      return;
    }

    setLoading(true);

    try {
      // Call the login API
      const response = await ApiService.login({
        phone: form.phone,
        pin: form.pin,
      });

      console.log('Login response:', response);

      // On success, ApiService returns { success: true, data: { token, user } }
      if (response.success && response.data) {
        const { token, user } = response.data;
        
        // Login using auth context
        userLogin(user);
        
        // Store token and user data
        ApiService.setToken(token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLogin', 'true');

        toast.success(response.message || 'Login successful!');
        router.push('/booking');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16 bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/5 blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border border-white/10 bg-white/5 backdrop-blur-sm p-8 max-w-md w-full relative z-10 rounded-2xl"
      >
        <div className="absolute top-0 left-0 w-20 h-1 bg-primary"></div>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
            <FaUserCircle className="text-4xl text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-gray-400 mt-2">Sign in to book your drum circle experience</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <FaEnvelope />
              </div>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-black/50 border border-white/10 pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300 rounded-lg"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <FaLock />
              </div>
              <input
                type={showPin ? "text" : "password"}
                value={form.pin}
                onChange={(e) => setForm({ ...form, pin: e.target.value })}
                className="w-full bg-black/50 border border-white/10 pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300 rounded-lg"
                placeholder="Enter your Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-300"
              >
                {showPin ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            <div className="mt-2 text-right">
              <Link
                href="/reset-pin"
                className="text-xs text-gray-500 hover:text-primary transition-colors duration-300"
              >
                Forgot PIN?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed group rounded-lg"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <>
                Sign In
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors duration-300">
            Create Account
          </Link>
        </div>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-black/50 text-gray-500">Secure Login</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}