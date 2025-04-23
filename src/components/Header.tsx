"use client";

import Link from 'next/link';
import { Button } from './Button';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-semibold text-emerald-600">Revitalife</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#benefits" className="text-gray-700 hover:text-emerald-600 transition-colors">
            Benefits
          </Link>
          <Link href="#ingredients" className="text-gray-700 hover:text-emerald-600 transition-colors">
            Ingredients
          </Link>
          <Link href="#faq" className="text-gray-700 hover:text-emerald-600 transition-colors">
            FAQ
          </Link>
          <Link href="#about" className="text-gray-700 hover:text-emerald-600 transition-colors">
            Our Story
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="primary" size="sm">
            Shop Now
          </Button>

          <button
            className="md:hidden text-gray-700 hover:text-emerald-600 transition-colors"
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
