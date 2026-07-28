'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaPaperPlane, FaInstagram, FaYoutube, FaFacebook, FaTwitter } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Message sent successfully!');
    setForm({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <section className="min-h-screen bg-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/5 blur-3xl"></div>

      {/* Hero Banner */}
      <div className="relative w-full h-[300px] md:h-[350px] overflow-hidden bg-black">
        <Image
          src="/images/banner1.jpg"
          alt="Contact Banner"
          fill
          className="object-cover"
          priority
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-2 mb-6 border-l-4 border-primary">
                <FaEnvelope className="text-primary mr-2" />
                <span className="text-primary text-sm font-semibold tracking-wider">CONTACT US</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                Get In <span className="text-primary">Touch</span>
              </h1>
              <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
              <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                We'd love to hear from you. Reach out to us for any questions or inquiries.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        {/* Contact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-12 relative z-10"
        >
          <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center hover:border-primary/40 transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mx-auto mb-3 border-l-4 border-primary">
              <FaMapMarkerAlt className="text-primary text-2xl" />
            </div>
            <h3 className="text-white font-semibold">Address</h3>
            <p className="text-gray-400 text-sm mt-1">Flat No 401, 16-10-30/1,<br />Ajay Vihar, Old Malakpet,<br />Hyderabad, Telangana 500036</p>
          </div>
          <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center hover:border-primary/40 transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mx-auto mb-3 border-l-4 border-primary">
              <FaEnvelope className="text-primary text-2xl" />
            </div>
            <h3 className="text-white font-semibold">Email</h3>
            <a href="mailto:thedjembecircle2018@gmail.com" className="text-gray-400 text-sm mt-1 hover:text-primary transition-colors duration-300">
              thedjembecircle2018@gmail.com
            </a>
          </div>
          <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center hover:border-primary/40 transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mx-auto mb-3 border-l-4 border-primary">
              <FaPhone className="text-primary text-2xl" />
            </div>
            <h3 className="text-white font-semibold">Phone</h3>
            <a href="tel:+918520988496" className="text-gray-400 text-sm mt-1 hover:text-primary transition-colors duration-300">
              +91 85209 88496
            </a>
          </div>
        </motion.div>

        {/* Contact Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="border border-white/10 bg-white/5 backdrop-blur-sm p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={(e) => setForm({...form, subject: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300"
                  placeholder="How can we help?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  rows="5"
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300 resize-none"
                  placeholder="Your message here..."
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed group"
                disabled={loading}
              >
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    Send Message
                    <FaPaperPlane className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="border border-white/10 bg-white/5 p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Working Hours</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400 flex items-center gap-2">
                    <FaClock className="text-primary" />
                    Monday - Friday
                  </span>
                  <span className="text-white font-semibold">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400 flex items-center gap-2">
                    <FaClock className="text-primary" />
                    Saturday
                  </span>
                  <span className="text-white font-semibold">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center gap-2">
                    <FaClock className="text-primary" />
                    Sunday
                  </span>
                  <span className="text-gray-500 font-semibold">Closed</span>
                </div>
              </div>
            </div>

            <div className="border border-white/10 bg-white/5 p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Quick Response</h3>
              <p className="text-gray-400 leading-relaxed">
                We typically respond within 24 hours. For urgent inquiries, please call us directly.
              </p>
              <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
                <span>Usually responds in 2-3 hours</span>
              </div>
            </div>

            <div className="border border-white/10 bg-white/5 p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/thedjembecircle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 border border-white/10 hover:border-primary/40 transition-all duration-300 hover:bg-primary/10 group"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-2xl text-gray-400 group-hover:text-primary transition-colors duration-300" />
                </a>
                <a
                  href="https://www.youtube.com/@thedjembecircle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 border border-white/10 hover:border-primary/40 transition-all duration-300 hover:bg-primary/10 group"
                  aria-label="YouTube"
                >
                  <FaYoutube className="text-2xl text-gray-400 group-hover:text-primary transition-colors duration-300" />
                </a>
                <a
                  href="https://www.facebook.com/thedjembecircle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 border border-white/10 hover:border-primary/40 transition-all duration-300 hover:bg-primary/10 group"
                  aria-label="Facebook"
                >
                  <FaFacebook className="text-2xl text-gray-400 group-hover:text-primary transition-colors duration-300" />
                </a>
                <a
                  href="https://twitter.com/thedjembecircle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 border border-white/10 hover:border-primary/40 transition-all duration-300 hover:bg-primary/10 group"
                  aria-label="Twitter"
                >
                  <FaTwitter className="text-2xl text-gray-400 group-hover:text-primary transition-colors duration-300" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}