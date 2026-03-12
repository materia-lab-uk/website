<script lang="ts">
  import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte';

  let { data } = $props();
  const { submission, isAdmin } = data;
  const a = submission.assessment;
  const isPending = submission.status === 'queued' || submission.status === 'processing';

  let messages = $state(submission.messages || []);
  let allFiles = $state(submission.files || []);
  let newMessage = $state('');
  let sending = $state(false);
  let chatFile: File | null = $state(null);

  async function sendMessage(user: { fullName?: string; firstName?: string }) {
    if ((!newMessage.trim() && !chatFile) || sending) return;
    sending = true;
    try {
      // Upload file first if attached
      if (chatFile) {
        const formData = new FormData();
        formData.append('projectId', submission.id);
        formData.append('file', chatFile);
        const uploadRes = await fetch('/api/chat/upload', { method: 'POST', body: formData });
        if (uploadRes.ok) {
          const result = await uploadRes.json();
          allFiles = [...allFiles, result.file];
        }
        chatFile = null;
      }

      // Send message if there's text
      if (newMessage.trim()) {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: submission.id,
            content: newMessage.trim(),
            userName: user.fullName || user.firstName || 'User',
          }),
        });
        if (res.ok) {
          const result = await res.json();
          messages = [...messages, result.message];
          if (result.aiMessage) {
            messages = [...messages, result.aiMessage];
          }
          newMessage = '';
        }
      }
    } finally {
      sending = false;
    }
  }

  // Poll for new messages every 15 seconds
  $effect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/project/${submission.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.messages?.length > messages.length) {
            messages = data.messages;
          }
        }
      } catch {}
    }, 15000);
    return () => clearInterval(interval);
  });
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
      <h1 class="text-3xl md:text-4xl font-light tracking-tight mb-6">Thanks, {submission.name}.</h1>
      <p class="text-lg text-text-muted leading-relaxed mb-8">
        We've received your enquiry and will get back to you within 24 hours with a detailed assessment and next steps.
      </p>
      <div class="border border-surface-border rounded-lg p-6">
        <h3 class="text-sm font-mono text-accent mb-3 uppercase tracking-wider">Your submission</h3>
        <p class="text-text-muted leading-relaxed">{submission.description}</p>
      </div>

    {:else}
      <h1 class="text-3xl md:text-4xl font-light tracking-tight mb-2">
        {submission.title || (submission.company ? `${submission.company} — Project Assessment` : 'Project Assessment')}
      </h1>
      <p class="text-sm text-text-muted mb-10">
        Prepared for {submission.name} &middot; {new Date(submission.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      <div class="mb-10">
        <h2 class="text-lg font-medium mb-3">Summary</h2>
        <p class="text-text-muted leading-relaxed">{a.summary}</p>
      </div>

      <div class="mb-10">
        <h2 class="text-lg font-medium mb-3">Feasibility</h2>
        <p class="text-text-muted leading-relaxed">{a.feasibility}</p>
      </div>

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
    {/if}

    <!-- All project files -->
    {#if allFiles.length > 0}
      <div class="mb-10">
        <h2 class="text-lg font-medium mb-3">Files</h2>
        <div class="space-y-2">
          {#each allFiles as file}
            <div class="flex items-center gap-3 text-sm text-text-muted border border-surface-border rounded-lg px-4 py-3">
              <span class="font-mono text-accent">&#x1F4CE;</span>
              <span>{file.name}</span>
              <span class="text-xs">({Math.round(file.size / 1024)}KB)</span>
              {#if file.source === 'chat'}
                <span class="text-xs font-mono text-accent/50">chat</span>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Chat -->
    <div class="mt-16 border-t border-surface-border pt-10">
      <h2 class="text-lg font-medium mb-6">Discussion</h2>

      {#if messages.length === 0}
        <p class="text-text-muted text-sm mb-6">No messages yet. Start the conversation below.</p>
      {:else}
        <div class="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {#each messages as msg}
            <div class="border {msg.userId === 'ai' ? 'border-accent/20 bg-accent-glow' : 'border-surface-border'} rounded-lg p-4">
              <div class="flex justify-between items-baseline mb-2">
                <span class="text-sm font-medium {msg.userName === 'Nicole' || msg.userName === 'Dr Nicole Martin' || msg.userId === 'ai' ? 'text-accent' : 'text-text'}">{msg.userName}</span>
                <span class="font-mono text-xs text-text-muted">
                  {new Date(msg.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} {new Date(msg.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p class="text-text-muted leading-relaxed text-sm">{msg.content}</p>
            </div>
          {/each}
        </div>
      {/if}

      <SignedIn let:user>
        {#if chatFile}
          <div class="flex items-center gap-2 mb-3 text-sm text-text-muted">
            <span class="font-mono text-accent">&#x1F4CE;</span>
            <span>{chatFile.name}</span>
            <button type="button" onclick={() => { chatFile = null; }} class="text-xs text-accent hover:text-accent-dim">&times; remove</button>
          </div>
        {/if}
        <form onsubmit={(e: Event) => { e.preventDefault(); sendMessage(user); }} class="flex gap-3">
          <input
            type="text"
            bind:value={newMessage}
            placeholder="Type a message..."
            class="flex-1 bg-surface-alt border border-surface-border rounded-lg px-4 py-3 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors"
          />
          <label class="flex items-center px-3 border border-surface-border rounded-lg cursor-pointer hover:border-accent/30 transition-colors">
            <span class="text-text-muted text-lg">&#x1F4CE;</span>
            <input type="file" class="hidden" onchange={(e: Event) => { const t = e.target as HTMLInputElement; chatFile = t.files?.[0] || null; }} />
          </label>
          <button type="submit" disabled={sending || (!newMessage.trim() && !chatFile)}
            class="px-6 py-3 bg-accent text-surface font-medium rounded hover:bg-accent-dim transition-colors disabled:opacity-50">
            Send
          </button>
        </form>
      </SignedIn>
    </div>
  </div>
</section>
