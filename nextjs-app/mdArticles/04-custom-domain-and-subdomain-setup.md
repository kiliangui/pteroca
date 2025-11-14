---
title: "Custom domain and subdomain setup for your Minecraft server"
description: "Set up custom domains and subdomains for your HostChicken Minecraft server, with clear DNS steps and tips."
slug: "custom-domain-and-subdomain-setup"
date: "2025-09-07"
updated: "2025-09-07"
authors:
  - "HostChicken Editorial Team"
category: "Minecraft Hosting"
tags:
  - "custom domain"
  - "dns"
  - "minecraft server"
  - "subdomain"
image: "/og/hostchicken-blog.png"
canonical: "https://hostchicken.com/blog/custom-domain-and-subdomain-setup"
seo:
  title: "Custom domain and subdomain setup | HostChicken Blog"
  description: "Step-by-step DNS and domain setup for Minecraft servers hosted on HostChicken."
  keywords:
    - "minecraft custom domain"
    - "minecraft subdomain"
    - "dns records minecraft"
    - "HostChicken"
  twitterCard: "summary_large_image"
  og:
    title: "Custom domain setup for Minecraft"
    description: "Configure domains and subdomains for your server."
    image: "/og/hostchicken-blog.png"
robots:
  index: true
  follow: true
---
## Custom domain and subdomain setup for your Minecraft server

A custom domain makes your server easy to remember and safer to share. Instead of a changing IP or a long hostname, friends can connect to `play.yourdomain.com`. This guide shows you how to set it up with HostChicken and avoid common DNS pitfalls.

### Why use a custom domain?

- Easy to remember: `play.yourdomain.com` beats an IP.
- Flexible: You can move servers later without making friends update bookmarks.
- Safer sharing: Share the domain, not your personal IP.

### What you’ll need

- Access to a domain you own (from registrars like Namecheap, Google Domains, Cloudflare, etc.)
- The HostChicken server address or target hostname provided in your dashboard

### Pick a subdomain

Common choices:

- `play.yourdomain.com` (most popular)
- `mc.yourdomain.com`
- `smp.yourdomain.com`

### Create a DNS record

In your registrar or DNS provider dashboard, create one of the following (HostChicken will tell you which):

- CNAME record: Points your subdomain to a target hostname (e.g., `yourname.mcfree.serv`).
  - Name/Host: `play`
  - Type: `CNAME`
  - Target: `your-assigned.mcfree.serv` (check your server page)
  - TTL: Auto or 5–30 minutes

- A record: Points directly to an IP (only if HostChicken provides an IP for your server)
  - Name/Host: `play`
  - Type: `A`
  - Value: `123.45.67.89` (example)
  - TTL: Auto or 5–30 minutes

Use CNAME whenever possible. It’s more flexible and won’t break if underlying IPs change.

### Advanced: SRV records for non‑default ports

Minecraft Java defaults to port 25565. If your server runs on a different port, you can keep your clean `play.yourdomain.com` address by creating an SRV record that points to the actual host and port. Not all DNS providers make SRV setup obvious, but here’s the pattern:

- Type: `SRV`
- Name/Service: `_minecraft._tcp.play`
- Priority: `0`
- Weight: `5`
- Port: `PORT_YOUR_SERVER_USES` (e.g., `25575`)
- Target: The hostname or subdomain the Minecraft server is actually running on (e.g., `your-assigned.mcfree.serv`).

Keep a normal `A`/`CNAME` for `play.yourdomain.com` pointing to the same target. The SRV tells Minecraft which port to use behind the scenes.

Note: Bedrock uses different protocols and records. For Bedrock, you would create `_minecraft._udp` SRV records and often separate subdomains (e.g., `bedrock.yourdomain.com`). HostChicken will indicate the correct setup in your dashboard if Bedrock is enabled via a bridge like Geyser.

### Add the domain in HostChicken

1. Open your server in the HostChicken dashboard.

2. Go to Domain/Networking.

3. Add your subdomain (e.g., `play.yourdomain.com`).

4. HostChicken will verify DNS automatically or provide a TXT record for ownership verification.

5. Wait for DNS to propagate (usually minutes, sometimes up to an hour).

### Verify it works

On desktop, run:

```
nslookup play.yourdomain.com
```

Or use an online DNS checker. Once the CNAME/A record resolves correctly, try connecting from Minecraft using the subdomain.

For SRV verification, use a DNS lookup tool that supports SRV queries (or `dig` on Linux/macOS):

```
dig +short SRV _minecraft._tcp.play.yourdomain.com
```

You should see the target and port you configured.

### Common DNS issues and fixes

- Propagation delay: Wait 15–60 minutes and try again.
- Wrong record type: Use CNAME unless your provider requires A/AAAA.
- Conflicting records: Remove old A/AAAA records if you’re switching to CNAME.
- Proxy/CDN interference: If using Cloudflare, set proxy to DNS-only (gray cloud) unless HostChicken supports proxied Minecraft traffic.
- Typos: Double-check `play` vs `palay`, and the target hostname.

Extra tips:

- ISPs and devices cache aggressively. Try a phone on mobile data, or clear your system DNS cache.
- On Windows, you can run `ipconfig /flushdns` in Command Prompt. On macOS, `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`. On Linux, it depends on your resolver (`systemd-resolved`, `nscd`, etc.).

### Can I have multiple servers?

Yes. Use different subdomains:

- `survival.yourdomain.com`
- `creative.yourdomain.com`
- `modded.yourdomain.com`

Each subdomain can point to a different HostChicken server.

### Switch servers without telling everyone

If you ever migrate servers, just update the DNS record to point the same subdomain to the new target. Your friends can keep using `play.yourdomain.com`—no changes on their side.

### Safety tips

- Keep registrar and DNS provider logins secure.
- Use 2FA when available.
- Avoid sharing full DNS screenshots publicly.

### Registrar walkthroughs (high level)

- Cloudflare: Add your domain, disable the orange proxy cloud for Minecraft records, create a `CNAME` for `play` to your HostChicken hostname, and optionally add an SRV if you use a non‑default port.
- Namecheap/GoDaddy/Google Domains: Open DNS records, add `CNAME` for `play`, paste your HostChicken hostname, set TTL to automatic. If you can’t create SRV easily, ask support or use the default 25565 port to keep it simple.

### Java and Bedrock together

If you enable Geyser + Floodgate to let Bedrock players join a Java server, they’ll often use the same hostname but a different port. You can give Bedrock players a separate subdomain (e.g., `bedrock.yourdomain.com`) and configure the correct record/port as instructed by the HostChicken dashboard. Provide both addresses in your server description so everyone knows where to connect.

### Quick checklist

- [ ] Choose a subdomain like `play.yourdomain.com`
- [ ] Create a CNAME to your HostChicken hostname
- [ ] Add and verify the domain in HostChicken
- [ ] Test with `nslookup` and in Minecraft

Once set up, your friends can connect faster, and you’ll have a clean, professional address you can keep forever.


