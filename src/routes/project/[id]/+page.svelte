<script lang="ts">
  let { data } = $props();
  const { submission } = data;
  const a = submission.assessment;
  const isPending = submission.status === 'queued' || submission.status === 'processing';
</script>

<svelte:head>
  <title>Project Assessment — Materia Lab</title>
  {#if isPending}
    <meta http-equiv="refresh" content="30" />
  {/if}
</svelte:head>

<section class="px-6 py-24">
  <div class="max-w-3xl mx-auto">
    <p class="font-mono text-xs tracking-[0.3em] text-accent mb-6 uppercase">Project Assessment</p>

    {#if isPending}
      <!-- Queued / Processing state -->
      <h1 class="text-3xl md:text-4xl font-light tracking-tight mb-6">Thanks, {submission.name}.</h1>
      <div class="border border-accent/20 bg-accent-glow rounded-lg p-6 mb-8">
        <div class="flex items-center gap-3 mb-3">
          <span class="inline-block w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          <p class="font-mono text-sm text-accent">
            {submission.status === 'processing' ? 'Generating your assessment...' : 'Your assessment is in the queue'}
          </p>
        </div>
        <p class="text-text-muted text-sm leading-relaxed">
          This page will update automatically when your assessment is ready. You can also bookmark this URL and come back later.
        </p>
      </div>
      <div class="border border-surface-border rounded-lg p-6">
        <h3 class="text-sm font-mono text-accent mb-3 uppercase tracking-wider">Your submission</h3>
        <p class="text-text-muted leading-relaxed">{submission.description}</p>
      </div>

    {:else if !a}
      <!-- Completed but no assessment (API error fallback) -->
      <h1 class="text-3xl md:text-4xl font-light tracking-tight mb-6">Thanks, {submission.name}.</h1>
      <p class="text-lg text-text-muted leading-relaxed mb-8">
        We've received your enquiry and will get back to you within 24 hours with a detailed assessment and next steps.
      </p>
      <div class="border border-surface-border rounded-lg p-6">
        <h3 class="text-sm font-mono text-accent mb-3 uppercase tracking-wider">Your submission</h3>
        <p class="text-text-muted leading-relaxed">{submission.description}</p>
      </div>

    {:else}
      <!-- Assessment ready -->
      <h1 class="text-3xl md:text-4xl font-light tracking-tight mb-2">
        {submission.company ? `${submission.company} —` : ''} Project Assessment
      </h1>
      <p class="text-sm text-text-muted mb-10">
        Prepared for {submission.name} &middot; {new Date(submission.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      <!-- Summary -->
      <div class="mb-10">
        <h2 class="text-lg font-medium mb-3">Summary</h2>
        <p class="text-text-muted leading-relaxed">{a.summary}</p>
      </div>

      <!-- Feasibility -->
      <div class="mb-10">
        <h2 class="text-lg font-medium mb-3">Feasibility</h2>
        <p class="text-text-muted leading-relaxed">{a.feasibility}</p>
      </div>

      <!-- Recommended approach -->
      <div class="mb-10">
        <h2 class="text-lg font-medium mb-3">Recommended Approach</h2>
        <ul class="space-y-2">
          {#each a.approach as step}
            <li class="flex gap-3 text-text-muted">
              <span class="text-accent mt-1 shrink-0">&#x2022;</span>
              <span class="leading-relaxed">{step}</span>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Service & estimates -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div class="border border-surface-border rounded-lg p-5">
          <p class="font-mono text-xs text-accent mb-2 uppercase tracking-wider">Recommended</p>
          <p class="text-text font-medium">{a.recommended_service}</p>
        </div>
        <div class="border border-surface-border rounded-lg p-5">
          <p class="font-mono text-xs text-accent mb-2 uppercase tracking-wider">Timeline</p>
          <p class="text-text font-medium">{a.estimated_timeline}</p>
        </div>
        <div class="border border-surface-border rounded-lg p-5">
          <p class="font-mono text-xs text-accent mb-2 uppercase tracking-wider">Budget range</p>
          <p class="text-text font-medium">{a.estimated_budget_range}</p>
        </div>
      </div>

      <!-- Key risks -->
      <div class="mb-10">
        <h2 class="text-lg font-medium mb-3">Key Risks & Unknowns</h2>
        <ul class="space-y-2">
          {#each a.key_risks as risk}
            <li class="flex gap-3 text-text-muted">
              <span class="text-accent mt-1 shrink-0">&#x26A0;</span>
              <span class="leading-relaxed">{risk}</span>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Next steps -->
      <div class="mb-10">
        <h2 class="text-lg font-medium mb-3">Next Steps</h2>
        <ol class="space-y-2">
          {#each a.next_steps as step, i}
            <li class="flex gap-3 text-text-muted">
              <span class="text-accent font-mono text-sm mt-0.5 shrink-0">{i + 1}.</span>
              <span class="leading-relaxed">{step}</span>
            </li>
          {/each}
        </ol>
      </div>

      <!-- CTA -->
      <div class="border border-surface-border rounded-lg p-8 text-center">
        <p class="text-lg font-light mb-4">Ready to move forward?</p>
        <a href="mailto:nic@materia-lab.uk?subject=Re: Project Assessment" class="px-6 py-3 bg-accent text-surface font-medium rounded hover:bg-accent-dim transition-colors inline-block">
          Get in touch
        </a>
      </div>
    {/if}
  </div>
</section>
