"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { IoSearch } from "react-icons/io5";
import { MdOutlinePersonOutline } from "react-icons/md";
import { TbShoppingBag } from "react-icons/tb";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Transform header opacity based on scroll position
  const headerBgOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 8]);

  // Update scroll state for non-framer elements
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        when: "afterChildren",
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, type: "spring", stiffness: 300 },
    },
  };

  const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  const burgerVariants = {
    closed: {},
    open: {},
  };

  // Navigation items
  const navItems = [
    { href: "/buy-now", label: "Buy now" },
    { href: "/ingredients", label: "Ingredients" },
    { href: "/faq", label: "FAQ" },
    { href: "/our-app", label: "Our App" },
  ];

  // Navigation items
  const navIcons = [
    { href: "/search", label: <IoSearch className="w-5 h-10" /> },
    {
      href: "/account",
      label: <MdOutlinePersonOutline className="w-5 h-10" />,
    },
    { href: "/basket", label: <TbShoppingBag className="w-5 h-10" /> },
  ];

  // Marquee items (single source of truth)
  const marqueeItems = [
    "Free UK Shipping on orders over £35",
    "Subscribe today and save 20%",
    "Free UK Shipping on orders over £35",
    "Subscribe today and save 20%",
  ];

  // Build one segment with consistent spacers between items and a trailing spacer
  const marqueeItemsWithSpacers = marqueeItems.flatMap((text, idx) => [
    <span
      key={`msg-${idx}`}
      className="whitespace-nowrap text-black font-regular"
    >
      {text}
    </span>,
    <span
      key={`sp-${idx}`}
      className="inline-block w-16 md:w-30 lg:w-60"
      aria-hidden="true"
    />,
  ]);

  // Handle navigation based on current page
  const handleNavigation = (href: string) => {
    if (isHomePage && href.startsWith("#")) {
      document
        .getElementById(href.substring(1))
        ?.scrollIntoView({ behavior: "smooth" });
      if (isMobileMenuOpen) toggleMobileMenu();
    }
  };

  return (
    <>
      <div className="flex flex-col">
        {/* Scrolling announcement bar (3 items per loop, seamless) */}
        <div className="w-full bg-[#bdc68b] h-12 text-sm text-emerald-900 overflow-hidden flex items-center px-4 md:px-8">
          <motion.div
            className="flex flex-none"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 50, ease: "linear", repeat: Infinity }}
          >
            <div className="flex flex-none items-center">
              {marqueeItemsWithSpacers}
            </div>
            <div className="flex flex-none items-center">
              {marqueeItemsWithSpacers}
            </div>
          </motion.div>
        </div>

        <header className="bg-white text-black backdrop-blur-md md:backdrop-blur-xs transition-all duration-300">
          <motion.div
            className="absolute inset-0 bg-emerald-950/93 -z-10"
            style={{
              opacity: 0,
              backdropFilter: `blur(${headerBlur.get()}px)`,
            }}
          />

          {/* Mobile row: hamburger / centered logo / icons */}
          <div className="md:hidden grid grid-cols-3 items-center px-4 py-3">
            <button
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={toggleMobileMenu}
              className="text-black justify-self-start"
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>

            <Link href="/" className="flex items-center justify-self-center">
              <Image
                src="/Logo.png"
                alt="Revitalife Logo"
                width={0}
                height={0}
                className="h-8 w-auto"
                priority
              />
            </Link>

            <div className="flex items-center space-x-4 justify-self-end">
              <Link href="/search" aria-label="Search">
                <IoSearch className="w-5 h-5" />
              </Link>
              <Link href="/account" aria-label="Account">
                <MdOutlinePersonOutline className="w-5 h-5" />
              </Link>
              <Link href="/basket" aria-label="Basket">
                <TbShoppingBag className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Desktop row */}
          <div className="hidden md:flex px-4 md:px-8 py-2 md:py-3 items-center justify-between transition-all duration-300">
            {/* Navigation - Desktop */}
            <nav className="hidden md:flex justify-start w-1/3 px-4">
              <ul className="flex items-center space-x-10">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="whitespace-nowrap text-base font-medium text-black hover:text-amber-500 transition-colors"
                      onClick={(e) => {
                        if (isHomePage && item.href.startsWith("#")) {
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

            <div>
              <Link href="/" className="flex items-center">
                <Image
                  src="/Logo.png"
                  alt="Revitalife Logo"
                  width={0}
                  height={0}
                  className="h-30 md:h-15 my-1 w-auto"
                  priority
                />
              </Link>
            </div>

            <nav className="hidden md:flex justify-end w-1/3 px-4">
              <ul className="flex items-center space-x-10">
                {navIcons.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="whitespace-nowrap text-base font-medium text-black hover:text-amber-500 transition-colors"
                      onClick={(e) => {
                        if (isHomePage && item.href.startsWith("#")) {
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
          </div>
        </header>
      </div>

      {/* Mobile menu - rendered outside header to avoid z-index conflicts */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[99999] pointer-events-none">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 pointer-events-auto"
            onClick={toggleMobileMenu}
          />
          {/* Drawer */}
          <motion.div
            className="absolute left-0 top-0 h-full w-9/10 bg-white text-black shadow-2xl p-6 pointer-events-auto"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-semibold">Menu</span>
              <button
                aria-label="Close"
                onClick={toggleMobileMenu}
                className="p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <ul className="space-y-5">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-lg font-medium hover:text-amber-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      )}
    </>
  );
}
