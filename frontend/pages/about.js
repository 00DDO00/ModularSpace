import Head from 'next/head';
import { Award, Heart, Zap } from 'lucide-react';

export default function About() {
  const ethos = [
    {
      icon: <Award className="h-8 w-8 text-dhbBlue" />,
      title: 'Precision Craft',
      body: 'Every module is engineered with architectural-grade tolerances, ensuring flawless assembly and longevity in high-traffic environments.',
    },
    {
      icon: <Heart className="h-8 w-8 text-dhbBlue" />,
      title: 'Sustainable Core',
      body: 'We source FSC-certified materials and low-impact finishes to deliver conscious luxury without compromising brutalist integrity.',
    },
    {
      icon: <Zap className="h-8 w-8 text-dhbBlue" />,
      title: 'Technological Edge',
      body: 'Our configurator fuses computational geometry with an uncompromising UI so your team can iterate at the speed of thought.',
    },
  ];

  const studio = [
    {
      heading: 'Global production partners',
      copy: 'From Istanbul to Milan, our network of ateliers crafts modular systems at scale, balancing industrial rigor with bespoke finishes.',
    },
    {
      heading: 'Research-led interiors',
      copy: 'We invest heavily in material R&D, partnering with architects to study brutalist cues, spatial rhythm, and sculptural storage taxonomies.',
    },
    {
      heading: 'Human-centric technology',
      copy: 'While the tooling is advanced, our ethos remains simple: empower designers to manifest radical visions with clarity and control.',
    },
  ];

  return (
    <>
      <Head>
        <title>Inside ModularSpace · Brutalist Furniture Studio</title>
      </Head>

      <div className="bg-background">
        <section className="border-y-2 border-line">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-0">
            <p className="text-xs tracking-[0.5rem] text-muted">MANIFESTO</p>
            <div className="mt-10 grid gap-12 lg:grid-cols-[2fr,1fr] lg:items-start">
              <div className="space-y-8">
                <h1 className="text-5xl sm:text-6xl">
                  A brutalist furniture lab engineered for contemporary iconography.
                </h1>
                <p className="text-lg text-muted">
                  ModularSpace launched to transform how spatial storytellers build statement storage. We rejected soft minimalism in favor of hard edges, tonal darkness, and unapologetic geometry.
                </p>
              </div>
              <div className="border-2 border-line bg-surface p-6">
                <img
                  src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=600&h=700&fit=crop"
                  alt="ModularSpace studio"
                  className="w-full border-2 border-line object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b-2 border-line bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-0">
            <div className="mb-16">
              <p className="text-xs tracking-[0.5rem] text-muted">ETHOS</p>
              <h2 className="mt-6 text-4xl uppercase">
                The principles that anchor our work.
              </h2>
            </div>

            <div className="grid gap-12 lg:grid-cols-3">
              {ethos.map((item) => (
                <div key={item.title} className="space-y-6 border-2 border-line bg-background p-10">
                  <div className="flex h-12 w-12 items-center justify-center border-2 border-line bg-surface">
                    {item.icon}
                  </div>
                  <h3 className="text-xl uppercase">{item.title}</h3>
                  <p className="text-sm text-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b-2 border-line">
          <div className="mx-auto grid max-w-6xl gap-16 px-4 py-24 sm:px-6 lg:px-0 lg:grid-cols-[1.2fr,1fr]">
            <div className="space-y-12">
              <p className="text-xs tracking-[0.5rem] text-muted">STUDIO OPERATIONS</p>
              {studio.map((item) => (
                <div key={item.heading} className="border-b-2 border-line pb-8 last:border-none">
                  <h3 className="text-2xl uppercase">{item.heading}</h3>
                  <p className="mt-4 text-sm text-muted">{item.copy}</p>
                </div>
              ))}
            </div>
            <div className="border-2 border-line bg-surface p-8">
              <div className="border-2 border-line bg-overlay p-6">
                <img
                  src="https://images.unsplash.com/photo-1523419409543-0c1df022bdd1?w=700&h=900&fit=crop"
                  alt="Workshop view"
                  className="w-full border-2 border-line object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b-2 border-line bg-overlay">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-0">
            <div className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs tracking-[0.5rem] text-muted">TEAM</p>
                <h2 className="mt-6 text-4xl uppercase">The directors behind ModularSpace.</h2>
              </div>
              <p className="max-w-lg text-sm text-muted">
                Multidisciplinary leaders merging computational design, interior architecture, and logistics.
              </p>
            </div>
            <div className="grid gap-12 md:grid-cols-3">
              {[
                { name: 'Sarah Johnson', role: 'Founder & CEO', image: 'photo-1494790108377-be9c29b29330' },
                { name: 'Michael Chen', role: 'Head of Design', image: 'photo-1507003211169-0a1dd7228f2d' },
                { name: 'Emily Rodriguez', role: 'Lead Engineer', image: 'photo-1438761681033-6461ffad8d80' },
              ].map((person) => (
                <div key={person.name} className="space-y-5 border-2 border-line bg-background p-6 text-center">
                  <img
                    src={`https://images.unsplash.com/${person.image}?w=500&h=500&fit=crop`}
                    alt={person.name}
                    className="mx-auto w-48 border-2 border-line object-cover"
                  />
                  <div className="space-y-2">
                    <h3 className="text-lg uppercase">{person.name}</h3>
                    <p className="text-xs tracking-[0.4rem] text-muted">{person.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b-2 border-line bg-background">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-24 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-0">
            <div className="space-y-6">
              <p className="text-xs tracking-[0.5rem] text-muted">COLLABORATE</p>
              <h2 className="text-4xl uppercase">
                Join the ModularSpace Collective.
              </h2>
              <p className="max-w-xl text-sm text-muted">
                Partner with us for launch installations, concept stores, or private residences. We build loud, confident statements with exacting detail.
              </p>
            </div>
            <a
              href="/contact"
              className="border-2 border-primary bg-primary px-10 py-5 text-sm font-semibold tracking-[0.4rem] text-contrast transition-transform hover:-translate-y-1"
            >
              CONNECT WITH STUDIO
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
