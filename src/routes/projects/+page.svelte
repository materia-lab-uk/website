<script lang="ts">
  let { data } = $props();
  const { projects } = data;

  const statusLabel: Record<string, string> = {
    queued: 'In Queue',
    processing: 'Generating...',
    ready: 'Assessment Ready',
  };

  const statusColor: Record<string, string> = {
    queued: 'text-text-muted',
    processing: 'text-accent animate-pulse',
    ready: 'text-accent',
  };
</script>

<svelte:head>
  <title>My Projects — Materia Lab</title>
</svelte:head>

<section class="px-6 py-24">
  <div class="max-w-4xl mx-auto">
    <p class="font-mono text-xs tracking-[0.3em] text-accent mb-6 uppercase">My Projects</p>

    {#if projects.length === 0}
      <div class="text-center py-16">
        <h1 class="text-2xl font-light mb-4">No projects yet</h1>
        <p class="text-text-muted mb-8">Submit your first project to get a tailored assessment in minutes.</p>
        <a href="/start" class="px-6 py-3 bg-accent text-surface font-medium rounded hover:bg-accent-dim transition-colors">
          Start a project
        </a>
      </div>
    {:else}
      <div class="space-y-4">
        {#each projects as project}
          <a href="/project/{project.id}" class="block border border-surface-border rounded-lg p-6 hover:border-accent/30 transition-colors">
            <div class="flex justify-between items-start mb-2">
              <h2 class="text-lg font-medium">{project.title}</h2>
              <span class="font-mono text-xs {statusColor[project.status] || 'text-text-muted'}">
                {statusLabel[project.status] || project.status}
              </span>
            </div>
            <p class="text-text-muted text-sm leading-relaxed mb-3">{project.description}</p>
            <p class="font-mono text-xs text-text-muted">
              {new Date(project.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</section>
