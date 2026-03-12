<script lang="ts">
  let step = $state(1);
  let submitting = $state(false);
  let submitted = $state(false);
  let files = $state<FileList | null>(null);
  let ndaAgreed = $state(false);
  let errorMsg = $state('');

  let form = $state({
    name: '',
    email: '',
    company: '',
    budget: '',
    timeline: '',
    description: '',
    stage: '',
    referral: '',
    githubRepo: '',
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

  const totalSteps = 4;

  function nextStep() {
    step = Math.min(step + 1, totalSteps);
  }

  function prevStep() {
    step = Math.max(step - 1, 1);
  }

  async function handleSubmit() {
    if (!ndaAgreed) {
      errorMsg = 'You must agree to the mutual NDA to proceed.';
      return;
    }
    errorMsg = '';
    submitting = true;
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      formData.append('ndaAgreed', String(ndaAgreed));

      if (files) {
        for (const file of files) {
          formData.append('files', file);
        }
      }

      const res = await fetch('/api/intake', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        if (result.id) {
          window.location.href = `/project/${result.id}`;
          return;
        }
        submitted = true;
      } else {
        const err = await res.json();
        errorMsg = err.error || 'Something went wrong. Please try again.';
      }
    } catch (e) {
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
        {#each Array(totalSteps) as _, i}
          <div class="h-1 flex-1 rounded-full transition-colors {i + 1 <= step ? 'bg-accent' : 'bg-surface-border'}"></div>
        {/each}
      </div>

      {#if errorMsg}
        <div class="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3 mb-6 text-red-300 text-sm">
          {errorMsg}
        </div>
      {/if}

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
            <!-- File uploads -->
            <div>
              <label for="files" class="block text-sm font-medium mb-2">
                Supporting materials <span class="text-text-muted font-normal">(optional)</span>
              </label>
              <p class="text-xs text-text-muted mb-3">Drawings, specs, images, datasheets — anything that helps us understand your project. Max 10MB per file.</p>
              <input
                id="files"
                type="file"
                multiple
                bind:files={files}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.svg,.step,.stp,.stl,.dxf,.dwg,.zip"
                class="w-full bg-surface-alt border border-surface-border rounded-lg px-4 py-3 text-text file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-accent/10 file:text-accent file:text-sm file:font-medium file:cursor-pointer focus:outline-none focus:border-accent transition-colors"
              />
              {#if files && files.length > 0}
                <div class="mt-3 space-y-1">
                  {#each Array.from(files) as file}
                    <p class="text-xs text-text-muted font-mono">{file.name} ({Math.round(file.size / 1024)}KB)</p>
                  {/each}
                </div>
              {/if}
            </div>
            <div>
              <label for="githubRepo" class="block text-sm font-medium mb-2">
                GitHub repository <span class="text-text-muted font-normal">(optional)</span>
              </label>
              <input
                id="githubRepo"
                type="url"
                bind:value={form.githubRepo}
                class="w-full bg-surface-alt border border-surface-border rounded-lg px-4 py-3 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors"
                placeholder="https://github.com/org/repo"
              />
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

        {:else if step === 4}
          <!-- Step 4: NDA & submit -->
          <div class="space-y-6">
            <div class="border border-surface-border rounded-lg p-6">
              <h3 class="text-lg font-medium mb-4">Mutual Non-Disclosure Agreement</h3>
              <div class="text-sm text-text-muted leading-relaxed space-y-3 max-h-64 overflow-y-auto pr-2">
                <p>By submitting this project enquiry, both parties agree to the following terms:</p>
                <p><strong class="text-text">1. Confidential Information.</strong> All information shared through this platform — including project descriptions, technical specifications, drawings, business plans, and any uploaded materials — shall be treated as confidential by both parties.</p>
                <p><strong class="text-text">2. Obligations.</strong> Materia Lab (MartinWrightConsulting Ltd) agrees not to disclose, share, or use your confidential information for any purpose other than evaluating and responding to your project enquiry, unless explicitly authorised by you in writing.</p>
                <p><strong class="text-text">3. Reciprocal.</strong> You agree not to disclose any assessments, recommendations, or proprietary methodologies shared by Materia Lab through this platform without prior written consent.</p>
                <p><strong class="text-text">4. Exclusions.</strong> This agreement does not apply to information that: (a) is or becomes publicly available through no fault of the receiving party; (b) was known to the receiving party prior to disclosure; (c) is independently developed without use of confidential information; or (d) is required to be disclosed by law.</p>
                <p><strong class="text-text">5. Duration.</strong> These obligations shall remain in effect for 2 years from the date of submission.</p>
                <p><strong class="text-text">6. Governing Law.</strong> This agreement is governed by the laws of England and Wales.</p>
              </div>
            </div>
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                bind:checked={ndaAgreed}
                class="mt-1 w-4 h-4 rounded border-surface-border bg-surface-alt accent-accent"
              />
              <span class="text-sm text-text-muted leading-relaxed">
                I have read and agree to the mutual non-disclosure agreement. I understand that all information shared is treated as confidential by both parties.
              </span>
            </label>
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

          {#if step < totalSteps}
            <button type="button" onclick={nextStep}
              class="px-6 py-3 bg-accent text-surface font-medium rounded hover:bg-accent-dim transition-colors">
              Next
            </button>
          {:else}
            <button type="submit" disabled={submitting || !ndaAgreed}
              class="px-8 py-3 bg-accent text-surface font-medium rounded hover:bg-accent-dim transition-colors disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit project'}
            </button>
          {/if}
        </div>
      </form>
    {/if}
  </div>
</section>
