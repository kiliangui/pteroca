---
title: "Permissions made easy with LuckPerms: roles, groups, and best practices"
description: "Set up clean, scalable roles and permissions on Paper/Spigot using LuckPerms, with reusable command snippets."
slug: "permissions-with-luckperms"
date: "2025-09-07"
updated: "2025-09-07"
authors:
  - "HostChicken Editorial Team"
category: "Plugins"
tags:
  - "luckperms"
  - "permissions"
  - "paper"
  - "spigot"
image: "/og/hostchicken-blog.png"
canonical: "https://hostchicken.com/blog/permissions-with-luckperms"
seo:
  title: "Permissions with LuckPerms | HostChicken Blog"
  description: "Create roles and manage permissions the right way on Paper/Spigot."
  keywords:
    - "luckperms roles setup"
    - "spigot permissions tutorial"
    - "HostChicken"
  twitterCard: "summary_large_image"
  og:
    title: "LuckPerms roles and permissions"
    description: "Best practices and reusable commands."
    image: "/og/hostchicken-blog.png"
robots:
  index: true
  follow: true
---
## Permissions made easy with LuckPerms: roles, groups, and best practices

LuckPerms is the gold standard for permissions on Paper/Spigot servers. It’s powerful, fast, and well‑documented. This guide gets you from zero to a clean roles setup with commands you can reuse every time you create a new server.

### Install

1. Download the LuckPerms jar and place it in `plugins/`.
2. Start the server to generate files.
3. Optional: Set up the web editor with `/lp editor` for a visual interface.

### Core concepts

- Users: Individual players
- Groups: Roles that hold permissions (e.g., default, member, moderator, admin)
- Tracks: Ordered group progressions (e.g., `member -> vip -> mvp`)
- Contexts: Conditions (per world, server, time)

### Quick start: basic groups

Commands (run in console or as op):

```bash
/lp creategroup default
/lp creategroup member
/lp creategroup mod
/lp creategroup admin

/lp default parent add member

# Essentials‑like QoL
/lp group member permission set essentials.home true
/lp group member permission set essentials.sethome true

# Moderation
/lp group mod permission set essentials.kick true
/lp group mod permission set worldguard.region.claim true

# Admin
/lp group admin permission set * true
```

Replace permissions with those your plugins use. Use plugin docs to find exact nodes.

### Assign players

```bash
/lp user <name> parent set member
/lp user <name> parent set mod
```

### Web editor

- Run `/lp editor` and open the link.
- Edit groups and users visually; click “Save” and paste the command back into console.

### Tracks (optional)

```bash
/lp createtrack rank
/lp track rank append member vip mvp
/lp user <name> parent settrack rank vip
```

### Best practices

- Principle of least privilege: Give only what’s needed.
- Use groups for everything; avoid per‑user overrides unless necessary.
- Keep a text or Markdown doc of your group structure and key nodes.
- Backup LuckPerms data and test changes on a staging server.

### Troubleshooting

- A command says “no permission”: Use `/lp verbose on` and try the command; check logs to see which node is missing.
- Conflicts: Check if a deny node exists in another group. Order and contexts matter.

With a clean group setup in LuckPerms, you’ll spend less time micromanaging permissions and more time playing—and your moderators will know exactly what they can do.


