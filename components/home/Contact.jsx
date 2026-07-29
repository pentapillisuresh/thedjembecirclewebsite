'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarker, FaPaperPlane, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Message sent successfully!');
    setForm({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <section className="py-20 px-4 bg-black relative overflow-hidden" id="contact">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center bg-white/5 px-6 py-2 mb-4 border-l-4 border-primary">
            <span className="text-primary text-sm font-semibold">✦ Contact</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Contact <span className="text-primary">Us</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            We'd love to hear from you
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Left side - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="border border-white/10 bg-white/5 p-8 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Have questions about our drum circles or events? Reach out to us and we'll get back to you soon.
              </p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4 group">
                  <div className="p-3 bg-primary/10 border-l-4 border-primary group-hover:border-primary/60 transition-all duration-300">
                    <FaMapMarker className="text-primary text-lg" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Address</p>
                    <p className="text-white font-medium">Flat No 401, 16-10-30/1,</p>
                    <p className="text-white font-medium">Ajay Vihar, Old Malakpet,</p>
                    <p className="text-white font-medium">Hyderabad, Telangana 500036</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="p-3 bg-primary/10 border-l-4 border-primary group-hover:border-primary/60 transition-all duration-300">
                    <FaEnvelope className="text-primary text-lg" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-medium">thedjembecircle2018@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="p-3 bg-primary/10 border-l-4 border-primary group-hover:border-primary/60 transition-all duration-300">
                    <FaPhone className="text-primary text-lg" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white font-medium">+91 85209 88496</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="p-3 bg-primary/10 border-l-4 border-primary group-hover:border-primary/60 transition-all duration-300">
                    <FaClock className="text-primary text-lg" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Working Hours</p>
                    <p className="text-white font-medium">Mon-Fri: 9AM - 6PM</p>
                    <p className="text-gray-400 text-sm">Sat: 10AM - 4PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-black bg-primary/30 flex items-center justify-center text-xs text-white font-bold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm text-gray-400">
                    Join <span className="text-white font-semibold">500+</span> happy community members
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="border border-white/10 bg-white/5 p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Send Us a Message</h3>
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
                  rows="4"
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300 resize-none"
                  placeholder="Your message here..."
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    Send Message
                    <FaPaperPlane className="ml-2" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}