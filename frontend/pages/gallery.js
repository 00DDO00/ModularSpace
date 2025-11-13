import Head from 'next/head';
import { useState } from 'react';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const projects = [
    {
      id: 1,
      name: 'Obsidian Atrium',
      category: 'wall',
      image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3e4262?w=800&h=900&fit=crop',
      description: 'Two-story shelving facade featuring dhb blue inset modules.',
    },
    {
      id: 2,
      name: 'Corner Monolith',
      category: 'bookshelf',
      image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800&h=900&fit=crop',
      description: 'Brutalist library spine with cantilevered compartments.',
    },
    {
      id: 3,
      name: 'Gallery Archive',
      category: 'cabinet',
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=900&fit=crop',
      description: 'Fully enclosed volumes with perforated ventilation panels.',
    },
    {
      id: 4,
      name: 'Display Matrix',
      category: 'wall',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=900&fit=crop',
      description: 'Alternating open grids and mirrored surfaces for retail staging.',
    },
    {
      id: 5,
      name: 'Media Gallery',
      category: 'tv',
      image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&h=900&fit=crop',
      description: 'Low-slung entertainment stack with concealed wiring channels.',
    },
    {
      id: 6,
      name: 'Studio Command',
      category: 'office',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=900&fit=crop',
      description: 'Command center for creative teams with stepped shelving tiers.',
    },
    {
      id: 7,
      name: 'Pantry Framework',
      category: 'cabinet',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=900&fit=crop',
      description: 'Industrial kitchen unit with steel reinforcements and glass.',
    },
    {
      id: 8,
      name: 'Reading Vault',
      category: 'bookshelf',
      image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=900&fit=crop',
      description: 'Nested reading alcove with tactile textiles and lighting.',
    },
  ];

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'wall', name: 'Wall Systems' },
    { id: 'bookshelf', name: 'Libraries' },
    { id: 'cabinet', name: 'Cabinetry' },
    { id: 'tv', name: 'Media' },
    { id: 'office', name: 'Studios' },
  ];

  const filteredProjects =
    selectedCategory === 'all'
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <>
      <Head>
        <title>Portfolio · ModularSpace Installations</title>
      </Head>

      <div className="border-y-2 border-line bg-background">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-0">
          <div className="mb-16 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-6">
              <p className="text-xs tracking-[0.5rem] text-muted">PORTFOLIO</p>
              <h1 className="text-4xl sm:text-5xl uppercase">
                Brutalist installations in the wild.
              </h1>
              <p className="max-w-2xl text-sm text-muted">
                A curated catalogue of client builds—each configured inside ModularSpace, produced through our international fabrication partners, and staged for dramatic impact.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-xs tracking-[0.4rem] text-muted">FILTER</p>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`border-2 px-5 py-3 text-xs font-semibold tracking-[0.3rem] transition-all ${
                      selectedCategory === category.id
                        ? 'border-primary bg-primary text-contrast'
                        : 'border-line text-primary hover:border-primary'
                    }`}
                  >
                    {category.name.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div key={project.id} className="space-y-6 border-2 border-line bg-surface p-6">
                <div className="border-2 border-line bg-background">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full border-2 border-line object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg uppercase">{project.name}</h3>
                  <p className="text-xs tracking-[0.3rem] text-muted">{project.category.toUpperCase()}</p>
                  <p className="text-sm text-muted">{project.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 flex flex-col items-center gap-6 border-t-2 border-line pt-10 text-center">
            <p className="text-sm text-muted">
              Inspired? Architect a configuration tailored to your next project.
            </p>
            <a
              href="/configurator"
              className="border-2 border-primary bg-primary px-10 py-5 text-sm font-semibold tracking-[0.4rem] text-contrast transition-transform hover:-translate-y-1"
            >
              START CONFIGURING
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
