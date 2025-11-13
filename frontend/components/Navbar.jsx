import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Grid } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Configurator', href: '/configurator' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-line bg-background">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-0">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center border-2 border-line bg-surface">
            <Grid className="h-6 w-6 text-dhbBlue" />
          </div>
          <span className="text-xl font-semibold tracking-[0.4rem] text-primary">
            MODULARSPACE
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium tracking-[0.3rem] text-muted transition-colors hover:text-primary"
            >
              {link.name.toUpperCase()}
            </Link>
          ))}
          <Link
            href="/configurator"
            className="border-2 border-primary px-6 py-3 text-sm font-semibold tracking-[0.35rem] text-primary transition-all hover:-translate-y-1 hover:bg-primary hover:text-contrast"
          >
            DESIGN
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-primary md:hidden"
        >
          {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t-2 border-line bg-background md:hidden">
          <div className="space-y-2 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block border-2 border-line px-4 py-3 text-sm font-semibold tracking-[0.3rem] text-primary hover:border-primary"
                onClick={() => setIsOpen(false)}
              >
                {link.name.toUpperCase()}
              </Link>
            ))}
            <Link
              href="/configurator"
              className="block border-2 border-primary bg-primary px-4 py-3 text-center text-sm font-semibold tracking-[0.3rem] text-contrast"
              onClick={() => setIsOpen(false)}
            >
              DESIGN
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
