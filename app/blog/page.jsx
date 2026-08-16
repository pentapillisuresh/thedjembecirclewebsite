import Link from 'next/link';
import { FaCalendarAlt, FaUser, FaArrowRight } from 'react-icons/fa';
import apiService from '@/services/api';

// Fallback image as data URI
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%231a1a1a'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='40' text-anchor='middle' fill='%23666'%3E📖%3C/text%3E%3C/svg%3E";

async function getBlogs(page = 1, limit = 9) {
  const offset = (page - 1) * limit;
  try {
    const response = await apiService.getBlogs({ 
      limit, 
      offset,
      status: 'published' 
    });
    const blogData = response?.data?.blogs || response?.blogs || [];
    const total = response?.data?.total || response?.total || 0;
    return { blogs: blogData, total };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return { blogs: [], total: 0 };
  }
}

export default async function BlogPage({ searchParams }) {
  const page = parseInt(searchParams?.page) || 1;
  const limit = 9;
  const { blogs, total } = await getBlogs(page, limit);
  
  const totalPages = Math.ceil(total / limit);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="min-h-screen bg-black py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Our <span className="text-primary">Blog</span>
          </h1>
          <div className="w-20 h-0.5 bg-primary mx-auto mt-4"></div>
          <p className="mt-4 text-gray-300 max-w-xl mx-auto">
            Explore stories, insights, and updates from our community
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl text-white font-bold">No Blog Posts Yet</h2>
            <p className="text-gray-400 mt-2">Check back soon for new content!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => {
                const imageSrc = blog.featuredImage || FALLBACK_IMAGE;
                
                return (
                  <article
                    key={blog.id}
                    className="group bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <Link href={`/blog/${blog.slug}`} className="block relative overflow-hidden h-56">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageSrc}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {blog.status === 'published' && (
                        <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm px-3 py-1">
                          <span className="text-white text-[10px] font-medium tracking-wider">PUBLISHED</span>
                        </div>
                      )}
                    </Link>

                    <div className="p-6 space-y-3">
                      {blog.tags && (
                        <div className="flex flex-wrap gap-1.5">
                          {blog.tags.split(',').slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded">
                              #{tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      <Link href={`/blog/${blog.slug}`}>
                        <h3 className="text-white font-bold text-xl group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {blog.title}
                        </h3>
                      </Link>

                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                        {truncateText(blog.excerpt || blog.content)}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-gray-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5">
                            <FaUser className="text-primary text-[10px]" />
                            {blog.author || 'Admin'}
                          </span>
                        </div>
                        <span className="flex items-center gap-1.5">
                          <FaCalendarAlt className="text-primary text-[10px]" />
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </span>
                      </div>

                      <Link
                        href={`/blog/${blog.slug}`}
                        className="inline-flex items-center gap-1 text-primary text-sm hover:gap-2 transition-all duration-300 group"
                      >
                        Read More
                        <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Link
                  href={`/blog?page=${page - 1}`}
                  className={`px-4 py-2 border border-white/10 text-white hover:bg-primary/20 transition-colors ${
                    page <= 1 ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  Previous
                </Link>
                <span className="px-4 py-2 text-white bg-primary/20 border border-primary/30">
                  {page} / {totalPages}
                </span>
                <Link
                  href={`/blog?page=${page + 1}`}
                  className={`px-4 py-2 border border-white/10 text-white hover:bg-primary/20 transition-colors ${
                    page >= totalPages ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  Next
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}