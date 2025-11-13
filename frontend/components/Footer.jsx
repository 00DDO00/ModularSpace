import Link from 'next/link';
import { Grid, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t-2 border-line bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-0">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center border-2 border-line bg-surface">
                <Grid className="h-6 w-6 text-dhbBlue" />
              </div>
              <span className="text-xl font-semibold tracking-[0.3rem] text-primary">
                MODULARSPACE
              </span>
            </div>
            <p className="max-w-xs text-sm text-muted">
              Architectural furniture systems engineered for statement interiors.
              Configure. Refine. Own the room.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-[0.5rem] text-muted">
              NAVIGATION
            </h3>
            <div className="space-y-3 text-sm font-medium text-primary">
              <Link href="/" className="block border-b border-line pb-3 uppercase tracking-[0.3rem] hover:text-dhbBlue">
                Home
              </Link>
              <Link href="/gallery" className="block border-b border-line pb-3 uppercase tracking-[0.3rem] hover:text-dhbBlue">
                Gallery
              </Link>
              <Link href="/configurator" className="block border-b border-line pb-3 uppercase tracking-[0.3rem] hover:text-dhbBlue">
                Configurator
              </Link>
              <Link href="/about" className="block border-b border-line pb-3 uppercase tracking-[0.3rem] hover:text-dhbBlue">
                About
              </Link>
              <Link href="/contact" className="block uppercase tracking-[0.3rem] hover:text-dhbBlue">
                Contact
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-[0.5rem] text-muted">
              SERVICES
            </h3>
            <ul className="space-y-3 text-sm uppercase tracking-[0.25rem] text-primary">
              <li className="border-b border-line pb-3">Custom Design Labs</li>
              <li className="border-b border-line pb-3">3D Visualization Suites</li>
              <li className="border-b border-line pb-3">Material Curation</li>
              <li>Delivery & Installation</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-[0.5rem] text-muted">
              CONTACT
            </h3>
            <ul className="space-y-5 text-sm text-primary">
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-dhbBlue" />
                <div>
                  <p className="uppercase tracking-[0.3rem] text-muted">Email</p>
                  <p>info@modularspace.com</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-dhbBlue" />
                <div>
                  <p className="uppercase tracking-[0.3rem] text-muted">Studio</p>
                  <p>+1 (555) 123-4567</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-dhbBlue" />
                <div>
                  <p className="uppercase tracking-[0.3rem] text-muted">HQ</p>
                  <p>Istanbul · Design District</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t-2 border-line pt-6 text-xs uppercase tracking-[0.4rem] text-muted">
          © 2024 ModularSpace · Crafted for Visionary Interiors
        </div>
      </div>
    </footer>
  );
}
