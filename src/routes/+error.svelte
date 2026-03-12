<script lang="ts">
  import { page } from '$app/state';
</script>

<svelte:head>
  <title>{page.status} — Materia Lab</title>
</svelte:head>

<section class="min-h-[70vh] flex items-center px-6">
  <div class="max-w-2xl mx-auto text-center">
    <p class="font-mono text-6xl text-accent mb-6">{page.status}</p>
    <h1 class="text-3xl md:text-4xl font-light tracking-tight mb-4">
      {#if page.status === 404}
        Page not found
      {:else}
        Something went wrong
      {/if}
    </h1>
    <p class="text-text-muted text-lg mb-10">
      {#if page.status === 404}
        The page you're looking for doesn't exist or has been moved.
      {:else}
        {page.error?.message || 'An unexpected error occurred.'}
      {/if}
    </p>
    <a href="/" class="px-6 py-3 bg-accent text-surface font-medium rounded hover:bg-accent-dim transition-colors">
      Back to home
    </a>
  </div>
</section>
