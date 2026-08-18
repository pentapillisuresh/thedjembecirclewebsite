'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaArrowRight, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ApiService from "../../services/api"
import { useAuth } from '../../lib/auth';

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://service.thedjembecircle.com/api';

export default function Register() {
  const router = useRouter();
  const { login:userLogin } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    pin: '',
    terms: false,
  });

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!form.terms) {
      toast.error('Please accept the terms');
      return;
    }
  
    // Basic validation - only check if PIN exists, no length restriction
    if (!form.pin) {
      toast.error('Please enter your PIN');
      return;
    }
  
    setLoading(true);
  
    try {
      const data = await ApiService.register({
        phone: form.mobile,
        name: form.fullName,
        pin: form.pin,
        email: form.email,
      });
  
      // ApiService returns { success: true, message, data: { user, token } }
      if (data.success && data.data) {
        const { token, user } = data.data;
        userLogin(user)
        // Store token using ApiService (also sets it in localStorage)
        ApiService.setToken(token);
        // Store user data and login state (optional, but keep for convenience)
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLogin', 'true');
  
        toast.success(data.message || 'Registration successful!');
        router.push('/');
      } else {
        throw new Error(data.message || 'Unexpected response');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16 bg-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/5 blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border border-white/10 bg-white/5 backdrop-blur-sm p-8 max-w-md w-full relative z-10"
      >
        {/* Decorative line */}
        <div className="absolute top-0 left-0 w-20 h-1 bg-primary"></div>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
            <FaShieldAlt className="text-4xl text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-gray-400 mt-2">Join our drum circle community today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <FaUser />
              </div>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
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
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-black/50 border border-white/10 pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mobile Number</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <FaPhone />
              </div>
              <input
                type="tel"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="w-full bg-black/50 border border-white/10 pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300"
                placeholder="Enter your mobile number"
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
                className="w-full bg-black/50 border border-white/10 pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300"
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
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.checked })}
              className="w-4 h-4 accent-primary border border-white/20 bg-black/50 focus:outline-none focus:border-primary/50"
              required
            />
            <label className="text-sm text-gray-400">
              I agree to the{' '}
              <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors duration-300 font-semibold">
                Terms & Conditions
              </Link>
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed group"
            disabled={loading}
          >
            {loading ? (
              'Creating Account...'
            ) : (
              <>
                Create Account
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors duration-300">
            Sign In
          </Link>
        </div>

        {/* Divider */}
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-black/50 text-gray-500">Secure Registration</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}