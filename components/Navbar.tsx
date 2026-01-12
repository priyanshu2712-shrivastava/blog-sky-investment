'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import Image from 'next/image';

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        let last = false;

        const handleScroll = () => {
            const next = window.scrollY > 20;
            if (next !== last) {
                last = next;
                setScrolled(next);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    let navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '#about' },
        { name: 'Articles', href: '/articles' },
    ];

    // Check if on article/blog page or articles listing page
    const isArticlePage = pathname.startsWith('/blog/') || pathname.startsWith('/articles');

    // Show About link only on home page (when not on article pages and not logged in)
    if (isArticlePage || session) {
        navLinks = navLinks.filter(link => link.name !== "About");
    }

    if (session) {
        navLinks.push({ name: 'Dashboard', href: '/admin' });
    }

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`sticky top-0  w-full z-50 py-3  transition-all duration-300 ${scrolled
                ? 'bg-white/50 dark:bg-black/50  md:px-12 backdrop-blur-md shadow-sm border-b border-gray-200/50'
                : 'bg-transparent border-b border-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="group relative ">
                    <div className="flex items-center gap-2">
                        <div className=" rounded-lg flex items-center justify-center text-white font-serif font-bold text-lg">
                            <Image src="/favicon/favicon-96x96.png" height={25} width={25} alt='logo' />
                        </div>
                        <span className={`font-serif text-xl hidden dark:text-neutral-200 md:flex font-bold tracking-tight transition-colors ${scrolled ? 'text-slate-900' : 'text-neutral-400 '}`}>
                            Sky Investment
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium transition-colors relative group ${pathname === link.href ? 'text-blue-600' : 'text-slate-600 '
                                } hover:text-indigo-600`}
                        >
                            {link.name}
                            {pathname === link.href && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                                />
                            )}
                        </Link>
                    ))}

                    {session &&
                        <button
                            onClick={() => signOut()}
                            className=" text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
                        >
                            Log out
                        </button>
                    }
                </div>
                <div className='flex gap-2'>
                    <ThemeToggle />
                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden relative z-50 p-2 text-slate-800"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-0 left-0 w-full bg-white shadow-xl border-b border-gray-100 p-6 pt-24 md:hidden flex flex-col gap-6"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`text-lg font-medium ${pathname === link.href ? 'text-blue-600' : 'text-slate-600'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {!session && (
                            <Link
                                href="/articles"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex justify-center items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl text-base font-medium"
                            >
                                Read Insights <ArrowRight size={16} />
                            </Link>
                        )}
                        {session && (
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    signOut();
                                }}
                                className="flex justify-center items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-xl text-base font-medium hover:bg-red-700 transition-colors"
                            >
                                Log out
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}