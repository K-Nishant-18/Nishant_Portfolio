import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowUpRight } from 'react-icons/fi';
import AsciiBanner from './AsciiBanner';

gsap.registerPlugin(ScrollTrigger);

interface BlogPost {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  categories: string[];
}

interface DevToArticle {
  title: string;
  published_at: string;
  url: string;
  id: number;
  user: { name: string };
  cover_image: string;
  description: string;
  body_html: string;
  tags: string[];
}

interface RssItem {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  categories: string[];
}

interface RssResponse {
  status: string;
  items: RssItem[];
}

const BlogSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dev.to articles via dev.to API (has proper CORS headers)
  useEffect(() => {
    const fetchMedium = async () => {
      try {
        const res = await fetch('https://dev.to/api/articles?username=me_nishant_18&per_page=3', { mode: 'cors' });
        const data = (await res.json()) as DevToArticle[];

        if (Array.isArray(data) && data.length > 0) {
          setPosts(
            data.map((item: DevToArticle) => ({
              title: item.title,
              pubDate: item.published_at,
              link: item.url,
              guid: item.id.toString(),
              author: item.user.name || 'Nishant',
              thumbnail: item.cover_image || '',
              description: item.description || '',
              content: item.body_html || '',
              categories: item.tags || [],
            }))
          );
          setLoading(false);
          return;
        }

        // Fallback: try RSS via rss2json
        const fallbackRes = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://dev.to/feed/me_nishant_18')}`, { mode: 'cors' });
        const fallbackData = (await fallbackRes.json()) as RssResponse;

        if (fallbackData.status === 'ok' && fallbackData.items && fallbackData.items.length > 0) {
          setPosts(
            fallbackData.items.map((item: RssItem) => ({
              title: item.title,
              pubDate: item.pubDate,
              link: item.link,
              guid: item.guid,
              author: item.author || 'Nishant',
              thumbnail: item.thumbnail || '',
              description: item.description || '',
              content: item.content || '',
              categories: item.categories || [],
            }))
          );
          setLoading(false);
          return;
        }

        setLoading(false);
        setError('Unable to load blog feed. Please visit dev.to directly.');
      } catch {
        setLoading(false);
        setError('Unable to load blog feed. Please visit dev.to directly.');
      }
    };
    fetchMedium();
  }, []);

  // Helper: Format Date
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section ref={sectionRef} id="blog" className="relative py-24 md:py-10 bg-white dark:bg-black font-sans text-black dark:text-white overflow-hidden min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">

        {/* --- HEADER --- */}
        <div className="mb-8 md:mb-10 relative">
          <h2 className="relative select-none pointer-events-none md:ml-[-15px] md:mb-[-15px]">
            <AsciiBanner text="INSIGHTS" outline className="max-w-xl md:max-w-xl" />
          </h2>
        </div>

        {/* --- ASYMMETRICAL GRID LAYOUT (TEXT ONLY) --- */}
        <div ref={gridRef} className="border-t border-b border-black dark:border-white w-full">
          {loading ? (
            <div className="py-24 text-center font-mono uppercase tracking-widest opacity-50 animate-pulse">
              Loading Feed...
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[400px]">

              {/* FEATURED POST (Col 1-7) - TEXT ONLY */}
              {posts[0] && (
                <a
                  href={posts[0].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-text="READ"
                  className="group md:col-span-7 border-b md:border-b-0 md:border-r border-black dark:border-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black duration-500"
                >
                  <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest opacity-60 mb-8 mix-blend-difference">
                    <span className="text-red-500 font-bold group-hover:text-white dark:group-hover:text-black transition-colors">
                      01 // Latest Feature
                    </span>
                    <span>{formatDate(posts[0].pubDate)}</span>
                  </div>

                  <div className="my-auto">
                    <h3 className="text-4xl md:text-4xl font-bold leading-[0.9] mb-6 group-hover:translate-x-2 transition-transform duration-500">
                      {posts[0].title}
                    </h3>
                    <p className="hidden md:block text-sm md:text-lg font-light leading-relaxed opacity-60 max-w-lg mb-8 line-clamp-3">
                      {posts[0].description || ''}
                    </p>
                  </div>

                  <div className="mt-auto pt-6 flex justify-between items-end border-t border-black/10 dark:border-white/10 group-hover:border-white/20 dark:group-hover:border-black/20 transition-colors">
                    <div className="text-[10px] font-mono uppercase tracking-widest border border-black/20 dark:border-white/20 px-3 py-1 rounded-full group-hover:border-white group-hover:text-white dark:group-hover:border-black dark:group-hover:text-black transition-colors">
                      {posts[0].categories?.[0] || 'Article'}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300">
                      Read Story <FiArrowUpRight className="text-red-500 group-hover:text-white dark:group-hover:text-black" />
                    </div>
                  </div>
                </a>
              )}

              {/* SIDEBAR POSTS (Col 8-12) */}
              <div className="md:col-span-5 flex flex-col">
                {posts.slice(1, 3).map((post, index) => (
                  <a
                    key={index}
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-text="READ"
                    className={`group flex-1 p-8 border-b border-black dark:border-white ${index === 1 ? 'md:border-b-0' : ''} flex flex-col justify-between hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-500`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-6 opacity-60 text-xs font-mono uppercase tracking-widest mix-blend-difference">
                        <span>0{index + 2}</span>
                        <span>{formatDate(post.pubDate)}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold leading-tight mb-4 group-hover:translate-x-2 transition-transform duration-300">
                        {post.title}
                      </h3>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-[10px] font-mono uppercase tracking-widest border border-black/20 dark:border-white/20 px-2 py-1 rounded-full group-hover:border-white/50 dark:group-hover:border-black/50 transition-colors">
                        {post.categories?.[0] || 'Read'}
                      </span>
                      <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-1 -translate-y-1" size={20} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="py-24 text-center font-mono opacity-50 uppercase tracking-widest">
              {error}
              <a href="https://dev.to/me_nishant_18" target="_blank" rel="noopener noreferrer" className="ml-2 text-red-500 hover:underline">
                View on dev.to
              </a>
            </div>
          ) : (
            <div className="py-24 text-center font-mono opacity-50 uppercase tracking-widest">
              No Articles Found
              <a href="https://dev.to/me_nishant_18" target="_blank" rel="noopener noreferrer" className="ml-2 text-red-500 hover:underline">
                View on dev.to
              </a>
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <a href="https://dev.to/me_nishant_18" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest hover:text-red-500 transition-colors group">
            View All on dev.to <FiArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

      </div>
      <style>{`
        .text-stroke-responsive {
           -webkit-text-stroke: 1px black;
        }
        .dark .text-stroke-responsive {
           -webkit-text-stroke: 1px white;
        }
       `}</style>
    </section>
  );
};

export default BlogSection;
