<script lang="ts">
  let { data } = $props();
  const { submissions, queueLength } = data;
</script>

<svelte:head>
  <title>Admin — Materia Lab</title>
</svelte:head>

<section class="px-6 py-24">
  <div class="max-w-6xl mx-auto">
    <div class="flex justify-between items-baseline mb-10">
      <div>
        <p class="font-mono text-xs tracking-[0.3em] text-accent mb-4 uppercase">Admin Dashboard</p>
        <h1 class="text-3xl font-light tracking-tight">Project Enquiries</h1>
      </div>
      <div class="flex gap-4">
        <div class="border border-surface-border rounded-lg px-4 py-3 text-center">
          <p class="font-mono text-2xl text-accent">{submissions.length}</p>
          <p class="text-xs text-text-muted">Total</p>
        </div>
        <div class="border border-surface-border rounded-lg px-4 py-3 text-center">
          <p class="font-mono text-2xl text-accent">{queueLength}</p>
          <p class="text-xs text-text-muted">Queued</p>
        </div>
      </div>
    </div>

    {#if submissions.length === 0}
      <div class="border border-surface-border rounded-lg p-8 text-center">
        <p class="text-text-muted">No enquiries yet.</p>
      </div>
    {:else}
      <div class="space-y-4">
        {#each submissions as sub}
          <a href="/project/{sub.id}" class="block border border-surface-border rounded-lg p-6 hover:border-accent/30 transition-colors group">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="text-lg font-medium group-hover:text-accent transition-colors">
                  {sub.title || 'Untitled Project'}
                </h3>
                <p class="text-sm text-text-muted">
                  {sub.name}{#if sub.company} — {sub.company}{/if} &middot; {sub.email}
                </p>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-mono text-xs px-2 py-1 rounded {
                  sub.status === 'ready' ? 'bg-accent/10 text-accent' :
                  sub.status === 'processing' ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-surface-border text-text-muted'
                }">
                  {sub.status}
                </span>
                {#if sub.messages?.length > 0}
                  <span class="font-mono text-xs text-text-muted">{sub.messages.length} msg{sub.messages.length !== 1 ? 's' : ''}</span>
                {/if}
                <span class="font-mono text-xs text-text-muted">
                  {new Date(sub.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
            <p class="text-text-muted text-sm leading-relaxed line-clamp-2">{sub.description}</p>
            <div class="flex gap-4 mt-3 text-xs text-text-muted font-mono">
              {#if sub.budget}<span>{sub.budget}</span>{/if}
              {#if sub.timeline}<span>{sub.timeline}</span>{/if}
              {#if sub.stage}<span>{sub.stage}</span>{/if}
              {#if sub.files?.length > 0}<span>{sub.files.length} file{sub.files.length !== 1 ? 's' : ''}</span>{/if}
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</section>
