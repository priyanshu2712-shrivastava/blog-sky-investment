import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-800 text-slate-300 border-t border-slate-800 mt-auto dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400">
  <div className="max-w-7xl mx-auto px-6 py-16">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
      <div className="col-span-1 md:col-span-2">
        <h3 className="text-2xl font-serif font-bold text-white dark:text-zinc-100 mb-4">
          Sky Investment
        </h3>
        <p className="text-slate-400 dark:text-zinc-400 leading-relaxed max-w-sm">
          Providing institutional-grade market analysis and long-term investment strategies for the intelligent investor, navigating complexity with clarity.
        </p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4 dark:text-zinc-100">Explore</h4>
        <ul className="space-y-3 text-sm">
          <li><Link href="/" className="hover:text-blue-400 dark:hover:text-blue-400 transition-colors">Home</Link></li>
          <li><Link href="/articles" className="hover:text-blue-400 dark:hover:text-blue-400 transition-colors">Market Insights</Link></li>
          <li><Link href="#about" className="hover:text-blue-400 dark:hover:text-blue-400 transition-colors">Investment Philosophy</Link></li>
          <li><Link href="#about" className="hover:text-blue-400 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4 dark:text-zinc-100">Legal</h4>
        <ul className="space-y-3 text-sm">
          <li><Link href="#" className="hover:text-blue-400 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
          <li><Link href="#" className="hover:text-blue-400 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
          <li><Link href="#disclaimer" className="hover:text-blue-400 dark:hover:text-blue-400 transition-colors">Disclaimer</Link></li>
          <li><Link href="/login" className="hover:text-blue-400 dark:hover:text-blue-400 transition-colors">Admin Login</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-slate-800 dark:border-zinc-700 pt-8 flex flex-col md:flex-row justify-between text-sm text-slate-500 dark:text-zinc-500">
      <p>© {new Date().getFullYear()} Sky Investment. All rights reserved.</p>

      <div className="w-fit flex flex-col mt-4 md:mt-0">
        <h4 className="text-white font-semibold mb-4 text-lg dark:text-zinc-100">Contact Us</h4>

        <ul className="flex flex-col gap-4 text-sm md:flex-row md:items-center md:gap-8">

          {/* X (Twitter) */}
          <li className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-white dark:text-zinc-100"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.654l-5.214-6.817-5.964 6.817H1.686l7.73-8.835L1.254 2.25h6.822l4.713 6.231 5.455-6.231zm-1.161 17.52h1.833L6.63 4.126H4.663l12.42 15.644z" />
            </svg>

            <a
              href="https://x.com/Vladimi43217870"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-blue-400 dark:hover:text-blue-400 transition-colors"
            >
              https://x.com/Vladimi43217870
            </a>
          </li>

          {/* Gmail */}
          <li className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-white dark:text-zinc-100"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 
              1.1.9 2 2 2h16c1.1 0 
              2-.9 2-2V6c0-1.1-.9-2-2-2zm0 
              4-8 5-8-5V6l8 5 8-5v2z" />
            </svg>

            <a
              href="mailto:ektasinghzz007@gmail.com"
              className="text-gray-300 hover:text-red-400 dark:hover:text-red-400 transition-colors break-all"
            >
              ektasinghzz007@gmail.com
            </a>
          </li>

          {/* Phone */}
          <li className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-white dark:text-zinc-100"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6.62 10.79a15.05 15.05 
              0 006.59 6.59l2.2-2.2a1 
              1 0 011.01-.24c1.12.37 
              2.33.57 3.58.57a1 1 0 
              011 1V20a1 1 0 
              01-1 1C10.07 21 3 13.93 
              3 5a1 1 0 
              011-1h3.5a1 1 0 
              011 1c0 1.25.2 2.46.57 
              3.59a1 1 0 
              01-.25 1.01l-2.2 2.19z" />
            </svg>

            <a
              href="tel:+919142728389"
              className="text-gray-300 hover:text-green-400 dark:hover:text-green-400 transition-colors"
            >
              +919142728389
            </a>
          </li>

        </ul>
      </div>
    </div>
  </div>
</footer>

    );
}
