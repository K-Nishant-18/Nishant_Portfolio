import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiStar, FiCode, FiGitPullRequest, FiAlertCircle, FiArrowUpRight, FiEye } from 'react-icons/fi';
import ScrollRevealText from './ScrollRevealText';
import MetricCard from './MetricCard';
import RepoCard from './RepoCard';

gsap.registerPlugin(ScrollTrigger);

interface GitHubData {
  user: {
    public_repos: number;
    followers: number;
    login: string;
    avatar_url: string;
    created_at: string;
    html_url: string;
    following: number;
  };
  repos: Array<{
    stargazers_count: number;
    forks_count: number;
    name: string;
    html_url: string;
    updated_at: string;
    language: string;
    size: number;
  }>;
  stats: {
    totalStars: number;
    totalCommits: number;
    totalContributions: number;
    profileViews: number; // Added for Profile Views
  };
}

interface LanguageStat {
  lang: string;
  percentage: number;
  color: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  "JavaScript": "#f7df1e",
  "TypeScript": "#3178c6",
  "HTML": "#e34c26",
  "CSS": "#563d7c",
  "Python": "#3572a5",
  "Java": "#b07219",
  "C++": "#f34b7d",
  "C": "#555555",
  "Shell": "#89e051",
  "Vue": "#41b883",
  "React": "#61dafb",
  "Dart": "#00B4AB",
  "Kotlin": "#F18E33",
};

const getColor = (lang: string) => LANGUAGE_COLORS[lang] || "#888888";


