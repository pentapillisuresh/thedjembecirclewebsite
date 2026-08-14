'use client';
import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaArrowRight, FaUserCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ApiService from '../../services/api';
import { useAuth } from '../../lib/auth';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ phone: '', pin: '' });
  const { login:userLogin } = useAuth();

  useEffect(() => {
   localStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // ensure e is defined

    // Validation
    if (!form.phone || !form.pin) {
      toast.error('Phone and PIN are required');
      return;
    }
    if (form.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    if (form.pin.length < 4 || isNaN(form.pin)) {
      toast.error('PIN must be at least 4 digits');
      return;
    }

    setLoading(true);

    try {
      // Call the login API
      const userdata = await ApiService.login({
        phone: form.phone,
        pin: form.pin,
      });

      // On success, ApiService returns { success: true, data: { token, user } }
      if (userdata.success && userdata.data) {
        const { token, user } = userdata.data;
        userLogin(user)
        // Store token and user data
        ApiService.setToken(token);
        // Store user data and login state (optional, but keep for convenience)
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLogin', 'true');
  
        toast.success(userdata.message || 'login successful!');
        router.push('/booking');
      } else {
        throw new Error(data.message || 'Login failed');
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
        className="border border-white/10 bg-white/5 backdrop-blur-sm p-8 max-w-md w-full relative z-10"
      >
        <div className="absolute top-0 left-0 w-20 h-1 bg-primary"></div>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
            <FaUserCircle className="text-4xl text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-gray-400 mt-2">Sign in to book your drum circle experience</p>
        </div>

        <form className="space-y-6">
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
                className="w-full bg-black/50 border border-white/10 pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">PIN</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <FaLock />
              </div>
              <input
                type="password"
                maxLength="6"
                value={form.pin}
                onChange={(e) => setForm({ ...form, pin: e.target.value })}
                className="w-full bg-black/50 border border-white/10 pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300"
                placeholder="Enter your PIN"
                required
              />
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
            type="button" onClick={handleSubmit}
            className="w-full flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed group"
            disabled={loading}
          >
            {loading ? (
              'Signing in...'
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