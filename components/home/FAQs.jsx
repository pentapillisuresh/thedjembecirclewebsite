'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus, FaQuestionCircle } from 'react-icons/fa';

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { question: 'What is a drum circle?', answer: 'A drum circle is a communal musical experience where people come together to play drums and percussion instruments. It\'s a space for self-expression, connection, and rhythmic exploration.' },
    { question: 'Do I need to bring my own drum?', answer: 'We provide all necessary instruments for our events. However, you\'re welcome to bring your own drum if you prefer.' },
    { question: 'What skill level is required?', answer: 'None at all! Our events welcome everyone from complete beginners to experienced drummers.' },
    { question: 'How long are the events?', answer: 'Typically, our drum circles last 2-3 hours. Workshops can be 3-6 hours or multi-day events.' },
    { question: 'Can children attend?', answer: 'Absolutely! We have events suitable for all ages. Parental supervision is required for children under 12.' },
  ];

  return (
    <section className="py-20 px-4 bg-black relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center bg-white/5 px-6 py-2 mb-4 border-l-4 border-primary">
            <span className="text-primary text-sm font-semibold">✦ FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about our drum events
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className={`border transition-all duration-500 ${
                openIndex === index 
                  ? 'border-primary/40 bg-white/10' 
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 border-l-4 transition-all duration-300 ${
                    openIndex === index 
                      ? 'border-primary bg-primary/10' 
                      : 'border-white/20 bg-white/5 group-hover:border-primary/40'
                  }`}>
                    <FaQuestionCircle className={`text-sm transition-colors duration-300 ${
                      openIndex === index ? 'text-primary' : 'text-gray-500 group-hover:text-primary'
                    }`} />
                  </div>
                  <span className={`font-semibold transition-colors duration-300 ${
                    openIndex === index ? 'text-primary' : 'text-white'
                  }`}>
                    {faq.question}
                  </span>
                </div>
                <span className={`p-2 transition-all duration-300 ${
                  openIndex === index 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-primary'
                }`}>
                  {openIndex === index ? <FaMinus /> : <FaPlus />}
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-white/5">
                      <div className="pl-12">
                        <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12 p-8 border border-white/10 bg-white/5"
        >
          <p className="text-gray-300 mb-4">Still have questions?</p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30"
          >
            Contact Us
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}