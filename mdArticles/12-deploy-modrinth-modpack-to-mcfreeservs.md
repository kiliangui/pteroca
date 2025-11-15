---
title: "Deploy a Modrinth modpack to HostChicken"
description: "Install Modrinth `.mrpack` modpacks on your HostChicken server using server packs or conversion with Prism/Packwiz."
slug: "deploy-modrinth-modpack-to-mcfreeservs"
date: "2025-09-07"
updated: "2025-09-07"
authors:
  - "HostChicken Editorial Team"
category: "Modpacks"
tags:
  - "modrinth"
  - ".mrpack"
  - "server install"
image: "/og/hostchicken-blog.png"
canonical: "https://hostchicken.com/blog/deploy-modrinth-modpack-to-mcfreeservs"
seo:
  title: "Deploy a Modrinth modpack | HostChicken Blog"
  description: "How to install Modrinth packs on your HostChicken server."
  keywords:
    - "modrinth mrpack server"
    - "deploy modrinth modpack"
    - "HostChicken"
  twitterCard: "summary_large_image"
  og:
    title: "Deploy Modrinth modpacks"
    description: "Server packs and conversion steps."
    image: "/og/hostchicken-blog.png"
robots:
  index: true
  follow: true
---
## Deploy a Modrinth modpack to HostChicken

Modrinth packs are fast, modern, and easy to manage—especially with Prism Launcher or Packwiz. This guide covers installing a Modrinth pack on your HostChicken server using the server pack (when provided) or converting the `.mrpack` client file into a server install.

### What is a .mrpack?

`.mrpack` files are manifests that describe which mods to download and their versions. Launchers like Prism read the manifest and fetch the right files automatically. For servers, you’ll usually need a server pack or a conversion step to remove client‑only mods.

### Option A: Use a provided server pack

1) Download the server pack

- On the Modrinth project, open the Versions tab.
- Filter for Server files if available and download the zip for your target version.

2) Extract and review

- Ensure it includes `mods/`, `config/`, and a server start method for the correct loader (Forge/Fabric).

3) Upload and start

- Stop your server, take a backup, upload the pack contents, and start.
- Watch logs for missing dependencies.

### Option B: Convert a .mrpack client file

1) Import to Prism Launcher

- In Prism, click Add Instance → Import and select the `.mrpack` file.
- Prism downloads mods to create a local client instance.

2) Gather server‑safe files

- Open the instance folder → `mods/` and `config/`.
- Remove client‑only mods (minimaps, UI tweaks, shader loaders).

3) Prepare the server loader

- Forge: Run the Forge installer for the pack’s MC version and produce a `forge-...-server.jar` plus `libraries/`.
- Fabric: Use the Fabric server installer for the exact MC version.

4) Upload to HostChicken

- Stop the server, back up, upload `mods/`, `config/`, and the server loader jar (and libraries for Forge).

5) Start and validate

- Start the server. Fix any missing dependency errors named in the log.

### Advanced: Packwiz for reproducible servers

If the pack uses Packwiz or you want a reproducible workflow:

- Use `packwiz modrinth export` or `packwiz cf export` to generate consistent manifests.
- Maintain a single source of truth for mods and versions, then generate both client and server packs.
- This makes updates and rollbacks painless and keeps everyone synced.

### Performance notes

- Fabric packs often run lighter; start with view distance 8–10 and simulation 5–6.
- Add server‑side performance mods if the author recommends them.
- Schedule restarts for long‑running worlds.

### Updating safely

1. Stage updates on a clone.
2. Replace `mods/` and `config/` per release notes.
3. Boot, test, and only then update the live server.

### Troubleshooting

- Missing mod: The log names it—add the exact version.
- Loader mismatch: Ensure Forge/Fabric and MC versions are identical across client and server.
- Crash during mixins: Often a Fabric loader vs mod mismatch; update the loader or mod.

### Checklist

- [ ] Use server pack if available; otherwise import `.mrpack` into Prism
- [ ] Remove client‑only mods for the server
- [ ] Prepare correct Fabric/Forge server jar
- [ ] Start, watch logs, and resolve missing deps

With a consistent process, Modrinth packs deploy quickly to HostChicken. Once your group has the routine down, you can explore new packs confidently without fear of breakage.


