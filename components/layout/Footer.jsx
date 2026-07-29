import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Section with Logo */}
          <div>
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/logo.jpeg"
                  alt="Djembe Circle Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-extrabold">
                <span className="text-primary">Djembe</span>Circle
              </h3>
            </Link>
            <p className="text-gray-400 mt-4 text-sm leading-relaxed">
              Where rhythm meets community. Join us for unforgettable drumming experiences.
            </p>
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://www.instagram.com/thedjembecircle" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-all duration-300 text-xl hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary transition-all duration-300 text-xl hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary transition-all duration-300 text-xl hover:scale-110"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary transition-all duration-300 text-xl hover:scale-110"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 border-l-4 border-primary pl-3">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-300 hover:pl-1">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-400 hover:text-white transition-colors duration-300 hover:pl-1">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-400 hover:text-white transition-colors duration-300 hover:pl-1">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-300 hover:pl-1">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4 border-l-4 border-primary pl-3">Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors duration-300 hover:pl-1">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="terms" className="text-gray-400 hover:text-white transition-colors duration-300 hover:pl-1">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300 hover:pl-1">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-400 hover:text-white transition-colors duration-300 hover:pl-1">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-4 border-l-4 border-primary pl-3">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
                <span>Flat No 401, 16-10-30/1,<br />Ajay Vihar, Old Malakpet,<br />Hyderabad, Telangana 500036</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-primary flex-shrink-0" />
                <a href="mailto:thedjembecircle2018@gmail.com" className="hover:text-white transition-colors duration-300">
                  thedjembecircle2018@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-primary flex-shrink-0" />
                <a href="tel:+918520988496" className="hover:text-white transition-colors duration-300">
                  +91 85209 88496
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>
            &copy; {currentYear} The Djembe Circle. All rights reserved povered by WURQ PROJECTS PRIVATE LIMITED.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors duration-300">
              Privacy
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/terms" className="hover:text-white transition-colors duration-300">
              Terms
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/sitemap" className="hover:text-white transition-colors duration-300">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}