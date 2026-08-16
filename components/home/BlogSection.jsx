'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaTag, FaArrowRight } from 'react-icons/fa';
import apiService from '../../services/api';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await apiService.getBlogs({ limit: 4, status: 'published' });
        // The API returns { success: true, data: { total, blogs } }
        const blogData = response?.data?.blogs || response?.blogs || [];
        setBlogs(blogData);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Truncate text
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Latest <span className="text-primary">Blog Posts</span></h2>
            <div className="w-16 h-0.5 bg-primary mx-auto mt-3"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-white/10"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  <div className="h-3 bg-white/10 rounded w-full"></div>
                  <div className="h-3 bg-white/10 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">{error}</p>
        </div>
      </section>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Latest <span className="text-primary">Blog Posts</span></h2>
          <div className="w-16 h-0.5 bg-primary mx-auto mt-3"></div>
          <p className="text-gray-400 mt-8">No blog posts available yet. Check back soon!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/5 blur-3xl"></div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center bg-white/5 backdrop-blur-sm px-3 py-1 mb-3 border-l-4 border-primary">
            <span className="text-primary text-[10px] font-semibold">✦ LATEST STORIES</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            From Our <span className="text-primary">Blog</span>
          </h2>
          <div className="w-16 h-0.5 bg-primary mx-auto mt-3"></div>
          <p className="mt-4 text-gray-300 max-w-xl mx-auto">
            Discover insights, stories, and updates from the world of rhythm and community
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogs.map((blog, index) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Featured Image */}
              <Link href={`/blog/${blog.slug}`} className="block relative overflow-hidden h-48">
                {blog.featuredImage ? (
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = '/images/blog-placeholder.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                    <span className="text-4xl">📖</span>
                  </div>
                )}
                {/* Status Badge */}
                {blog.status === 'published' && (
                  <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm px-2 py-0.5">
                    <span className="text-white text-[8px] font-medium tracking-wider">PUBLISHED</span>
                  </div>
                )}
              </Link>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Tags */}
                {blog.tags && (
                  <div className="flex flex-wrap gap-1">
                    {blog.tags.split(',').slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <Link href={`/blog/${blog.slug}`}>
                  <h3 className="text-white font-bold text-sm group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {blog.title}
                  </h3>
                </Link>

                {/* Excerpt */}
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">
                  {truncateText(blog.excerpt || blog.content, 80)}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <FaUser className="text-primary" />
                      {blog.author || 'Admin'}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="text-primary" />
                    {formatDate(blog.publishedAt || blog.createdAt)}
                  </span>
                </div>

                {/* Read More Link */}
                <Link
                  href={`/blog/${blog.slug}`}
                  className="inline-flex items-center gap-1 text-primary text-xs hover:gap-2 transition-all duration-300 group"
                >
                  Read More
                  <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Blogs Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 border border-primary/50 text-primary hover:bg-primary hover:text-white transition-all duration-300 group"
          >
            <span>View All Blog Posts</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;