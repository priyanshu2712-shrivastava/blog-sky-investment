'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Footer from '@/components/Footer';
import AnimatedSpanText from '@/components/AnimatedSpanText';
import Link from 'next/link';
// Floating Icon Component
const FloatingIcon = ({ icon: Icon, delay, x, y }: { icon: any, delay: number, x: string, y: string }) => (
  <motion.div
    className={`absolute text-white/70 pointer-events-none z-0`}
    style={{ top: y, left: x }}
    animate={{
      opacity: [0.1, 0.5, 0.1],
      y: [0, -20, 0],
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
  >
    <Icon size={48} />
  </motion.div>
);


export default function Home() {

  return (
    <div className="bg-white dark:bg-zinc-950 w-full h-fit">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col overflow-hidden text-white w-full
    bg-gradient-to-b
    from-white via-sky-50 to-white
    dark:from-zinc-950 dark:via-zinc-900/60 dark:to-zinc-950
  ">
        <div className="max-w-3xl flex flex-col items-center justify-start mx-auto mt-5">
          <div className="relative flex flex-col items-center px-3 py-6 w-full">

            <h1 className="text-slate-900 dark:text-zinc-100 font-black text-[3rem] leading-tight w-full">
              Hi, I am{" "}
              <span className="
            bg-gradient-to-b
            from-blue-700 via-sky-400 to-transparent
            dark:from-sky-400 dark:via-cyan-300 dark:to-transparent
            text-transparent bg-clip-text
          ">
                <AnimatedSpanText
                  props={{ textContent: ["Akash Singh", "An Investor", "A Trader"] }}
                />
              </span>
            </h1>

            <p className="mt-4 text-slate-600 w-full dark:text-zinc-400 text-start">
              A stock market investor & trader with 5+ years of experience navigating
              equities, commodities, and market cycles.
            </p>

            <p className="mt-3 italic text-slate-700 dark:text-zinc-500 text-sm md:text-lg font-medium text-end w-full">
              I don’t trade charts alone—I study the business behind them.
            </p>

            <div className="
          absolute bottom-0 w-[50%] h-[1px]
          bg-gradient-to-r
          from-transparent via-zinc-600 to-transparent
          dark:via-zinc-700
        " />
          </div>

          {/* Card */}
          <div className="
        mt-20 w-full max-w-3xl rounded-2xl border
        border-slate-200
        bg-white/60
        backdrop-blur-sm
        px-8 py-10 shadow-md

        dark:border-zinc-800
        dark:bg-zinc-900/60
        dark:shadow-[0_0_0_1px_rgba(255,255,255,0.02)]
      ">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100 text-center">
              Sky Investment
            </h2>

            <div className="
          mx-auto mt-3 h-[1px] w-24
          bg-gradient-to-r
          from-transparent via-sky-600 to-transparent
          dark:via-cyan-400
        " />

            <p className="mt-6 text-slate-700 dark:text-zinc-400 text-justify leading-relaxed">
              This website is my canvas – A place where investing meets clarity,
              logic, and real-world experience. No noise. No fake gurus. Just honest
              analysis, real processes, and a mindset built to evolve.
            </p>

            <p className="mt-6 text-slate-700 dark:text-zinc-400 text-justify leading-relaxed">
              Welcome to the journey. Let’s learn, build, and compound knowledge –
              one insight at a time.
            </p>
          </div>

          <p
            id="disclaimer"
            className="
          mt-10 text-xs tracking-relaxed max-w-xl text-center
          text-yellow-700
          dark:text-yellow-500/80
        "
          >
            Educational content only. Not SEBI-registered. Please consult a qualified
            financial advisor before making investment decisions.
          </p>
        </div>
      </section>


      <InfoSection />
      <BlogShowCase />
      <Footer />
    </div>
  );
}


function InfoSection() {
  return (
    <section
      id="about"
      className="py-24 bg-white dark:bg-zinc-950"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-slate-900 dark:text-zinc-100 mb-4 w-full">
            Why Sky Investment
          </h2>

          <div
            className="
          w-48 h-[1px] mx-auto rounded-full
          bg-gradient-to-r from-transparent via-purple-600 to-transparent
          dark:via-purple-400/80
        "
          />

          <p className="mt-3 text-slate-600 dark:text-zinc-400 w-full text-center">
            Research-driven insights on markets, businesses, and the psychology
            behind capital and decision-making.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-6 auto-rows-fr max-w-5xl mx-auto perspective-wrapper">

          {/* Card 1 */}
          <div
            className="
          md:col-span-4 rounded-2xl border border-slate-200 bg-slate-50 p-8
          hover:shadow-lg hover:shadow-slate-100 hover:bg-gradient-to-br hover:from-slate-300 hover:to-white/80
          
          dark:border-zinc-800 dark:bg-zinc-900/60
          dark:hover:bg-gradient-to-br dark:hover:from-zinc-800 dark:hover:to-zinc-900
          dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)]
          grid-items
        "
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
              India’s Growth Story
            </h3>
            <p className="mt-3 text-slate-700 dark:text-zinc-400">
              Deep dives into the sectors, businesses, and capital flows shaping
              India’s long-term economic expansion and market leadership.
            </p>
          </div>

         {[
  {
    title: "Equities & Sectoral Opportunities",
    text:
      "Growth companies, emerging sector leaders, and business models driving earnings and scale.",
    accent: "red",
  },
  {
    title: "Commodities & Macro Trends",
    text:
      "Commodity cycles, demand–supply dynamics, and macro forces influencing prices and market sentiment.",
    accent: "sky",
  },
  {
    title: "Market Psychology",
    text:
      "Investor behaviour, trading psychology, and emotional patterns that shape decision-making in markets.",
    accent: "indigo",
  },
  {
    title: "Money, Risk & Financial Literacy",
    text:
      "Frameworks for managing risk, understanding money, and building clarity around long-term investing decisions.",
    accent: "purple",
  },
].map(({ title, text, accent }) => {
  // Define complete class names for each accent color with darker shades
  const accentClasses = {
    red: "hover:bg-gradient-to-br hover:from-red-500/30 hover:to-red-50 dark:hover:from-red-600/20 dark:hover:to-zinc-900",
    sky: "hover:bg-gradient-to-br hover:from-sky-500/30 hover:to-sky-50 dark:hover:from-sky-600/20 dark:hover:to-zinc-900",
    indigo: "hover:bg-gradient-to-br hover:from-indigo-500/30 hover:to-indigo-50 dark:hover:from-indigo-600/20 dark:hover:to-zinc-900",
    purple: "hover:bg-gradient-to-br hover:from-purple-500/30 hover:to-purple-50 dark:hover:from-purple-600/20 dark:hover:to-zinc-900",
  };

  return (
    <div
      key={title}
      className={`
        md:col-span-2 rounded-2xl border border-slate-200 p-6 backdrop-blur-md
        grid-items
        dark:border-zinc-800 dark:bg-zinc-900/50
        ${accentClasses[accent]}
      `}
    >
      <h3 className="font-semibold text-slate-900 dark:text-zinc-100">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
        {text}
      </p>
    </div>
  );
})}

          {/* Wide card */}
          <div
            className="
          md:col-span-6 rounded-2xl border border-slate-200 bg-slate-50 p-8
          hover:bg-gradient-to-br hover:from-violet-100 to-white
          backdrop-blur-md grid-items

          dark:border-zinc-800 dark:bg-zinc-900/60
          dark:hover:bg-gradient-to-br dark:hover:from-violet-400/10 dark:hover:to-zinc-900
        "
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
              Global Events & Geopolitical Context
            </h3>
            <p className="mt-3 text-slate-700 dark:text-zinc-400">
              Occasionally exploring global events, geopolitics, and cross-border
              developments that influence capital flows and market narratives.
            </p>
          </div>
        </div>
      </div>
    </section>

  )
}


