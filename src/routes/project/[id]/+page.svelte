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
  let githubRepo = $state(submission.githubRepo || '');
  let editingRepo = $state(false);
  let chatContainer: HTMLDivElement | undefined = $state();
  let chatOpen = $state(false);

  async function saveGithubRepo() {
    await fetch(`/api/project/${submission.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ githubRepo: githubRepo.trim() || null }),
    });
    editingRepo = false;
  }

  function scrollChat() {
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

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
          setTimeout(scrollChat, 50);
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
            setTimeout(scrollChat, 50);
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
  <div class="max-w-7xl mx-auto">
    <p class="font-mono text-xs tracking-[0.3em] text-accent mb-6 uppercase">Project Assessment</p>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Left: Assessment -->
      <div class="flex-1 min-w-0">
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
            Prepared for {submission.name} by Materia Lab AI &middot; {new Date(submission.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
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
            <a href="https://cloud.materia-lab.uk/index.php/apps/appointments/pub/r4qzDD1NYtq7yv4l/form" target="_blank" rel="noopener"
              class="inline-block mt-6 px-6 py-3 bg-accent text-surface font-medium rounded hover:bg-accent-dim transition-colors">
              Book a discovery call
            </a>
          </div>
        {/if}

        <!-- All project files -->
        {#if allFiles.length > 0}
          <div class="mb-10">
            <h2 class="text-lg font-medium mb-3">Files</h2>
            <div class="space-y-2">
              {#each allFiles as file}
                <a href="/api/file?key={encodeURIComponent(file.key)}&project={submission.id}" class="flex items-center gap-3 text-sm text-text-muted border border-surface-border rounded-lg px-4 py-3 hover:border-accent/30 transition-colors">
                  <svg class="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span class="hover:text-accent transition-colors">{file.name}</span>
                  <span class="text-xs">({Math.round(file.size / 1024)}KB)</span>
                  {#if file.source === 'chat'}
                    <span class="text-xs font-mono text-accent/50">chat</span>
                  {/if}
                </a>
              {/each}
            </div>
          </div>
        {/if}

        <!-- GitHub Repo -->
        {#if githubRepo || isAdmin}
          <div class="mb-10">
            <h2 class="text-lg font-medium mb-3">Repository</h2>
            {#if editingRepo}
              <form onsubmit={(e: Event) => { e.preventDefault(); saveGithubRepo(); }} class="flex gap-3">
                <input type="text" bind:value={githubRepo} placeholder="https://github.com/org/repo"
                  class="flex-1 bg-surface-alt border border-surface-border rounded-lg px-4 py-3 text-text text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors" />
                <button type="submit" class="px-4 py-2 bg-accent text-surface text-sm font-medium rounded hover:bg-accent-dim transition-colors">Save</button>
                <button type="button" onclick={() => { editingRepo = false; }} class="px-4 py-2 text-sm text-text-muted hover:text-accent transition-colors">Cancel</button>
              </form>
            {:else if githubRepo}
              <div class="flex items-center gap-3">
                <a href={githubRepo} target="_blank" rel="noopener" class="text-sm text-accent hover:text-accent-dim transition-colors font-mono">{githubRepo.replace('https://github.com/', '')}</a>
                {#if isAdmin}
                  <button type="button" onclick={() => { editingRepo = true; }} class="text-xs text-text-muted hover:text-accent transition-colors">edit</button>
                {/if}
              </div>
            {:else if isAdmin}
              <button type="button" onclick={() => { editingRepo = true; }} class="text-sm text-text-muted hover:text-accent transition-colors">+ Link a GitHub repository</button>
            {/if}
          </div>
        {/if}
      </div>

      <!-- Right: Chat (sticky on desktop, collapsible on mobile) -->
      <div class="lg:w-96 lg:shrink-0">
        <!-- Mobile toggle button -->
        <button type="button" onclick={() => { chatOpen = !chatOpen; }}
          class="lg:hidden w-full flex items-center justify-between border border-surface-border rounded-lg px-4 py-3 mb-2">
          <span class="text-lg font-medium">Discussion</span>
          <span class="text-text-muted text-sm">{messages.length} message{messages.length !== 1 ? 's' : ''} {chatOpen ? '▲' : '▼'}</span>
        </button>

        <div class="{chatOpen ? '' : 'hidden'} lg:block lg:sticky lg:top-24 border border-surface-border rounded-lg p-6" style="max-height: calc(100vh - 8rem); display: flex; flex-direction: column;">
          <h2 class="text-lg font-medium mb-4 hidden lg:block" style="flex-shrink: 0;">Discussion</h2>

          <div bind:this={chatContainer} style="flex: 1 1 0; min-height: 0; overflow-y: auto;" class="space-y-3 mb-4">
            {#if messages.length === 0}
              <p class="text-text-muted text-sm">No messages yet. Start the conversation below.</p>
            {:else}
              {#each messages as msg}
                <div class="border {msg.userId === 'ai' ? 'border-accent/20 bg-accent-glow' : 'border-surface-border'} rounded-lg p-3">
                  <div class="flex justify-between items-baseline mb-1">
                    <span class="text-xs font-medium {msg.userName === 'Nicole' || msg.userName === 'Dr Nicole Martin' || msg.userId === 'ai' ? 'text-accent' : 'text-text'}">{msg.userName}</span>
                    <span class="font-mono text-[10px] text-text-muted">
                      {new Date(msg.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} {new Date(msg.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p class="text-text-muted leading-relaxed text-sm">{msg.content}</p>
                </div>
              {/each}
            {/if}
          </div>

          <SignedIn let:user>
            <div style="flex-shrink: 0;">
              {#if chatFile}
                <div class="flex items-center gap-2 mb-2 text-sm text-text-muted">
                  <span class="font-mono text-accent">&#x1F4CE;</span>
                  <span class="truncate">{chatFile.name}</span>
                  <button type="button" onclick={() => { chatFile = null; }} class="text-xs text-accent hover:text-accent-dim shrink-0">&times;</button>
                </div>
              {/if}
              <form onsubmit={(e: Event) => { e.preventDefault(); sendMessage(user); }} class="flex gap-2">
                <input
                  type="text"
                  bind:value={newMessage}
                  placeholder="Type a message..."
                  class="flex-1 bg-surface-alt border border-surface-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors"
                />
                <label class="flex items-center px-2 border border-surface-border rounded-lg cursor-pointer hover:border-accent/30 transition-colors">
                  <span class="text-text-muted text-sm">&#x1F4CE;</span>
                  <input type="file" class="hidden" onchange={(e: Event) => { const t = e.target as HTMLInputElement; chatFile = t.files?.[0] || null; }} />
                </label>
                <button type="submit" disabled={sending || (!newMessage.trim() && !chatFile)}
                  class="px-4 py-2 bg-accent text-surface text-sm font-medium rounded hover:bg-accent-dim transition-colors disabled:opacity-50">
                  Send
                </button>
              </form>
            </div>
          </SignedIn>
        </div>
      </div>
    </div>
  </div>
</section>
