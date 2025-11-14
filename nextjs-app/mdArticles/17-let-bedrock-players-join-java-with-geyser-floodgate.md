---
title: "Let Bedrock players join your Java server (Geyser + Floodgate)"
description: "Bridge Bedrock and Java so friends on consoles and phones can join your Paper server using Geyser and Floodgate."
slug: "let-bedrock-players-join-java-with-geyser-floodgate"
date: "2025-09-07"
updated: "2025-09-07"
authors:
  - "HostChicken Editorial Team"
category: "Cross‑Play"
tags:
  - "bedrock"
  - "java"
  - "geyser"
  - "floodgate"
image: "/og/hostchicken-blog.png"
canonical: "https://hostchicken.com/blog/let-bedrock-players-join-java-with-geyser-floodgate"
seo:
  title: "Let Bedrock join Java (Geyser + Floodgate) | HostChicken Blog"
  description: "Setup guide to connect Bedrock players to your Java server."
  keywords:
    - "geyser floodgate setup"
    - "bedrock join java server"
    - "HostChicken"
  twitterCard: "summary_large_image"
  og:
    title: "Bedrock ↔ Java cross‑play"
    description: "Enable cross‑play with Geyser and Floodgate."
    image: "/og/hostchicken-blog.png"
robots:
  index: true
  follow: true
---
## Let Bedrock players join your Java server (Geyser + Floodgate)

Have friends on consoles, phones, or Windows Bedrock? With Geyser and Floodgate, Bedrock players can join your Java server. This guide explains what you need, how to install it on Paper (recommended), and how to share the right address and port so everyone can connect.

### What are Geyser and Floodgate?

- Geyser: A proxy that translates Bedrock protocol to Java protocol.
- Floodgate: Lets Bedrock players join without needing a Java account by creating a linked identity.

Together, they bridge the gap so Bedrock clients can play on a Java server with minimal friction.

### Requirements

- Server type: Paper (or compatible) on a stable Java Minecraft version
- Ports: Java typically 25565 (TCP); Bedrock 19132 (UDP) if exposed
- Console/Xbox Live sign‑in enabled on Bedrock clients

### Install on Paper

1. Download Geyser and Floodgate plugin jars from their official pages.
2. Stop your server and take a backup.
3. Place the jars into the `plugins/` folder.
4. Start the server to generate configs, then stop again.

### Configure Geyser

Open `plugins/Geyser-Spigot/config.yml` and set:

- `bedrock` → `address`: Usually `0.0.0.0`
- `bedrock` → `port`: `19132` (default Bedrock port)
- `remote` → `address`: Your Java server address (often `127.0.0.1` if same host)
- `remote` → `port`: Java port (25565)

If HostChicken exposes a Bedrock entry point, follow the dashboard notes to map UDP 19132. If not, Geyser can still work in “plugin” mode routing through the Java connection—players connect with the Java hostname and Floodgate handles auth.

### Configure Floodgate

In `plugins/floodgate/`, verify keys and default settings. Floodgate tags Bedrock usernames (e.g., `*Player`) to avoid conflicts with Java names. You can customize the prefix.

### Permissions and commands

- Basic join requires no extra commands.
- If you use LuckPerms, create a group for Bedrock players and grant appropriate permissions.

### Sharing the address

- Java players: `play.yourdomain.com` (port 25565)
- Bedrock players: `play.yourdomain.com` with port `19132` (UDP). On some platforms you must specify the port explicitly.

If you use a custom domain, you can add SRV records or provider‑specific mappings. Check HostChicken networking for Bedrock guidance.

### Caveats

- Some Java mods and plugins assume Java mechanics; Bedrock behavior may differ slightly.
- Bedrock chat/GUI can render differently; test key gameplay loops.
- Anti‑cheat plugins may need tuning for Bedrock input patterns.

### Performance notes

- Geyser’s translation adds a small overhead; Paper’s optimizations help compensate.
- Keep view distance modest (8–10) and simulation 5–6.

### Troubleshooting

- Bedrock can’t see the server: Verify UDP 19132 is reachable or use the “Add Server” manual entry with host and port.
- “Could not resolve hostname”: Double‑check DNS and any SRV/records for Bedrock.
- Login issues: Ensure Xbox Live sign‑in on client; check Floodgate logs.

With Geyser + Floodgate, your server becomes truly cross‑platform—perfect for friends who game on different devices.


