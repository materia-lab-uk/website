<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>Blog — Materia Lab</title>
</svelte:head>

<section class="px-6 py-24">
  <div class="max-w-4xl mx-auto">
    <p class="font-mono text-xs tracking-[0.3em] text-accent mb-6 uppercase">Blog</p>
    <h1 class="text-3xl md:text-4xl font-light tracking-tight mb-4">Writing & thinking.</h1>
    <p class="text-text-muted mb-12">Engineering notes, technical deep dives, and lessons from the shop floor. Published on <a href="https://dev.to/dr_nicole" class="text-accent hover:text-accent-dim transition-colors">Dev.to</a>.</p>

    {#if data.articles.length === 0}
      <div class="border border-surface-border rounded-lg p-8 text-center">
        <p class="text-text-muted">No posts yet. Check back soon, or follow on <a href="https://dev.to/dr_nicole" class="text-accent hover:text-accent-dim transition-colors">Dev.to</a>.</p>
      </div>
    {:else}
      <div class="space-y-6">
        {#each data.articles as article}
          <a href={article.url} target="_blank" rel="noopener noreferrer"
            class="block border border-surface-border rounded-lg p-6 hover:border-accent/30 transition-colors group">
            <div class="flex justify-between items-baseline mb-2">
              <h2 class="text-xl font-medium group-hover:text-accent transition-colors">{article.title}</h2>
              <span class="font-mono text-xs text-text-muted shrink-0 ml-4">
                {new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <p class="text-text-muted leading-relaxed mb-3">{article.description}</p>
            <div class="flex items-center gap-3">
              {#each article.tags as tag}
                <span class="font-mono text-xs text-text-muted">#{tag}</span>
              {/each}
              {#if article.readingTime}
                <span class="font-mono text-xs text-text-muted">{article.readingTime} min read</span>
              {/if}
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</section>
