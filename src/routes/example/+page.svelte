<script lang="ts">
  import { onMount } from 'svelte';
  import { driver } from 'driver.js';
  import 'driver.js/dist/driver.css';

  let tourStarted = $state(false);

  function startTour() {
    tourStarted = true;
    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: 'rgba(0, 0, 0, 0.75)',
      popoverClass: 'materia-tour',
      steps: [
        {
          element: '#tour-banner',
          popover: {
            title: 'Welcome',
            description: 'This is an example of what you\'ll get when you submit a project to Materia Lab. Let\'s walk through it.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '#tour-title',
          popover: {
            title: 'AI-Generated Title',
            description: 'Our AI reads your project description and generates a clear title and initial analysis — usually within a few minutes of submitting.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-summary',
          popover: {
            title: 'Project Summary',
            description: 'A concise overview of what you\'re looking to build and the key challenges involved. This shows the AI has understood your brief.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-feasibility',
          popover: {
            title: 'Feasibility Analysis',
            description: 'An honest analysis of whether your idea is achievable within your stated budget and timeline — no sugar-coating.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-approach',
          popover: {
            title: 'Recommended Approach',
            description: 'Key areas and considerations for the project. This gives you a clear picture of what\'s involved — Nicole refines this during the discovery call.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-metrics',
          popover: {
            title: 'Service, Timeline & Budget',
            description: 'Initial estimates for the engagement type, timeline, and budget — a starting point for your conversation with Nicole.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#tour-risks',
          popover: {
            title: 'Key Risks',
            description: 'Every project has unknowns. We flag them upfront so you can make informed decisions before committing.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-next-steps',
          popover: {
            title: 'Next Steps',
            description: 'Clear actions to move forward — including booking a free discovery call with Nicole to discuss the analysis in detail.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-chat',
          popover: {
            title: 'AI Discussion',
            description: 'You can chat with our AI to ask follow-up questions about the analysis. Nicole reads the conversation before your discovery call, so it saves time.',
            side: 'top',
            align: 'start',
          },
        },
        {
          element: '#tour-nicole',
          popover: {
            title: 'Nicole Joins the Conversation',
            description: 'After reviewing the analysis and chat, Nicole jumps into the discussion directly — adding her own technical insight.',
            side: 'top',
            align: 'start',
          },
        },
        {
          element: '#tour-cta',
          popover: {
            title: 'Ready to Start?',
            description: 'Submit your own project and get an AI-generated assessment in minutes. It\'s free, confidential, and covered by a mutual NDA.',
            side: 'top',
            align: 'center',
          },
        },
      ],
      onDestroyed: () => { tourStarted = false; },
    });
    driverObj.drive();
  }
</script>

<svelte:head>
  <title>Example Project Analysis — Materia Lab</title>
  <meta name="description" content="See what a Materia Lab project analysis looks like. AI-powered initial technical analysis for your product idea." />
</svelte:head>

<section class="px-6 py-24">
  <div class="max-w-7xl mx-auto">
    <!-- Example banner -->
    <div id="tour-banner" class="border border-accent/30 bg-accent-glow rounded-lg px-6 py-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p class="text-sm font-medium text-accent">Example Analysis</p>
        <p class="text-xs text-text-muted mt-1">This is a sample project analysis to show what you'll receive when you submit a project.</p>
      </div>
      <div class="flex gap-3 shrink-0">
        <button onclick={startTour}
          class="px-5 py-2 border border-accent/40 text-accent text-sm font-medium rounded hover:bg-accent/10 transition-colors">
          Take the tour
        </button>
        <a href="/start" class="px-5 py-2 bg-accent text-surface text-sm font-medium rounded hover:bg-accent-dim transition-colors text-center">
          Start your project
        </a>
      </div>
    </div>

    <p class="font-mono text-xs tracking-[0.3em] text-accent mb-6 uppercase">Project Analysis</p>

    <div class="flex-1 min-w-0">
      <div id="tour-title">
        <h1 class="text-3xl md:text-4xl font-light tracking-tight mb-2">Autonomous Pancake-Flipping Robot</h1>
        <p class="text-sm text-text-muted mb-10">
          Prepared for Alex T by Materia Lab AI &middot; 12 March 2026
        </p>
      </div>

      <div id="tour-summary" class="mb-10">
        <h2 class="text-lg font-medium mb-3">Summary</h2>
        <p class="text-text-muted leading-relaxed">You're looking to build a robot capable of autonomously detecting and flipping pancakes on a griddle or pan. This is an interesting challenge that combines computer vision, mechanical actuation, and real-time control. The core difficulty here is the mechanical flip itself — there are several fundamentally different ways to approach it (spatula, gripper, pan-tilt), each with different trade-offs. This is a project that could benefit significantly from exploring multiple design directions in parallel rather than committing to one early.</p>
      </div>

      <div id="tour-feasibility" class="mb-10">
        <h2 class="text-lg font-medium mb-3">Feasibility</h2>
        <p class="text-text-muted leading-relaxed">The core concept is technically feasible. Vision-based pancake detection is straightforward — the real engineering challenge is the flip mechanism. A spatula-style flipper needs to slide under a fragile, partially-cooked pancake without tearing it. A gripper approach avoids that but introduces its own complexity around grip force and deformation. A pan-rotation mechanism sidesteps both but constrains the cooking surface. These are fundamentally different design directions, and the right choice depends on constraints you'd want to explore before committing. Your stated 1–2 week timeline and under-£5k budget would need to be revisited — but a focused initial exploration could narrow the field quickly.</p>
      </div>

      <div id="tour-approach" class="mb-10">
        <h2 class="text-lg font-medium mb-3">Possible Approach</h2>
        <ul class="space-y-2">
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent mt-1 shrink-0">&#x2022;</span>
            <span class="leading-relaxed">Use AI-driven design exploration to generate and evaluate multiple flipper mechanism concepts in parallel — spatula, gripper, and pan-tilt — rather than picking one upfront and hoping it works.</span>
          </li>
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent mt-1 shrink-0">&#x2022;</span>
            <span class="leading-relaxed">For each mechanism concept, automatically verify against physical constraints: payload, reach envelope, force required to lift/flip, and compatibility with the cooking surface geometry.</span>
          </li>
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent mt-1 shrink-0">&#x2022;</span>
            <span class="leading-relaxed">Implement a computer vision module (OpenCV or similar) to detect pancakes on the cooking surface and estimate doneness from colour and edge characteristics.</span>
          </li>
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent mt-1 shrink-0">&#x2022;</span>
            <span class="leading-relaxed">Select the most promising mechanism from the validated candidates and 3D-print a working prototype for physical testing.</span>
          </li>
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent mt-1 shrink-0">&#x2022;</span>
            <span class="leading-relaxed">Develop the control software to coordinate vision, timing, and mechanical motion — with the flip trajectory tuned to the chosen mechanism.</span>
          </li>
        </ul>
      </div>

      <div id="tour-metrics" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div class="border border-surface-border rounded-lg p-5">
          <p class="font-mono text-xs text-accent mb-2 uppercase tracking-wider">Suggested service</p>
          <p class="text-text font-medium">Materia Forge</p>
        </div>
        <div class="border border-surface-border rounded-lg p-5">
          <p class="font-mono text-xs text-accent mb-2 uppercase tracking-wider">Initial timeline estimate</p>
          <p class="text-text font-medium">2–3 weeks for the AI design exploration and mechanism selection; 4–6 weeks additional for a working prototype with vision integration.</p>
        </div>
        <div class="border border-surface-border rounded-lg p-5">
          <p class="font-mono text-xs text-accent mb-2 uppercase tracking-wider">Initial budget estimate</p>
          <p class="text-text font-medium">£4k–£6k for the Forge exploration phase (mechanism design + validation); £8k–£14k total including prototype build and vision integration.</p>
        </div>
      </div>

      <div id="tour-risks" class="mb-10">
        <h2 class="text-lg font-medium mb-3">Key Risks & Unknowns</h2>
        <ul class="space-y-2">
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent mt-1 shrink-0">&#x26A0;</span>
            <span class="leading-relaxed">Pancake geometry and consistency vary widely — a mechanism that works for thick American pancakes may fail on thin crêpes. Defining the target pancake spec early will narrow the design space.</span>
          </li>
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent mt-1 shrink-0">&#x26A0;</span>
            <span class="leading-relaxed">The flip itself is a dynamic event — the mechanism needs to be fast enough to prevent tearing but controlled enough for a clean landing. This likely needs physical tuning even after simulation.</span>
          </li>
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent mt-1 shrink-0">&#x26A0;</span>
            <span class="leading-relaxed">Heat exposure near the cooking surface will constrain material and sensor choices. Any mechanism or camera mount needs to tolerate sustained proximity to a 200°C+ surface.</span>
          </li>
        </ul>
      </div>

      <div id="tour-next-steps" class="mb-10">
        <h2 class="text-lg font-medium mb-3">Next Steps</h2>
        <ol class="space-y-2">
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent font-mono text-sm mt-0.5 shrink-0">1.</span>
            <span class="leading-relaxed">Book a discovery call with Nicole to discuss your core goal — novelty demo, research prototype, or product? — and define the mechanical envelope (cooking surface type, size, approach direction).</span>
          </li>
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent font-mono text-sm mt-0.5 shrink-0">2.</span>
            <span class="leading-relaxed">Nicole will scope a Materia Forge engagement to explore the flip mechanism design space — generating multiple validated concepts with trade-off analysis before committing to a build.</span>
          </li>
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent font-mono text-sm mt-0.5 shrink-0">3.</span>
            <span class="leading-relaxed">From the Forge output, select the strongest mechanism candidate and move into a focused prototype build with vision integration.</span>
          </li>
        </ol>
      </div>

      <!-- Example chat preview (read-only) -->
      <div id="tour-chat" class="mb-10">
        <h2 class="text-lg font-medium mb-3">Discussion</h2>
        <div class="border border-surface-border rounded-lg p-6 space-y-3">
          <div class="border border-accent/20 bg-accent-glow rounded-lg p-3">
            <div class="flex justify-between items-baseline mb-1">
              <span class="text-xs font-medium text-accent">Materia Lab AI</span>
              <span class="font-mono text-[10px] text-text-muted">12 Mar 15:04</span>
            </div>
            <p class="text-text-muted leading-relaxed text-sm">Hi Alex! Your initial analysis is ready — we've suggested Materia Forge as a starting point, since there are several fundamentally different ways to approach the flip mechanism. Have a read through and let me know if you have any questions. Nicole will review this ahead of your discovery call.</p>
          </div>
          <div class="border border-surface-border rounded-lg p-3">
            <div class="flex justify-between items-baseline mb-1">
              <span class="text-xs font-medium text-text">Alex T</span>
              <span class="font-mono text-[10px] text-text-muted">12 Mar 16:22</span>
            </div>
            <p class="text-text-muted leading-relaxed text-sm">Interesting — I hadn't heard of Materia Forge before. So the AI would actually generate different mechanism designs and test them against physics before I see anything? How many concepts would I typically get?</p>
          </div>
          <div class="border border-accent/20 bg-accent-glow rounded-lg p-3">
            <div class="flex justify-between items-baseline mb-1">
              <span class="text-xs font-medium text-accent">Materia Lab AI</span>
              <span class="font-mono text-[10px] text-text-muted">12 Mar 16:23</span>
            </div>
            <p class="text-text-muted leading-relaxed text-sm">That's right — the AI explores the design space from your requirements and generates multiple candidates in parallel. Each one gets automatically checked against physical constraints (forces, reach, payload, material limits) before being presented. For a project like yours, you'd likely see 8–12 initial candidates across the spatula, gripper, and pan-tilt approaches, narrowed down to 3–4 validated finalists with trade-off analysis. Once you've picked a direction, Nicole builds out the proper parametric CAD models ready for prototyping.</p>
          </div>
          <div class="border border-surface-border rounded-lg p-3">
            <div class="flex justify-between items-baseline mb-1">
              <span class="text-xs font-medium text-text">Alex T</span>
              <span class="font-mono text-[10px] text-text-muted">12 Mar 17:05</span>
            </div>
            <p class="text-text-muted leading-relaxed text-sm">That's a much smarter way to do it than just picking the spatula approach and hoping for the best. The budget for the Forge phase looks reasonable too. I'll book a call.</p>
          </div>
          <div id="tour-nicole" class="border border-accent/20 bg-accent-glow rounded-lg p-3">
            <div class="flex justify-between items-baseline mb-1">
              <span class="text-xs font-medium text-accent">Nicole</span>
              <span class="font-mono text-[10px] text-text-muted">13 Mar 09:30</span>
            </div>
            <p class="text-text-muted leading-relaxed text-sm">Hey Alex — I've had a read through. The Forge approach is a good fit here because the mechanism choice will drive everything else downstream (arm selection, control strategy, even the vision requirements). I've worked on similar vision-guided pick-and-place systems before and the mechanism is always where projects like this succeed or fail. Let's use the Forge exploration to rule out the weak options early rather than discovering them during the build. Book a slot whenever suits.</p>
          </div>
          <p class="text-center text-xs text-text-muted pt-2">Each project includes AI-assisted discussion to refine your brief before the discovery call.</p>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div id="tour-cta" class="border border-accent/30 bg-accent-glow rounded-lg px-6 py-8 text-center">
        <h2 class="text-xl font-medium mb-2">Get your own assessment</h2>
        <p class="text-sm text-text-muted mb-6">Submit your project idea and receive an AI-generated initial analysis in minutes. Free, confidential, and covered by a mutual NDA.</p>
        <a href="/start" class="inline-block px-6 py-3 bg-accent text-surface font-medium rounded hover:bg-accent-dim transition-colors">
          Start your project
        </a>
      </div>
    </div>
  </div>
</section>

<style>
  :global(.materia-tour .driver-popover) {
    background-color: #0a0f0d;
    border: 1px solid rgba(68, 255, 170, 0.3);
    color: #e0e0e0;
  }
  :global(.materia-tour .driver-popover-title) {
    color: #44ffaa;
    font-size: 0.95rem;
  }
  :global(.materia-tour .driver-popover-description) {
    color: #a0a0a0;
    font-size: 0.85rem;
    line-height: 1.5;
  }
  :global(.materia-tour .driver-popover-progress-text) {
    color: #666;
  }
  :global(.materia-tour .driver-popover-prev-btn) {
    background-color: transparent;
    border: 1px solid rgba(68, 255, 170, 0.3);
    color: #44ffaa;
  }
  :global(.materia-tour .driver-popover-next-btn),
  :global(.materia-tour .driver-popover-close-btn) {
    background-color: #44ffaa;
    color: #0a0f0d;
    font-weight: 500;
  }
  :global(.materia-tour .driver-popover-arrow-side-bottom .driver-popover-arrow) {
    border-bottom-color: #0a0f0d;
  }
  :global(.materia-tour .driver-popover-arrow-side-top .driver-popover-arrow) {
    border-top-color: #0a0f0d;
  }
  :global(.materia-tour .driver-popover-arrow-side-left .driver-popover-arrow) {
    border-left-color: #0a0f0d;
  }
  :global(.materia-tour .driver-popover-arrow-side-right .driver-popover-arrow) {
    border-right-color: #0a0f0d;
  }
</style>
