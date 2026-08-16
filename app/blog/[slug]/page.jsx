import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaCalendarAlt, FaUser, FaArrowLeft, FaShare, FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';
import apiService from '@/services/api';

// Fallback image as data URI (no external file needed)
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%231a1a1a'/%3E%3Ctext x='400' y='200' font-family='Arial' font-size='60' text-anchor='middle' fill='%23666'%3E📖%3C/text%3E%3C/svg%3E";

async function getBlogBySlug(slug) {
  try {
    const response = await apiService.getBlogBySlug(slug);
    return response?.data || null;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content) => {
    if (!content) return '1 min read';
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://thedjembecircle.com';
  const shareUrl = `${baseUrl}/blog/${blog.slug}`;

  // Use fallback if no featured image
  const imageSrc = blog.featuredImage || FALLBACK_IMAGE;

  return (
    <div className="min-h-screen bg-black py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8"
        >
          <FaArrowLeft className="text-sm" />
          Back to Blog
        </Link>

        <header className="mb-8">
          {blog.tags && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {blog.tags.split(',').map((tag, i) => (
                <span key={i} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <FaUser className="text-primary text-xs" />
              {blog.author || 'Admin'}
            </span>
            <span className="flex items-center gap-1.5">
              <FaCalendarAlt className="text-primary text-xs" />
              {formatDate(blog.publishedAt || blog.createdAt)}
            </span>
            <span className="text-gray-500">•</span>
            <span>{getReadingTime(blog.content)}</span>
          </div>
        </header>

        {/* Featured Image - NO onError handler */}
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          {blog.excerpt && (
            <div className="text-xl text-gray-300 border-l-4 border-primary pl-4 italic mb-6">
              {blog.excerpt}
            </div>
          )}

          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        <div className="border-t border-white/10 pt-6 mt-10">
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm flex items-center gap-2">
              <FaShare className="text-primary" />
              Share this post:
            </span>
            <div className="flex gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/40 transition-all duration-300"
              >
                <FaTwitter className="text-white text-sm" />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/40 transition-all duration-300"
              >
                <FaFacebook className="text-white text-sm" />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(blog.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/40 transition-all duration-300"
              >
                <FaLinkedin className="text-white text-sm" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static paths for blog posts
export async function generateStaticParams() {
  try {
    const response = await apiService.getBlogs({ limit: 100, status: 'published' });
    const blogs = response?.data?.blogs || response?.blogs || [];
    
    return blogs.map((blog) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}