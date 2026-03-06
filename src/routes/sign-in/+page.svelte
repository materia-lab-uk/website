<script lang="ts">
  import SignIn from 'clerk-sveltekit/client/SignIn.svelte';
</script>

<svelte:head>
  <title>Sign In — Materia Lab</title>
</svelte:head>

<section class="min-h-[85vh] flex items-center justify-center px-6 py-24">
  <div>
    <SignIn redirectUrl="/" />
  </div>
</section>
