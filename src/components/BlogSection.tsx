import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowUpRight, FiCornerDownRight } from 'react-icons/fi';
import ScrollRevealText from './ScrollRevealText';

gsap.registerPlugin(ScrollTrigger);

interface BlogPost {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string; // Still fetching but maybe not displaying?
  description: string;
  content: string;
  categories: string[];
}

const BlogSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Medium Data
  useEffect(() => {
    const fetchMedium = async () => {
      try {
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@me.knishant');
        const data = await res.json();
        if (data.status === 'ok') {
          setPosts(data.items.slice(0, 3));
        } else {
          console.warn("Medium RSS status not ok", data);
        }
      } catch (err) {
        console.error("Medium Fetch Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedium();
  }, []);

  // Helper: Format Date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section ref={sectionRef} id="blog" className="relative py-24 md:py-10  bg-white dark:bg-black font-sans text-black dark:text-white overflow-hidden min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">

        {/* --- HEADER --- */}
        <div className="mb-16 md:mb-16 relative">
          <div className="flex items-center gap-4 mb-4">
            <FiCornerDownRight className="text-red-500 w-6 h-6" />
            <span className="font-mono text-xs uppercase tracking-widest text-red-500">Thinking // Journals</span>
          </div>
          <h2 ref={titleRef} className="text-[12vw] md:text-[8vw] leading-[0.8] font-bold uppercase tracking-tighter text-transparent text-stroke-responsive select-none pointer-events-none whitespace-nowrap opacity-100">
            <ScrollRevealText text="INSIGHTS" />
          </h2>
        </div>

        {/* --- ASYMMETRICAL GRID LAYOUT (TEXT ONLY) --- */}
        <div ref={gridRef} className="border-t border-b border-black dark:border-white w-full">
          {loading ? (
            <div className="py-24 text-center font-mono uppercase tracking-widest opacity-50 animate-pulse">
              Loading Feed...
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[400px]"> {/* Reduced min-height since no image */}

              {/* FEATURED POST (Col 1-7) - TEXT ONLY */}
              {posts[0] && (
                <a
                  href={posts[0].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group md:col-span-7 border-b md:border-b-0 md:border-r border-black dark:border-white p-6 md:p-12 flex flex-col justify-between relative overflow-hidden transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black duration-500"
                >
                  {/* Background Texture on Hover? Maybe too much "banner". Keep strict. */}

                  <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest opacity-60 mb-8 mix-blend-difference">
                    <span className="text-red-500 font-bold group-hover:text-white dark:group-hover:text-black transition-colors">01 // Latest Feature</span>
                    <span>{formatDate(posts[0].pubDate)}</span>
                  </div>

                  <div className="my-auto">
                    <h3 className="text-4xl md:text-5xl font-bold leading-[0.9] mb-6 group-hover:translate-x-2 transition-transform duration-500">
                      {posts[0].title}
                    </h3>
                    <p className="hidden md:block text-sm md:text-lg font-light leading-relaxed opacity-60 max-w-lg mb-8 line-clamp-3">
                      {/* Extracting text content from HTML is hard without parsing, use description or title only */}
                      {/* Just title looks cleaner for "No Banner" */}
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
                    className={`group flex-1 p-8 border-b border-black dark:border-white ${index === 1 ? 'md:border-b-0' : ''} flex flex-col justify-between hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-500`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-6 opacity-60 text-xs font-mono uppercase tracking-widest mix-blend-difference">
                        <span>0{index + 2}</span>
                        <span>{formatDate(post.pubDate)}</span>
                      </div>
                      <h3 className="text-xl md:text-3xl font-bold leading-tight mb-4 group-hover:translate-x-2 transition-transform duration-300">
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
          ) : (
            <div className="py-24 text-center font-mono opacity-50 uppercase tracking-widest">
              No Articles Found
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <a href="https://medium.com/@me.knishant" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest hover:text-red-500 transition-colors group">
            View All on Medium <FiArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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