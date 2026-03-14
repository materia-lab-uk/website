<script lang="ts">
  import Logo from '$lib/components/Logo.svelte';

  const services = [
    {
      title: 'Feasibility Sprint',
      duration: '1–2 weeks',
      description: 'Rapid technical assessment of your idea. Can it be built? What will it take? Clear answers, fast.',
    },
    {
      title: 'Concept Development',
      duration: '4–8 weeks',
      description: 'From validated concept to working prototype. Mechanical, electronic, and software design in parallel.',
    },
    {
      title: 'Product Development',
      duration: '8–24 weeks',
      description: 'Full product development from concept to production-ready. Design, build, test, iterate.',
    },
    {
      title: 'Fractional CTO',
      duration: 'Ongoing',
      description: 'Embedded technical leadership. Strategy, architecture, team mentoring. 1–2 days per week.',
    },
  ];

  const forge = {
    title: 'Materia Forge',
    subtitle: 'AI-Driven Prototype Design',
    description: 'We use AI to explore more of the design space than any traditional approach. You tell us what a part needs to do — our AI generates and physics-validates multiple design candidates in parallel, including solutions your engineers wouldn\'t have tried.',
    points: [
      'Requirements-first design exploration — not constrained by starting geometry',
      'Automated physics verification (FEA) before you see a single concept',
      'Three times as many validated concepts for the same budget and timeline',
      'AI-generated concepts refined into production-ready parametric CAD models by our engineers',
    ],
  };

  const capabilities = [
    'Robotics & Mechatronics',
    'Embedded Systems',
    'PCB Design & ECAD',
    'Control Systems',
    'Machine Learning',
    'Computer Vision',
    'Mathematical Modelling',
    'Rapid Prototyping',
    'AI-Driven Design',
  ];
</script>

<!-- Hero -->
<section class="min-h-[85vh] flex items-center px-6">
  <div class="max-w-4xl mx-auto">
    <div class="mb-10 hidden md:block">
      <Logo height={80} />
    </div>
    <p class="font-mono text-xs tracking-[0.3em] text-accent mb-6 uppercase md:hidden">Engineering & Technology Consultancy</p>
    <h1 class="text-5xl md:text-7xl font-light tracking-tight leading-[1.1] mb-6">
      From first principles<br />to first product.
    </h1>
    <p class="text-xl md:text-2xl font-light text-text-muted max-w-2xl leading-relaxed mb-10">
      We design and build complete systems — mechanical, electronic, and software —
      from the ground up. No handoffs. No committees. Just engineering that ships.
    </p>
    <div class="flex gap-4">
      <a href="/start" class="px-6 py-3 bg-accent text-surface font-medium rounded hover:bg-accent-dim transition-colors">
        Start a project
      </a>
      <a href="/example" class="px-6 py-3 border border-surface-border text-text-muted rounded hover:border-accent hover:text-accent transition-colors">
        See an example
      </a>
    </div>
  </div>
</section>

<!-- Services -->
<section id="services" class="px-6 py-24">
  <div class="max-w-6xl mx-auto">
    <p class="font-mono text-xs tracking-[0.3em] text-accent mb-8 uppercase">Services</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each services as service}
        <div class="border border-surface-border rounded-lg p-6 hover:border-accent/30 transition-colors">
          <div class="flex justify-between items-baseline mb-3">
            <h3 class="text-xl font-medium">{service.title}</h3>
            <span class="font-mono text-xs text-text-muted">{service.duration}</span>
          </div>
          <p class="text-text-muted leading-relaxed">{service.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Materia Forge -->
<section class="px-6 py-24 border-t border-surface-border">
  <div class="max-w-6xl mx-auto">
    <div class="border border-accent/30 bg-accent-glow rounded-lg p-8 md:p-12">
      <div class="flex flex-col md:flex-row md:items-start gap-8">
        <div class="flex-1">
          <p class="font-mono text-xs tracking-[0.3em] text-accent mb-3 uppercase">{forge.subtitle}</p>
          <h2 class="text-3xl md:text-4xl font-light tracking-tight mb-4">{forge.title}</h2>
          <p class="text-text-muted leading-relaxed mb-6">{forge.description}</p>
          <ul class="space-y-3 mb-8">
            {#each forge.points as point}
              <li class="flex gap-3 text-text-muted text-sm">
                <span class="text-accent mt-0.5 shrink-0">&#x2022;</span>
                <span class="leading-relaxed">{point}</span>
              </li>
            {/each}
          </ul>
          <a href="/start" class="inline-block px-6 py-3 bg-accent text-surface font-medium rounded hover:bg-accent-dim transition-colors">
            Start a Forge project
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Capabilities -->
<section class="px-6 py-24 bg-surface-alt">
  <div class="max-w-6xl mx-auto">
    <p class="font-mono text-xs tracking-[0.3em] text-accent mb-8 uppercase">Capabilities</p>
    <div class="flex flex-wrap gap-3">
      {#each capabilities as cap}
        <span class="px-4 py-2 text-sm font-mono text-text-muted border border-surface-border rounded-full">
          {cap}
        </span>
      {/each}
    </div>
  </div>
</section>

<!-- About -->
<section id="about" class="px-6 py-24">
  <div class="max-w-4xl mx-auto">
    <p class="font-mono text-xs tracking-[0.3em] text-accent mb-8 uppercase">About</p>
    <p class="text-lg leading-relaxed text-text-muted mb-4">
      Materia Lab is founded by <a href="https://nic.materia-lab.uk" target="_blank" rel="noopener" class="text-text font-normal hover:text-accent transition-colors">Dr Nicole Martin</a> —
      a physicist and engineer with 12+ years across Formula One, aerospace, robotics,
      academia, and product development.
    </p>
    <p class="text-lg leading-relaxed text-text-muted mb-4">
      Nicole designs and builds complete embedded robotic systems from the ground up:
      mechanical engineering, PCB and electronics design, firmware, control systems,
      and application software. Most engineering teams need five people to cover what
      she does alone — which means faster iteration, less waste, and someone who
      understands how every decision ripples through the entire system.
    </p>
    <p class="text-lg leading-relaxed text-text-muted">
      Previous work includes machine learning for Formula One aerodynamics (Williams and Toyota),
      continuum robots for Rolls-Royce jet engine inspection (Tharsus), and force-feedback
      robotic guidance systems (SquareFace).
    </p>
  </div>
</section>

<!-- CTA -->
<section class="px-6 py-24 bg-surface-alt">
  <div class="max-w-4xl mx-auto text-center">
    <h2 class="text-3xl md:text-4xl font-light mb-4">Got a hard problem?</h2>
    <p class="text-text-muted text-lg mb-8">Tell us about your project and get a tailored response in minutes.</p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="/start" class="px-8 py-4 bg-accent text-surface font-medium rounded text-lg hover:bg-accent-dim transition-colors">
        Start a project
      </a>
      <a href="/example" class="px-8 py-4 border border-surface-border text-text-muted font-medium rounded text-lg hover:border-accent hover:text-accent transition-colors">
        See an example
      </a>
    </div>
  </div>
</section>