const DevActivity: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const languageBarsRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<GitHubData | null>(null);
  const [languagePercentages, setLanguagePercentages] = useState<LanguageStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // --- Animation Setup ---
  useEffect(() => {
    console.log("Animation useEffect running");
    if (!loading && data) {
      const ctx = gsap.context(() => {
        if (titleRef.current) {
          gsap.from(titleRef.current, {
            scrollTrigger: { trigger: titleRef.current, start: "top 80%" },
            y: 30, opacity: 0, duration: 1, ease: "power3.out"
          });
        }
        if (cardsRef.current) {
          gsap.from(cardsRef.current.children, {
            scrollTrigger: { trigger: cardsRef.current, start: "top 80%" },
            y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out"
          });
        }
        if (languageBarsRef.current) {
          gsap.from(languageBarsRef.current.querySelectorAll('.group'), {
            scrollTrigger: { trigger: languageBarsRef.current, start: "top 80%" },
            x: -20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out"
          });
          // Animate bar fills
          // Animate bar fills - Use .from() to animate from 0 to the React-set width
          gsap.from(languageBarsRef.current.querySelectorAll('.bar-fill'), {
            scrollTrigger: { trigger: languageBarsRef.current, start: "top 80%" },
            width: "0%",
            duration: 1.5,
            ease: "power2.out",
            stagger: 0.1
          });
        }

      }, sectionRef);
      return () => ctx.revert();
    }
  }, [loading, data]);


  // --- Data Fetching ---
  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const username = 'K-Nishant-18';
        const token = import.meta.env.VITE_GITHUB_TOKEN;

        const headers: HeadersInit = token ? { Authorization: `token ${token}` } : {};

        // Fetch User Data
        const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
        const userData = await userRes.json();

        // Fetch Repos (Public) - Still needed for other stats
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
        const reposData = await reposRes.json();

        // --- Fetch External "Most Commit Language" SVG to get accurate Commit Stats ---
        // We parse the SVG directly because GitHub API doesn't provide commit counts per language efficiently.
        let parsedLanguageStats: LanguageStat[] = [];
        try {
          // Add timestamp to prevent caching
          const svgRes = await fetch(`https://corsproxy.io/?https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=${username}&t=${new Date().getTime()}`);
          const svgText = await svgRes.text();

          const parser = new DOMParser();

          // Fix invalid XML characters if any (SVG usually clean but safety first)
          const doc = parser.parseFromString(svgText, "image/svg+xml");

          // 1. Extract Legend (Map Color -> Language Name)
          // Look for <text> elements that contain the language name, and the preceding <rect> with fill color
          const legendMap = new Map<string, string>(); // color -> name
          const texts = Array.from(doc.querySelectorAll('text'));
          const rects = Array.from(doc.querySelectorAll('rect'));

          // The structure is specific: <g><rect><text>Language</text></g> or similar sequence
          // In the inspecting XML:
          // <rect ... fill="#b07219"></rect> ... <text>Java</text>
          // They are distinct elements in order.
          // Let's iterate and match by relative position (Y avg?) or just assume order matches.
          // Actually, the SVG source shows they are grouped or sequential.
          // Let's try to map by "finding the nearest rect with same Y or prev sibling"

          // Robust approach: Extract all <rect> with 'width="14"' (legend boxes) and all <text> with 'font-size: 14px'
          const legendRects = rects.filter(r => r.getAttribute('width') === '14');
          const legendTexts = texts.filter(t => t.style.fontSize === '14px' || t.getAttribute('font-size') === '14px');

          legendRects.forEach((rect, i) => {
            const color = rect.getAttribute('fill') || "";
            const text = legendTexts[i]?.textContent || "";
            if (color && text) {
              legendMap.set(color.toLowerCase(), text);
            }
          });

          // 2. Extract Slices and Calculate Percentages
          const arcs = Array.from(doc.querySelectorAll('path'));
          // Filter only arcs in the pie chart (usually have a known class or parent)
          // Structure: <g class="arc"><path ...></g>
          const validArcs = arcs.filter(p => p.parentElement?.getAttribute('class') === 'arc');


          const slices: { lang: string, percentage: number, color: string }[] = [];

          validArcs.forEach(path => {
            const d = path.getAttribute('d') || "";
            let color = path.getAttribute('fill') || "";
            if (!color && path.getAttribute('style')) {
              const match = path.getAttribute('style')?.match(/fill:\s*(#[a-fA-F0-9]+)/);
              if (match) color = match[1];
            }
            color = color.toLowerCase();

            // Regex to capture M x y ... A ... x y ...
            // Matches: M (group1) (group2) ... A ... (group3) (group4) L ...
            // This regex is tricky. 
            // Let's simply extract all sets of coordinates?
            // M startX startY ... endX endY L ...

            // Regex to capture numbers including scientific notation (e.g. 1.2e-5)
            const numberPattern = /-?\d*\.?\d+(?:[eE][-+]?\d+)?/g;
            const matches = d.match(numberPattern)?.map(Number);

            if (matches && matches.length >= 2) {
              // M x y is usually first 2
              const startX = matches[0];
              const startY = matches[1];

              // The arc command A takes 7 arguments.
              // The last 2 of the A command are endX, endY.
              // Sequence: M x y ... A rx ry rot large sweep endX endY ...
              // If matches has enough numbers, the last 2 before 'Z' or end are likely endX, endY
              // But finding them by fixed index is risky with variable path commands.
              // However, for this specific pie chart generator:
              // d="M... A... L... A... L..." or "M... A... L... Z"
              // It seems to be M len=2, A len=7. Total 9 numbers for a simple slice (+ L 0 0 if connected to center)

              if (matches.length >= 9) {
                // Index 7 and 8 are endX, endY of the Arc
                const endX = matches[7];
                const endY = matches[8];

                const startAngle = Math.atan2(startY, startX);
                const endAngle = Math.atan2(endY, endX);

                let diff = endAngle - startAngle;
                // Normalize to positive (0 to 2PI)
                while (diff < 0) diff += Math.PI * 2;

                const percentage = Math.round((diff / (Math.PI * 2)) * 100);

                if (legendMap.has(color)) {
                  slices.push({
                    lang: legendMap.get(color)!,
                    percentage: percentage,
                    color: color
                  });
                }
              }
            }
          });

          if (slices.length > 0) {
            // Sort by percentage desc
            slices.sort((a, b) => b.percentage - a.percentage);
            parsedLanguageStats = slices.map(s => ({
              lang: s.lang,
              percentage: s.percentage,
              color: getColor(s.lang) // Use our vivid colors, or use s.color (muted)
            }));
          }

        } catch (err) {
          console.error("Failed to fetch SVG stats:", err);
          // Fallback to existing logic if SVG fails?
          // For now, let's stick with empty or partial.
        }

        // --- Calculate Stats (Stars/Forks/Contribs) --- 
        // We still need this for the other cards
        let totalStars = 0;
        let totalForks = 0;

        if (Array.isArray(reposData)) {
          reposData.forEach((repo: any) => {
            if (repo.fork) return;
            totalStars += repo.stargazers_count;
            totalForks += repo.forks_count;
          });
        }

        // Use parsed stats if available, else fallback (though user prefers the SVG one)
        if (parsedLanguageStats.length > 0) {
          const top3 = parsedLanguageStats.slice(0, 3);
          const top3Percentage = top3.reduce((acc, curr) => acc + curr.percentage, 0);

          if (top3Percentage < 100) {
            top3.push({
              lang: "Others",
              percentage: 100 - top3Percentage,
              color: "#888888"
            });
          }
          setLanguagePercentages(top3);
        } else {
          // If SVG parsing failed, fall back to repo-based calculation
          let totalStars = 0;
          let totalForks = 0;
          const langCounts: Record<string, number> = {};

          if (Array.isArray(reposData)) {
            reposData.forEach((repo: any) => {
              if (repo.fork) return;

              totalStars += repo.stargazers_count;
              totalForks += repo.forks_count;
              if (repo.language) {
                const weight = repo.size || 1;
                langCounts[repo.language] = (langCounts[repo.language] || 0) + weight;
              }
            });
          }

          const totalSize = Object.values(langCounts).reduce((a, b) => a + b, 0);
          const sortedLangs = Object.entries(langCounts).sort(([, a], [, b]) => b - a);

          const stats: LanguageStat[] = sortedLangs.slice(0, 3).map(([lang, count]) => ({
            lang,
            percentage: totalSize > 0 ? Math.round((count / totalSize) * 100) : 0,
            color: getColor(lang),
          }));

          const top3Size = sortedLangs.slice(0, 3).reduce((acc, [, count]) => acc + count, 0);
          const otherSize = totalSize - top3Size;

          if (otherSize > 0 && stats.length === 3) {
            stats.push({
              lang: "Others",
              percentage: Math.round((otherSize / totalSize) * 100),
              color: "#888888"
            });
          }
          setLanguagePercentages(stats);
        }

        // --- Calculate Contributions (Recent & Total) ---
        let totalContributions = 0;
        let profileViews = 0;

        // Fetch Total Contributions from 3rd party or estimate
        try {
          // Attempt to get year total from a public API
          const contribRes = await fetch('https://github-contributions-api.jogruber.de/v4/K-Nishant-18');
          if (contribRes.ok) {
            const contribData = await contribRes.json();

            // Sum all years for All Time Contributions
            totalContributions = Object.values(contribData.total || {}).reduce((a: any, b: any) => a + b, 0) as number;
          }
        } catch (e) {
          console.warn("Contrib API failed", e);
        }

        // Fetch Profile Views from Komarev SVG
        try {
          // Add timestamp to prevent caching
          const viewsRes = await fetch(`https://corsproxy.io/?https://komarev.com/ghpvc/?username=K-Nishant-18e&label=PROFILE+VIEWS&t=${new Date().getTime()}`);

          if (viewsRes.ok) {
            const svgText = await viewsRes.text();

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(svgText, "image/svg+xml");
            const textNodes = xmlDoc.getElementsByTagName("text");
            const lastNode = textNodes[textNodes.length - 1];

            if (lastNode && lastNode.textContent) {
              const countText = lastNode.textContent.trim();
              const parsedCount = parseInt(countText.replace(/,/g, ''), 10);

              if (!isNaN(parsedCount)) {
                profileViews = parsedCount;
              }
            }
          }
        } catch (e) {
          console.warn("Profile Views extraction failed", e);
        }

        // If external API failed, use recent events * multiplier or just show recent
        if (totalContributions === 0) totalContributions = (userData.public_repos * 5); // Fallback estimate

        setData({
          user: userData,
          repos: Array.isArray(reposData) ? reposData : [],
          stats: {
            totalStars,
            totalCommits: totalForks, // REPURPOSED field to hold Forks count
            totalContributions,
            profileViews
          }
        });
      } catch (err: any) {
        console.error('Error fetching GitHub data:', err);
        setError(err.message || "Failed to load GitHub data");
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  if (loading) {
    return (
      <section className="min-h-[20vh] flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-2">
          <div className="w-3 h-3 bg-black dark:bg-white animate-spin"></div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400">Loading_Metrics...</span>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="min-h-[20vh] flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-2 text-red-500">
          <FiAlertCircle />
          <span className="font-mono text-[9px] uppercase tracking-widest">{error || "Data Unavailable"}</span>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="activity"
      className="relative py-24 md:py-32 bg-white dark:bg-black font-sans text-black dark:text-white"
    >
      <div className="max-w-8xl mx-auto px-6 md:px-16 relative z-10">

        {/* --- Header --- */}
        <div ref={titleRef} className="mb-20 grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-black/20 dark:border-white/20 pb-8">
          <div className="md:col-span-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-red-600"></span>
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">Activity_Log</span>
            </div>
            <h2 className="text-[10vw] md:text-[6vw] leading-[0.9] font-bold uppercase tracking-tighter mix-blend-difference">
              <ScrollRevealText text="OPEN_SOURCE" />
            </h2>
          </div>
          <div className="md:col-span-4 flex flex-col justify-end">
            <p className="text-sm md:text-base font-light text-zinc-600 dark:text-zinc-400 text-justify max-w-xs ml-auto">
              Tracking code contributions, library maintenance, and open-source experiments.
              Real-time data from the GitHub ecosystem.
            </p>
          </div>
        </div>

        {/* --- Profile & Metrics Split --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-16 px-36">

          {/* LEFT: Profile Section */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex flex-row items-center gap-4">
              <div className="w-16 h-16 md:w-16 md:h-16 bg-black dark:bg-white overflow-hidden rounded-full grayscale mix-blend-multiply dark:mix-blend-normal flex-shrink-0">
                <img src={data.user.avatar_url} alt={data.user.login} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-2xl font-bold uppercase tracking-tight">{data.user.login}</h3>
                <a href={data.user.html_url} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-zinc-500 hover:text-red-500 transition-colors">
                  @github_profile
                </a>
              </div>
            </div>

            <div className="flex flex-row gap-8">
              <div className="flex flex-col border-l-2 border-black dark:border-white pl-4">
                <span className="text-3xl font-bold leading-none">{data.user.followers}</span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Followers</span>
              </div>
              <div className="flex flex-col border-l-2 border-black dark:border-white pl-4">
                <span className="text-3xl font-bold leading-none">{data.user.following}</span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Following</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Metrics Grid (Compacted) */}
          <div ref={cardsRef} className="lg:col-span-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              icon={<FiStar />}
              title="Total Stars"
              value={data.stats.totalStars}
              description="Cumulative stars across all public repositories."
            />
            <MetricCard
              icon={<FiCode />}
              title="Public Repos"
              value={data.user.public_repos}
              description="Active libraries & experimental projects."
            />
            <MetricCard
              icon={<FiGitPullRequest />}
              title="Contributions"
              value={data.stats.totalContributions}
              description="Total commits, issues, and PRs all years."
            />
            <MetricCard
              icon={<FiEye />}
              title="Profile Views"
              value={data.stats.profileViews}
              description="Total views on your GitHub profile."
            />
          </div>
        </div>

        {/* --- Detailed Stats Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 px-36">

          {/* Recent Projects (List) */}
          <div className="lg:col-span-8">
            <div className="flex items-baseline justify-between mb-8 border-b-2 border-black dark:border-white pb-2">
              <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">Recent Projects</h3>
              <span className="font-mono text-xs uppercase tracking-widest text-red-600">Latest_Push</span>
            </div>
            <div className="flex flex-col">
              {data.repos.slice(0, 2).map((repo) => (
                <RepoCard
                  key={repo.name}
                  name={repo.name}
                  stars={repo.stargazers_count}
                  forks={repo.forks_count}
                  language={repo.language}
                  url={repo.html_url}
                  updated={repo.updated_at}
                />
              ))}
            </div>

            <a
              href={data.user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-black text-white dark:bg-white dark:text-black text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity duration-300"
            >
              Visit My GitHub <FiArrowUpRight />
            </a>
          </div>

          {/* Language Distribution (Minimal) */}
          <div ref={languageBarsRef} className="lg:col-span-4">
            <div className="flex items-baseline justify-between mb-8 border-b-2 border-black dark:border-white pb-2">
              <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">Top language</h3>
              <span className="font-mono text-xs uppercase tracking-widest text-red-600">Usage%</span>
            </div>

            <div className="space-y-6">
              {languagePercentages.map(({ lang, percentage }) => (
                <div key={lang} className="group cursor-default">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-lg font-bold">{lang}</span>
                    <span className="font-mono text-sm">{percentage}%</span>
                  </div>
                  {/* Thin sharp line instead of rounded bar */}
                  <div className="w-full h-[1px] bg-zinc-200 dark:bg-zinc-800 relative">
                    <div
                      className="bar-fill absolute top-0 left-0 h-[2px] -mt-[1px] bg-black dark:bg-white"
                      style={{ width: `${percentage}%`, backgroundColor: "#dc2626" }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Decorative Grid Lines if needed for 'Swiss' feel? Maybe optional */}
      </div>
    </section>
  );
};

export default DevActivity;