function BlogShowCase() {
  const [blogs, setBlogs] = useState<any[]>([]);

  const trendingArticles = async () => {
    try {

      const res = await fetch('/api/blog');

      if (!res.ok) throw new Error("Failed to fetch blogs");

      const data = await res.json();
      console.log(data);
      setBlogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    trendingArticles();
  }, []);

  return (
    <section className="w-full bg-white dark:bg-zinc-950 py-12">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-14">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100">
            Blog & Insights
          </h2>
          <p className="mt-3 w-full text-slate-600 dark:text-zinc-400">
            Research-driven writing on markets, businesses, and the psychology
            behind capital and decision-making.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {blogs &&
            blogs.map((blog, idx) => (
              <Link href={`/blog/${blog.slug}`} key={idx}>
                <article
                  className="group rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden
                       bg-white dark:bg-zinc-900
                       hover:shadow-md dark:hover:shadow-xl
                       transition-all duration-300 cursor-pointer h-full"
                >
                  {/* Image */}
                  <div className="h-48 overflow-hidden bg-slate-100 dark:bg-zinc-800">
                    {blog.coverImage ? (
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        width={400}
                        height={300}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400 dark:text-zinc-600">
                        <span className="text-4xl">📰</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100 leading-snug">
                      {blog.title}
                    </h3>

                    <p className="mt-3 text-sm text-slate-600 dark:text-zinc-400 line-clamp-2">
                      {blog.excerpt}
                    </p>

                    <div
                      className="mt-3 inline-block rounded-full px-2 py-1 text-[10px] font-semibold uppercase
                           text-sky-500 bg-sky-100
                           dark:bg-sky-500/10 dark:text-sky-400"
                    >
                      {blog.category}
                    </div>

                    <div className="mt-5 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-500">
                      <span>{blog.readTime}</span>
                      <span
                        className="font-medium text-slate-700 dark:text-zinc-300
                             group-hover:text-sky-500 dark:group-hover:text-sky-400 transition"
                      >
                        Read analysis →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button
            className="rounded-xl border border-slate-300 dark:border-zinc-700
                   px-6 py-3 text-slate-700 dark:text-zinc-300
                   hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
          >
            <Link href={"/articles"}>View all blogs</Link>
          </button>
        </div>
      </div>
    </section>

  );
}
