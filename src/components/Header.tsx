"use client";

import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from './Button';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Transform header opacity based on scroll position
  const headerBgOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 8]);

  // Update scroll state for non-framer elements
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren"
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, type: "spring", stiffness: 300 }
    }
  };

  const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  const burgerVariants = {
    closed: {},
    open: {}
  };

  // Navigation items
  const navItems = [
    { href: "/buy-now", label: "Buy now" },
    { href: "/ingredients", label: "Ingredients" },
    { href: "/faq", label: "FAQ" },
    { href: "/our-app", label: "Our App" }
  ];

  // Handle navigation based on current page
  const handleNavigation = (href: string) => {
    if (isHomePage && href.startsWith('#')) {
      document.getElementById(href.substring(1))?.scrollIntoView({ behavior: 'smooth' });
      if (isMobileMenuOpen) toggleMobileMenu();
    }
  };

  return (
    <header className="bg-emerald-950/90 backdrop-blur-md md:backdrop-blur-xs md:absolute fixed md:top-0 top-0 left-0 right-0 z-50 transition-all duration-300">
      <motion.div
        className="absolute inset-0 bg-emerald-950/93 -z-10"
        style={{
          opacity: 0,
          backdropFilter: `blur(${headerBlur.get()}px)`
        }}
      />

      <div className="container mx-auto px-4 md:px-8 py-2 md:py-3 flex items-center justify-between transition-all duration-300">
        {/* Logo */}
        <div className="flex-shrink-0 md:w-1/4">
          <Link href="/" className="flex items-center">
            <Image
              src="/Logo.png"
              alt="Revitalife Logo"
              width={250}
              height={30}
              className="h-12 md:h-20 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex justify-center flex-grow">
          <ul className="flex items-center space-x-10">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="whitespace-nowrap text-base font-medium text-white hover:text-amber-400 transition-colors"
                  onClick={(e) => {
                    if (isHomePage && item.href.startsWith('#')) {
                      e.preventDefault();
                      handleNavigation(item.href);
                    }
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Button and Mobile Menu Toggle */}
        <div className="flex-shrink-0 md:w-1/4 flex justify-end">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (isHomePage) {
                document.getElementById('buy')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/buy-now';
              }
            }}
            className="hidden md:block py-3 px-8"
          >
            Shop Now
          </Button>

          <motion.button
            className="md:hidden text-white hover:text-amber-400 transition-colors z-50"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={toggleMobileMenu}
            initial="closed"
            animate={isMobileMenuOpen ? "open" : "closed"}
            variants={burgerVariants}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop with blur effect */}
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              initial="closed"
              animate="open"
              exit="closed"
              variants={backdropVariants}
              onClick={toggleMobileMenu}
            />

            <motion.div
              className="fixed inset-x-0 top-0 mt-16 p-4 bg-emerald-900/95 backdrop-blur-md rounded-b-2xl z-40 shadow-xl"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              <div className="flex flex-col items-center space-y-6 py-6">
                {navItems.map((item, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Link
                      href={item.href}
                      className="text-xl font-medium text-white hover:text-amber-400 transition-colors"
                      onClick={(e) => {
                        if (isHomePage && item.href.startsWith('#')) {
                          e.preventDefault();
                          handleNavigation(item.href);
                        } else {
                          toggleMobileMenu();
                        }
                      }}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div variants={itemVariants} className="mt-4 pt-4 border-t border-emerald-700/50 w-32" />
                <motion.div variants={itemVariants}>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      if (isHomePage) {
                        document.getElementById('buy')?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.location.href = '/buy-now';
                      }
                      toggleMobileMenu();
                    }}
                    className="py-3 px-6 bg-amber-500 hover:bg-amber-600"
                  >
                    Shop Now
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
