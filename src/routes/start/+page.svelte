<script lang="ts">
  let step = $state(1);
  let submitting = $state(false);
  let submitted = $state(false);

  let form = $state({
    name: '',
    email: '',
    company: '',
    budget: '',
    timeline: '',
    description: '',
    stage: '',
    referral: '',
  });

  const budgets = [
    'Under £5k',
    '£5k – £15k',
    '£15k – £50k',
    '£50k – £100k+',
    'Not sure yet',
  ];

  const timelines = [
    '1–2 weeks',
    '1–2 months',
    '3–6 months',
    '6+ months',
    'Flexible',
  ];

  const stages = [
    'Just an idea',
    'Some research done',
    'Have a prototype',
    'Need to redesign / improve existing product',
    'Other',
  ];

  function nextStep() {
    step = Math.min(step + 1, 3);
  }

  function prevStep() {
    step = Math.max(step - 1, 1);
  }

  async function handleSubmit() {
    submitting = true;
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        submitted = true;
      }
    } catch (e) {
      // fallback: mailto
      const subject = encodeURIComponent(`Project enquiry from ${form.name}`);
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\nBudget: ${form.budget}\nTimeline: ${form.timeline}\nStage: ${form.stage}\n\n${form.description}`
      );
      window.location.href = `mailto:nic@materia-lab.uk?subject=${subject}&body=${body}`;
      submitted = true;
    } finally {
      submitting = false;
    }
  }
</script>

<svelte:head>
  <title>Start a Project — Materia Lab</title>
</svelte:head>

<section class="min-h-[85vh] flex items-center px-6 py-24">
  <div class="max-w-2xl mx-auto w-full">

    {#if submitted}
      <div class="text-center">
        <p class="font-mono text-xs tracking-[0.3em] text-accent mb-6 uppercase">Received</p>
        <h1 class="text-4xl md:text-5xl font-light tracking-tight mb-6">We'll be in touch.</h1>
        <p class="text-lg text-text-muted leading-relaxed mb-8">
          Thanks, {form.name}. You'll hear back within 24 hours with an initial assessment and next steps.
        </p>
        <a href="/" class="text-accent hover:text-accent-dim transition-colors">&larr; Back to home</a>
      </div>

    {:else}
      <p class="font-mono text-xs tracking-[0.3em] text-accent mb-6 uppercase">Start a project</p>
      <h1 class="text-3xl md:text-4xl font-light tracking-tight mb-2">Tell us about your project.</h1>
      <p class="text-text-muted mb-10">Quick questionnaire — takes about 2 minutes.</p>

      <!-- Progress -->
      <div class="flex gap-2 mb-10">
        {#each [1, 2, 3] as s}
          <div class="h-1 flex-1 rounded-full transition-colors {s <= step ? 'bg-accent' : 'bg-surface-border'}"></div>
        {/each}
      </div>

      <form onsubmit={(e: Event) => { e.preventDefault(); handleSubmit(); }}>

        {#if step === 1}
          <!-- Step 1: About you -->
          <div class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium mb-2">Your name</label>
              <input
                id="name"
                type="text"
                bind:value={form.name}
                required
                class="w-full bg-surface-alt border border-surface-border rounded-lg px-4 py-3 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors"
                placeholder="Dr Jane Smith"
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium mb-2">Email</label>
              <input
                id="email"
                type="email"
                bind:value={form.email}
                required
                class="w-full bg-surface-alt border border-surface-border rounded-lg px-4 py-3 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors"
                placeholder="jane@company.com"
              />
            </div>
            <div>
              <label for="company" class="block text-sm font-medium mb-2">Company <span class="text-text-muted font-normal">(optional)</span></label>
              <input
                id="company"
                type="text"
                bind:value={form.company}
                class="w-full bg-surface-alt border border-surface-border rounded-lg px-4 py-3 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors"
                placeholder="Acme Robotics"
              />
            </div>
          </div>

        {:else if step === 2}
          <!-- Step 2: Project details -->
          <div class="space-y-6">
            <div>
              <label for="description" class="block text-sm font-medium mb-2">Describe your project</label>
              <textarea
                id="description"
                bind:value={form.description}
                required
                rows="5"
                class="w-full bg-surface-alt border border-surface-border rounded-lg px-4 py-3 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors resize-none"
                placeholder="What are you trying to build? What problem does it solve? Any technical constraints?"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium mb-3">What stage are you at?</label>
              <div class="grid grid-cols-1 gap-2">
                {#each stages as s}
                  <label class="flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer transition-colors
                    {form.stage === s ? 'border-accent bg-accent-glow text-text' : 'border-surface-border text-text-muted hover:border-accent/30'}">
                    <input type="radio" bind:group={form.stage} value={s} class="hidden" />
                    <span class="w-4 h-4 rounded-full border-2 flex items-center justify-center
                      {form.stage === s ? 'border-accent' : 'border-surface-border'}">
                      {#if form.stage === s}
                        <span class="w-2 h-2 rounded-full bg-accent"></span>
                      {/if}
                    </span>
                    {s}
                  </label>
                {/each}
              </div>
            </div>
          </div>

        {:else if step === 3}
          <!-- Step 3: Budget & timeline -->
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium mb-3">Rough budget</label>
              <div class="grid grid-cols-1 gap-2">
                {#each budgets as b}
                  <label class="flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer transition-colors
                    {form.budget === b ? 'border-accent bg-accent-glow text-text' : 'border-surface-border text-text-muted hover:border-accent/30'}">
                    <input type="radio" bind:group={form.budget} value={b} class="hidden" />
                    <span class="w-4 h-4 rounded-full border-2 flex items-center justify-center
                      {form.budget === b ? 'border-accent' : 'border-surface-border'}">
                      {#if form.budget === b}
                        <span class="w-2 h-2 rounded-full bg-accent"></span>
                      {/if}
                    </span>
                    {b}
                  </label>
                {/each}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-3">Ideal timeline</label>
              <div class="grid grid-cols-1 gap-2">
                {#each timelines as t}
                  <label class="flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer transition-colors
                    {form.timeline === t ? 'border-accent bg-accent-glow text-text' : 'border-surface-border text-text-muted hover:border-accent/30'}">
                    <input type="radio" bind:group={form.timeline} value={t} class="hidden" />
                    <span class="w-4 h-4 rounded-full border-2 flex items-center justify-center
                      {form.timeline === t ? 'border-accent' : 'border-surface-border'}">
                      {#if form.timeline === t}
                        <span class="w-2 h-2 rounded-full bg-accent"></span>
                      {/if}
                    </span>
                    {t}
                  </label>
                {/each}
              </div>
            </div>
            <div>
              <label for="referral" class="block text-sm font-medium mb-2">How did you find us? <span class="text-text-muted font-normal">(optional)</span></label>
              <input
                id="referral"
                type="text"
                bind:value={form.referral}
                class="w-full bg-surface-alt border border-surface-border rounded-lg px-4 py-3 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors"
                placeholder="Google, referral, LinkedIn..."
              />
            </div>
          </div>
        {/if}

        <!-- Navigation buttons -->
        <div class="flex justify-between mt-10">
          {#if step > 1}
            <button type="button" onclick={prevStep}
              class="px-6 py-3 border border-surface-border text-text-muted rounded hover:border-accent hover:text-accent transition-colors">
              Back
            </button>
          {:else}
            <div></div>
          {/if}

          {#if step < 3}
            <button type="button" onclick={nextStep}
              class="px-6 py-3 bg-accent text-surface font-medium rounded hover:bg-accent-dim transition-colors">
              Next
            </button>
          {:else}
            <button type="submit" disabled={submitting}
              class="px-8 py-3 bg-accent text-surface font-medium rounded hover:bg-accent-dim transition-colors disabled:opacity-50">
              {submitting ? 'Sending...' : 'Submit'}
            </button>
          {/if}
        </div>
      </form>
    {/if}
  </div>
</section>
