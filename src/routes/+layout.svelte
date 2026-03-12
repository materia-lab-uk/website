<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Logo from '$lib/components/Logo.svelte';
	import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte';
	import SignedOut from 'clerk-sveltekit/client/SignedOut.svelte';
	import UserButton from 'clerk-sveltekit/client/UserButton.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Materia Lab — Engineering & Technology Consultancy</title>
	<meta name="description" content="Product development and engineering consultancy. Robotics, embedded systems, mechanical design, and software — from first principles to first product." />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Materia Lab" />
	<meta property="og:title" content="Materia Lab — Engineering & Technology Consultancy" />
	<meta property="og:description" content="Product development and engineering consultancy. Robotics, embedded systems, mechanical design, and software — from first principles to first product." />
	<meta property="og:image" content="https://materia-lab.uk/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:url" content="https://materia-lab.uk" />

	<!-- Twitter/X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Materia Lab — Engineering & Technology Consultancy" />
	<meta name="twitter:description" content="Product development and engineering consultancy. Robotics, embedded systems, mechanical design, and software — from first principles to first product." />
	<meta name="twitter:image" content="https://materia-lab.uk/og-image.png" />
</svelte:head>

<!-- Nav -->
<nav class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-surface-border">
	<div class="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
		<a href="/">
			<Logo height={48} />
		</a>
		<div class="flex items-center gap-6">
			<a href="/#services" class="text-sm text-text-muted hover:text-accent transition-colors">Services</a>
			<a href="/#about" class="text-sm text-text-muted hover:text-accent transition-colors">About</a>
			<a href="/blog" class="text-sm text-text-muted hover:text-accent transition-colors">Blog</a>
			<SignedIn>
				<a href="/projects" class="text-sm text-text-muted hover:text-accent transition-colors">My Projects</a>
				<a href="/start" class="text-sm px-4 py-2 bg-accent text-surface font-medium rounded hover:bg-accent-dim transition-colors">
					Start a project
				</a>
				<UserButton afterSignOutUrl="/" />
			</SignedIn>
			<SignedOut>
				<a href="/sign-in" class="text-sm text-text-muted hover:text-accent transition-colors">Sign in</a>
				<a href="/sign-up" class="text-sm px-4 py-2 bg-accent text-surface font-medium rounded hover:bg-accent-dim transition-colors">
					Start a project
				</a>
			</SignedOut>
		</div>
	</div>
</nav>

<!-- Main content with top padding for fixed nav -->
<main class="pt-20">
	{@render children()}
</main>

<!-- Footer -->
<footer class="border-t border-surface-border px-6 py-12">
	<div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
		<div>
			<Logo height={44} />
			<p class="text-sm text-text-muted mt-3">Engineering & Technology Consultancy</p>
			<p class="text-sm text-text-muted mt-1">Newcastle, UK</p>
		</div>
		<div class="flex flex-col gap-2 text-sm text-text-muted">
			<a href="mailto:nic@materia-lab.uk" class="hover:text-accent transition-colors">nic@materia-lab.uk</a>
			<a href="https://github.com/materia-lab-uk" class="hover:text-accent transition-colors">GitHub</a>
			<a href="https://dev.to/dr_nicole" class="hover:text-accent transition-colors">Blog</a>
			<a href="https://linkedin.com/in/dr-nick-martin" class="hover:text-accent transition-colors">LinkedIn</a>
		</div>
	</div>
	<div class="max-w-6xl mx-auto mt-8 pt-8 border-t border-surface-border">
		<p class="text-xs text-text-muted">&copy; {new Date().getFullYear()} MartinWrightConsulting Ltd, trading as Materia Lab.</p>
	</div>
</footer>
