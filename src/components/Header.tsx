"use client";

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from './Button';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 py-6 flex w-full justify-around items-center">
        <div className="flex w-full">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-semibold text-white">Revitalife</span>
          </Link>
        </div>

        <nav className="hidden md:flex md:w-full items-center justify-center">
          <div className="flex space-x-7">
            <Link href="#buy" className="text-white hover:text-amber-400 transition-colors">
              Buy now
            </Link>
            <Link href="#ingredients" className="text-white hover:text-amber-400 transition-colors">
              Ingredients
            </Link>
            <Link href="#faq" className="text-white hover:text-amber-400 transition-colors">
              FAQ
            </Link>
            <Link href="#app" className="text-white hover:text-amber-400 transition-colors">
              Our App
            </Link>
          </div>
        </nav>

        <div className="flex w-full justify-end">
          <Button
            variant="primary"
            size="sm"
            onClick={() => document.getElementById('buy')?.scrollIntoView({ behavior: 'smooth' })}
            className="hidden md:block py-3 px-6"
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
              className="fixed inset-x-0 top-0 mt-20 p-4 bg-emerald-900/95 backdrop-blur-md rounded-b-2xl z-40 shadow-xl"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              <div className="flex flex-col items-center space-y-6 py-6">
                {[
                  { href: "#buy", label: "Buy now" },
                  { href: "#ingredients", label: "Ingredients" },
                  { href: "#faq", label: "FAQ" },
                  { href: "#app", label: "Our App" }
                ].map((item, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Link
                      href={item.href}
                      className="text-xl font-medium text-white hover:text-amber-400 transition-colors"
                      onClick={toggleMobileMenu}
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
                      document.getElementById('buy')?.scrollIntoView({ behavior: 'smooth' });
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
