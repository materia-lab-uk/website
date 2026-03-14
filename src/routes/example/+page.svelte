<svelte:head>
  <title>Example Project Assessment — Materia Lab</title>
  <meta name="description" content="See what a Materia Lab project assessment looks like. AI-powered technical feasibility analysis for your product idea." />
</svelte:head>

<section class="px-6 py-24">
  <div class="max-w-7xl mx-auto">
    <!-- Example banner -->
    <div class="border border-accent/30 bg-accent-glow rounded-lg px-6 py-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p class="text-sm font-medium text-accent">Example Assessment</p>
        <p class="text-xs text-text-muted mt-1">This is a sample project assessment to show what you'll receive when you submit a project.</p>
      </div>
      <a href="/start" class="shrink-0 px-5 py-2 bg-accent text-surface text-sm font-medium rounded hover:bg-accent-dim transition-colors text-center">
        Start your project
      </a>
    </div>

    <p class="font-mono text-xs tracking-[0.3em] text-accent mb-6 uppercase">Project Assessment</p>

    <div class="flex-1 min-w-0">
      <h1 class="text-3xl md:text-4xl font-light tracking-tight mb-2">Autonomous Pancake-Flipping Robot</h1>
      <p class="text-sm text-text-muted mb-10">
        Prepared for Alex T by Materia Lab AI &middot; 12 March 2026
      </p>

      <div class="mb-10">
        <h2 class="text-lg font-medium mb-3">Summary</h2>
        <p class="text-text-muted leading-relaxed">You're looking to build a robot capable of autonomously detecting and flipping pancakes on a griddle or pan. This is an interesting challenge that combines computer vision, mechanical actuation, and real-time control—but the timeline and budget you've outlined will need careful scoping to be realistic.</p>
      </div>

      <div class="mb-10">
        <h2 class="text-lg font-medium mb-3">Feasibility</h2>
        <p class="text-text-muted leading-relaxed">The core concept is technically feasible, but not within your stated 1–2 week timeline and under-£5k budget as a complete working system. Pancake detection via computer vision is straightforward; the mechanical challenge is designing a gripper or flipper that can handle the fragile, variable geometry of a partially-cooked pancake without tearing it. You'd need to prioritize: are we targeting a proof-of-concept demo, or a kitchen-ready appliance?</p>
      </div>

      <div class="mb-10">
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

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
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

      <div class="mb-10">
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

      <div class="mb-10">
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
        <a href="/start"
          class="inline-block mt-6 px-6 py-3 bg-accent text-surface font-medium rounded hover:bg-accent-dim transition-colors">
          Start your own project
        </a>
      </div>

      <!-- Example chat preview (read-only) -->
      <div class="mb-10">
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
          <p class="text-center text-xs text-text-muted pt-2">Each project includes AI-assisted discussion to refine your brief before the discovery call.</p>
        </div>
      </div>
    </div>
  </div>
</section>
