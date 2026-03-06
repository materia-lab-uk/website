# Materia Lab Website — TODO

## In Progress
- [ ] Set up Clerk auth (keys, R2 bucket, admin role)
- [ ] Test end-to-end: sign up → submit project → view assessment → chat

## Chat & AI Refinement
- [ ] Move chat to a side panel alongside the assessment document (split layout)
- [ ] Claude follow-up questions in chat — AI asks clarifying questions to refine the project before Nicole gets involved
- [ ] Rate limit Claude chat interactions (e.g. 5 AI messages per project)
- [ ] File upload within chat messages (add to supporting docs)
- [ ] All uploaded files (intake + chat) listed in a dedicated "Files" section on the project page

## Project Page Enhancements
- [ ] Link a GitHub repo to a project (display link, maybe pull README/issues)
- [ ] "My Projects" dashboard for authenticated clients (list their submissions with titles)
- [ ] Project status updates (e.g. "In Review", "Proposal Sent", "Active", "Complete")

## Future Features
- [ ] Invite collaborators to a project (multi-user access)
- [ ] Deliverables section — upload and share project outputs with client
- [ ] Payments via Stripe (invoicing, milestone payments)
- [ ] Cal.com booking integration (only visible to authenticated users with an active project)
- [ ] Email notifications when assessment is ready or new chat message received
- [ ] Cron trigger for queue processing (Cloudflare Workers scheduled handler or external cron)

## Content & SEO
- [ ] Case studies / portfolio page
- [ ] Meta tags and Open Graph for social sharing
- [ ] Sitemap.xml
- [ ] Analytics (Cloudflare Web Analytics or Plausible)

## Infrastructure
- [ ] Custom error pages (404, 500)
- [ ] Mobile nav (hamburger menu for small screens)
- [ ] Cloudflare R2 setup for file uploads
- [ ] Production Clerk domain configuration (OAuth providers need DNS setup)
