
import Link from 'next/link';
import Image from 'next/image';
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
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">

      {/* Hero Banner - matching About page */}
      <section className="relative h-[300px] w-full overflow-hidden sm:h-[350px] lg:h-[400px]">
        <Image
          src="/images/banner1.jpg"
          alt="The Djembe Circle Blog"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

        {/* Two-line banner text */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="inline-flex items-center border-l-4 border-primary bg-white/5 px-6 py-2 mb-4 backdrop-blur-sm">
              <span className="text-primary text-sm font-semibold">
                ✦ Our Stories
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white">
              Our <span className="text-primary">Blog</span>
            </h1>

            <p className="mt-4 text-base md:text-xl text-gray-300 max-w-2xl mx-auto">
              Stories, insights and updates from our community
            </p>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary/80" />
      </section>

      {/* Blog Content */}
      <section className="relative px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Subtle background accents */}
        <div className="pointer-events-none absolute top-20 right-0 w-72 h-72 rounded-full bg-primary/[0.04] blur-[100px]" />
        <div className="pointer-events-none absolute bottom-20 left-0 w-72 h-72 rounded-full bg-primary/[0.03] blur-[100px]" />

        <div className="relative container mx-auto max-w-7xl">

          {/* Section Heading */}
          <div className="text-left mb-10 md:mb-12 border-b border-white/10 pb-7">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-7 h-px bg-primary" />
              <span className="text-primary text-xs font-semibold uppercase tracking-[0.25em]">
                From Our Journal
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Latest <span className="text-primary">Stories</span>
            </h2>

            <p className="mt-3 text-gray-400 max-w-xl text-sm md:text-base leading-relaxed">
              Explore stories, insights, and updates from our community.
            </p>
          </div>

          {blogs.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20 px-5 border border-white/10 bg-white/[0.02]">
              <div className="text-5xl mb-5">📝</div>

              <h2 className="text-2xl text-white font-bold">
                No Blog Posts Yet
              </h2>

              <p className="text-gray-400 mt-3 text-sm">
                Check back soon for new content!
              </p>
            </div>
          ) : (
            <>
              {/* Blog Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {blogs.map((blog) => {
                  const imageSrc = blog.featuredImage || FALLBACK_IMAGE;

                  return (
                    <article
                      key={blog.id}
                      className="group flex flex-col bg-[#0c0c0c] border border-white/10 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_15px_45px_rgba(255,0,0,0.08)]"
                    >
                      {/* Featured Image */}
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="block relative overflow-hidden aspect-[16/10] bg-[#141414]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageSrc}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

                        {blog.status === 'published' && (
                          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md border border-white/15 px-3 py-2">
                            <span className="text-white text-[10px] font-medium tracking-wider uppercase">
                              Published
                            </span>
                          </div>
                        )}

                        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-2">
                          <span className="text-primary text-[10px] font-semibold uppercase tracking-[0.18em]">
                            Djembe Circle
                          </span>
                        </div>

                        <div className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center bg-primary text-black opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          <FaArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                        </div>
                      </Link>

                      {/* Blog Details */}
                      <div className="p-5 sm:p-6 flex flex-col flex-1">

                        {/* Tags */}
                        {blog.tags && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {blog.tags.split(',').slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                className="text-[10px] bg-primary/[0.08] border border-primary/20 text-primary px-2.5 py-1"
                              >
                                #{tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Title */}
                        <Link href={`/blog/${blog.slug}`}>
                          <h3 className="text-white font-bold text-xl leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300">
                            {blog.title}
                          </h3>
                        </Link>

                        {/* Excerpt */}
                        <p className="text-gray-400 text-sm leading-7 mt-3 line-clamp-3">
                          {truncateText(blog.excerpt || blog.content)}
                        </p>

                        {/* Author and Date */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-auto pt-5 mt-5 border-t border-white/[0.08] text-xs text-gray-400">
                          <span className="flex items-center gap-2">
                            <FaUser className="text-primary text-[10px]" />
                            {blog.author || 'Admin'}
                          </span>

                          <span className="flex items-center gap-2">
                            <FaCalendarAlt className="text-primary text-[10px]" />
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </span>
                        </div>

                        {/* Read More */}
                        <Link
                          href={`/blog/${blog.slug}`}
                          className="inline-flex items-center gap-2 mt-5 text-primary text-xs font-semibold uppercase tracking-[0.15em] hover:gap-4 transition-all duration-300"
                        >
                          Read More
                          <FaArrowRight className="text-[10px]" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 md:mt-16">
                  <Link
                    href={`/blog?page=${page - 1}`}
                    className={`px-4 py-3 border border-white/10 text-white text-sm hover:border-primary hover:bg-primary hover:text-black transition-colors ${
                      page <= 1 ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    Previous
                  </Link>

                  <span className="px-5 py-3 text-sm text-primary bg-primary/[0.08] border border-primary/30">
                    {page} / {totalPages}
                  </span>

                  <Link
                    href={`/blog?page=${page + 1}`}
                    className={`px-4 py-3 border border-white/10 text-white text-sm hover:border-primary hover:bg-primary hover:text-black transition-colors ${
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
      </section>
    </main>
  );
}
