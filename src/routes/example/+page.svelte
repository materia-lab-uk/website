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
            description: 'Our AI reads your project description and generates a clear title and assessment — usually within a few minutes of submitting.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-summary',
          popover: {
            title: 'Project Summary',
            description: 'A concise overview of what you\'re trying to build and the key challenges involved. This shows we\'ve understood your brief.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-feasibility',
          popover: {
            title: 'Feasibility Analysis',
            description: 'An honest assessment of whether your idea is achievable within your stated budget and timeline — no sugar-coating.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-approach',
          popover: {
            title: 'Recommended Approach',
            description: 'A step-by-step breakdown of how we\'d tackle the project. This gives you a clear picture of the engineering work involved.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-metrics',
          popover: {
            title: 'Service, Timeline & Budget',
            description: 'We recommend the right engagement type, give you a realistic timeline, and a budget range — so there are no surprises.',
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
            description: 'Clear actions to move forward — including booking a free discovery call with Nicole to discuss the assessment in detail.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-chat',
          popover: {
            title: 'AI Discussion',
            description: 'You can chat with our AI to ask follow-up questions about the assessment. Nicole reads the conversation before your discovery call, so it saves time.',
            side: 'top',
            align: 'start',
          },
        },
        {
          element: '#tour-nicole',
          popover: {
            title: 'Nicole Joins the Conversation',
            description: 'After reviewing the assessment and chat, Nicole can jump into the discussion directly — adding technical insight and next steps.',
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
  <title>Example Project Assessment — Materia Lab</title>
  <meta name="description" content="See what a Materia Lab project assessment looks like. AI-powered technical feasibility analysis for your product idea." />
</svelte:head>

<section class="px-6 py-24">
  <div class="max-w-7xl mx-auto">
    <!-- Example banner -->
    <div id="tour-banner" class="border border-accent/30 bg-accent-glow rounded-lg px-6 py-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p class="text-sm font-medium text-accent">Example Assessment</p>
        <p class="text-xs text-text-muted mt-1">This is a sample project assessment to show what you'll receive when you submit a project.</p>
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

    <p class="font-mono text-xs tracking-[0.3em] text-accent mb-6 uppercase">Project Assessment</p>

    <div class="flex-1 min-w-0">
      <div id="tour-title">
        <h1 class="text-3xl md:text-4xl font-light tracking-tight mb-2">Autonomous Pancake-Flipping Robot</h1>
        <p class="text-sm text-text-muted mb-10">
          Prepared for Alex T by Materia Lab AI &middot; 12 March 2026
        </p>
      </div>

      <div id="tour-summary" class="mb-10">
        <h2 class="text-lg font-medium mb-3">Summary</h2>
        <p class="text-text-muted leading-relaxed">You're looking to build a robot capable of autonomously detecting and flipping pancakes on a griddle or pan. This is an interesting challenge that combines computer vision, mechanical actuation, and real-time control—but the timeline and budget you've outlined will need careful scoping to be realistic.</p>
      </div>

      <div id="tour-feasibility" class="mb-10">
        <h2 class="text-lg font-medium mb-3">Feasibility</h2>
        <p class="text-text-muted leading-relaxed">The core concept is technically feasible, but not within your stated 1–2 week timeline and under-£5k budget as a complete working system. Pancake detection via computer vision is straightforward; the mechanical challenge is designing a gripper or flipper that can handle the fragile, variable geometry of a partially-cooked pancake without tearing it. You'd need to prioritize: are we targeting a proof-of-concept demo, or a kitchen-ready appliance?</p>
      </div>

      <div id="tour-approach" class="mb-10">
        <h2 class="text-lg font-medium mb-3">Recommended Approach</h2>
        <ul class="space-y-2">
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent mt-1 shrink-0">&#x2022;</span>
            <span class="leading-relaxed">Define the mechanical constraint: will the robot use a spatula-style flipper, a gripper arm, or a pan-rotation mechanism? Each has different complexity.</span>
          </li>
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent mt-1 shrink-0">&#x2022;</span>
            <span class="leading-relaxed">Implement computer vision (OpenCV or similar) to detect pancakes on the cooking surface and estimate their doneness.</span>
          </li>
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent mt-1 shrink-0">&#x2022;</span>
            <span class="leading-relaxed">Design and 3D-print or machine a prototype flipper mechanism with sufficient stiffness and control.</span>
          </li>
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent mt-1 shrink-0">&#x2022;</span>
            <span class="leading-relaxed">Integrate a robotic arm (e.g., robot arm kit) or custom actuator with real-time feedback control.</span>
          </li>
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent mt-1 shrink-0">&#x2022;</span>
            <span class="leading-relaxed">Develop the control software to coordinate vision, timing, and mechanical motion.</span>
          </li>
        </ul>
      </div>

      <div id="tour-metrics" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div class="border border-surface-border rounded-lg p-5">
          <p class="font-mono text-xs text-accent mb-2 uppercase tracking-wider">Recommended</p>
          <p class="text-text font-medium">Feasibility Sprint</p>
        </div>
        <div class="border border-surface-border rounded-lg p-5">
          <p class="font-mono text-xs text-accent mb-2 uppercase tracking-wider">Timeline</p>
          <p class="text-text font-medium">4–6 weeks for a working prototype (vision + basic mechanical flip); 10–14 weeks for a refined, repeatable system.</p>
        </div>
        <div class="border border-surface-border rounded-lg p-5">
          <p class="font-mono text-xs text-accent mb-2 uppercase tracking-wider">Budget range</p>
          <p class="text-text font-medium">£8k–£18k for a functional prototype, depending on whether you use an off-the-shelf robotic arm or build custom actuators.</p>
        </div>
      </div>

      <div id="tour-risks" class="mb-10">
        <h2 class="text-lg font-medium mb-3">Key Risks & Unknowns</h2>
        <ul class="space-y-2">
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent mt-1 shrink-0">&#x26A0;</span>
            <span class="leading-relaxed">Pancake geometry and consistency vary widely; training vision models and tuning the flipper for repeatable success is harder than it sounds.</span>
          </li>
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent mt-1 shrink-0">&#x26A0;</span>
            <span class="leading-relaxed">Mechanical design to avoid tearing the pancake while achieving a clean flip requires iterative prototyping—difficult to do in 1–2 weeks.</span>
          </li>
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent mt-1 shrink-0">&#x26A0;</span>
            <span class="leading-relaxed">Real-time synchronization between vision, gripper position, and flip timing is a control systems challenge that often needs live tuning.</span>
          </li>
        </ul>
      </div>

      <div id="tour-next-steps" class="mb-10">
        <h2 class="text-lg font-medium mb-3">Next Steps</h2>
        <ol class="space-y-2">
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent font-mono text-sm mt-0.5 shrink-0">1.</span>
            <span class="leading-relaxed">Book a discovery call with Nicole to discuss your core goal: are you building a novelty demo, a research prototype, or a product? This will unlock a realistic scope and timeline.</span>
          </li>
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent font-mono text-sm mt-0.5 shrink-0">2.</span>
            <span class="leading-relaxed">Provide more detail on your mechanical constraints: what's your cooking surface (griddle, pan, skillet)? What size pancakes? Can the robot approach from above, or must it fit around existing kitchen equipment?</span>
          </li>
          <li class="flex gap-3 text-text-muted">
            <span class="text-accent font-mono text-sm mt-0.5 shrink-0">3.</span>
            <span class="leading-relaxed">We'll prepare a detailed Feasibility Sprint proposal (1–2 weeks, £2–3k) to validate the vision + mechanical approach and de-risk the biggest unknowns before committing to full development.</span>
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
            <p class="text-text-muted leading-relaxed text-sm">Hi Alex! Your assessment is ready — we've recommended Feasibility Sprint. Have a read through and let me know if you have any questions, or if there's anything you'd like to explore further.</p>
          </div>
          <div class="border border-surface-border rounded-lg p-3">
            <div class="flex justify-between items-baseline mb-1">
              <span class="text-xs font-medium text-text">Alex T</span>
              <span class="font-mono text-[10px] text-text-muted">12 Mar 16:22</span>
            </div>
            <p class="text-text-muted leading-relaxed text-sm">This is really helpful. I'm leaning towards a proof-of-concept demo first. Could the vision system use a standard webcam, or would I need something more specialised?</p>
          </div>
          <div class="border border-accent/20 bg-accent-glow rounded-lg p-3">
            <div class="flex justify-between items-baseline mb-1">
              <span class="text-xs font-medium text-accent">Materia Lab AI</span>
              <span class="font-mono text-[10px] text-text-muted">12 Mar 16:22</span>
            </div>
            <p class="text-text-muted leading-relaxed text-sm">A standard USB webcam would work fine for a proof-of-concept — you mainly need a top-down or angled view of the cooking surface. A 1080p webcam with decent colour reproduction is enough to detect pancake edges and estimate browning. For a production system you'd eventually want something more robust (e.g., an industrial camera with better heat tolerance and fixed focus), but for the feasibility sprint a £30–50 webcam will do the job.</p>
          </div>
          <div class="border border-surface-border rounded-lg p-3">
            <div class="flex justify-between items-baseline mb-1">
              <span class="text-xs font-medium text-text">Alex T</span>
              <span class="font-mono text-[10px] text-text-muted">12 Mar 17:05</span>
            </div>
            <p class="text-text-muted leading-relaxed text-sm">Perfect. And what about the flipper itself — is there an off-the-shelf robot arm that could handle this, or would it need to be custom?</p>
          </div>
          <div class="border border-accent/20 bg-accent-glow rounded-lg p-3">
            <div class="flex justify-between items-baseline mb-1">
              <span class="text-xs font-medium text-accent">Materia Lab AI</span>
              <span class="font-mono text-[10px] text-text-muted">12 Mar 17:05</span>
            </div>
            <p class="text-text-muted leading-relaxed text-sm">For a proof-of-concept, something like a uArm or Dobot Magician with a custom spatula end-effector would work — they're affordable, have decent repeatability, and there are good Python libraries for control. The main custom work would be designing and 3D-printing the spatula attachment and tuning the flip motion profile. For a production system you'd likely want a custom mechanism, but for the sprint an off-the-shelf arm keeps costs down and lets us focus on the hard parts: vision and timing.</p>
          </div>
          <div id="tour-nicole" class="border border-accent/20 bg-accent-glow rounded-lg p-3">
            <div class="flex justify-between items-baseline mb-1">
              <span class="text-xs font-medium text-accent">Nicole</span>
              <span class="font-mono text-[10px] text-text-muted">13 Mar 09:30</span>
            </div>
            <p class="text-text-muted leading-relaxed text-sm">Hey Alex — I've had a read through. Good instinct going proof-of-concept first. One thing I'd flag: the Dobot's payload is only about 500g, which is fine for a single pancake but might limit you if you want to scale up later. We can discuss the trade-offs on the call. I've also worked on a similar vision-guided pick-and-place system before so I've got some ideas on the flip timing. Book a slot whenever suits.</p>
          </div>
          <p class="text-center text-xs text-text-muted pt-2">Each project includes AI-assisted discussion to refine your brief before the discovery call.</p>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div id="tour-cta" class="border border-accent/30 bg-accent-glow rounded-lg px-6 py-8 text-center">
        <h2 class="text-xl font-medium mb-2">Get your own assessment</h2>
        <p class="text-sm text-text-muted mb-6">Submit your project idea and receive an AI-generated technical assessment in minutes. Free, confidential, and covered by a mutual NDA.</p>
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
