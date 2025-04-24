"use client";

import Link from 'next/link';
import { Button } from './Button';

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 py-6 flex items-center">
        <div className="flex-1">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-semibold text-white">Revitalife</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center flex-1">
          <div className="flex space-x-10">
            <Link href="#ingredients" className="text-white hover:text-amber-400 transition-colors">
              About
            </Link>
            <Link href="#benefits" className="text-white hover:text-amber-400 transition-colors">
              Impact
            </Link>
            <Link href="#about" className="text-white hover:text-amber-400 transition-colors">
              Mission
            </Link>
            <Link href="#faq" className="text-white hover:text-amber-400 transition-colors">
              FAQ
            </Link>
          </div>
        </nav>

        <div className="flex-1 flex justify-end">
          <Button
            variant="primary"
            size="sm"
            onClick={() => document.getElementById('buy')?.scrollIntoView({ behavior: 'smooth' })}
            className="hidden md:block py-3 px-6"
          >
            Shop Now
          </Button>

          <button
            className="md:hidden text-white hover:text-amber-400 transition-colors"
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
