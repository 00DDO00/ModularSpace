import Head from 'next/head';
import Link from 'next/link';
import { ArrowUpRight, Box, Palette, Ruler, Sparkles } from 'lucide-react';

export default function Home() {
  const pillars = [
    {
      title: 'Architectural control',
      description: 'Define structure on a granular grid, activations render live in both brutalist 2D and cinematic 3D.',
    },
    {
      title: 'Material narratives',
      description: 'Layer compartments with color, texture, and dhb blue finishes engineered for high drama interiors.',
    },
    {
      title: 'Precision scaling',
      description: 'Resize independent volumes in millimeter detail for signature shelving, wardrobes, or media walls.',
    },
  ];

  const stats = [
    { label: 'Configurations generated', value: '12K+' },
    { label: 'Design studios onboard', value: '320' },
    { label: 'Average build time', value: '27 days' },
  ];

  return (
    <>
      <Head>
        <title>ModularSpace · Brutalist Furniture Engine</title>
      </Head>

      {/* Hero */}
      <section className="border-y-2 border-line bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-24 px-4 py-24 sm:px-6 lg:px-0">
          <div className="grid gap-16 lg:grid-cols-[2fr,1fr] lg:items-start">
            <div className="space-y-10">
              <p className="text-xs tracking-[0.6rem] text-muted">MODULARSPACE / 2025 COLLECTION</p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl">
                Furniture engineered for the modern brutalist residence.
              </h1>
              <p className="max-w-xl text-lg text-muted">
                Compose monolithic shelving systems, frame objects in dhb blue accents, and orchestrate depth with our live configurator. Built for architects, stylists, and unapologetically bold interiors.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/configurator"
                  className="flex items-center justify-center gap-3 border-2 border-primary bg-primary px-8 py-4 text-sm font-semibold tracking-[0.35rem] text-contrast transition-transform hover:-translate-y-1"
                >
                  Launch configurator
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/gallery"
                  className="flex items-center justify-center gap-3 border-2 border-line px-8 py-4 text-sm font-semibold tracking-[0.35rem] text-primary transition-transform hover:-translate-y-1 hover:border-primary"
                >
                  View portfolio
                </Link>
              </div>
            </div>
            <div className="border-2 border-line bg-surface p-6">
              <div className="border-2 border-line bg-overlay p-8">
                <img
                  src="/images/modular_shelving_unit.webp"
                  alt="Brutalist modular shelving"
                  className="w-full border-2 border-line object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-10 border-t-2 border-line pt-10 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-3">
                <p className="text-xs tracking-[0.5rem] text-muted">{stat.label.toUpperCase()}</p>
                <p className="text-4xl font-semibold text-primary">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-b-2 border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-0">
          <div className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs tracking-[0.5rem] text-muted">THE PLATFORM</p>
              <h2 className="mt-4 text-4xl uppercase">
                Brutalist precision for visionary spaces.
              </h2>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 border-2 border-line px-6 py-3 text-xs font-semibold tracking-[0.3rem] text-primary hover:border-primary"
            >
              Explore manifesto
            </Link>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="space-y-6 border-2 border-line bg-background p-8">
                <div className="flex h-12 w-12 items-center justify-center border-2 border-line bg-surface">
                  <Sparkles className="h-6 w-6 text-dhbBlue" />
                </div>
                <h3 className="text-xl uppercase">{pillar.title}</h3>
                <p className="text-sm text-muted">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="border-b-2 border-line bg-background">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-0">
          <div className="grid gap-12 lg:grid-cols-[1.3fr,1fr]">
            <div className="space-y-8">
              <div className="border-2 border-line bg-surface p-8">
                <div className="flex items-center gap-4 pb-6">
                  <Box className="h-8 w-8 text-dhbBlue" />
                  <h3 className="text-2xl uppercase">Immersive 3D environment</h3>
                </div>
                <p className="text-sm text-muted">
                  Navigate your furniture system in a cinematic viewport with dynamic lighting, hard-lined shadows, and tactile depth. Drag to rotate, pause auto-motion, and scrutinize every joint.
                </p>
              </div>

              <div className="border-2 border-line bg-surface p-8">
                <div className="flex items-center gap-4 pb-6">
                  <Palette className="h-8 w-8 text-dhbBlue" />
                  <h3 className="text-2xl uppercase">Chromatic mastery</h3>
                </div>
                <p className="text-sm text-muted">
                  Flood individual compartments with raw pigment, from obsidian black to dhb blue. Toggle enclosures for dramatic conceal and reveal moments.
                </p>
              </div>

              <div className="border-2 border-line bg-surface p-8">
                <div className="flex items-center gap-4 pb-6">
                  <Ruler className="h-8 w-8 text-dhbBlue" />
                  <h3 className="text-2xl uppercase">Dimensional authority</h3>
                </div>
                <p className="text-sm text-muted">
                  Resize each wall with brutalist discipline. Drag handles, lock proportions, and generate sculptural asymmetry in seconds.
                </p>
              </div>
            </div>

            <div className="border-2 border-line bg-surface p-8">
              <div className="border-2 border-line bg-overlay">
                <img
                  src="https://images.unsplash.com/photo-1616627562215-973d46119723?w=900&h=1200&fit=crop"
                  alt="Configured brutalist furniture"
                  className="w-full border-2 border-line object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b-2 border-line bg-overlay">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-24 sm:px-6 lg:px-0 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-6">
            <p className="text-xs tracking-[0.5rem] text-muted">NEXT MOVE</p>
            <h2 className="text-4xl uppercase">
              Deploy the configurator. Architect your brutalist signature.
            </h2>
            <p className="max-w-xl text-sm text-muted">
              Enter the live environment to sculpt volumes, define rhythm, and export visuals ready for client decks or production handoff.
            </p>
          </div>
          <Link
            href="/configurator"
            className="border-2 border-primary bg-primary px-10 py-5 text-sm font-semibold tracking-[0.4rem] text-contrast transition-transform hover:-translate-y-1"
          >
            OPEN CONFIGURATOR
          </Link>
        </div>
      </section>
    </>
  );
}
