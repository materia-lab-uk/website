<script lang="ts">
  import SignUp from 'clerk-sveltekit/client/SignUp.svelte';
</script>

<svelte:head>
  <title>Sign Up — Materia Lab</title>
</svelte:head>

<section class="min-h-[85vh] flex items-center justify-center px-6 py-24">
  <div>
    <SignUp redirectUrl="/start" />
  </div>
</section>
