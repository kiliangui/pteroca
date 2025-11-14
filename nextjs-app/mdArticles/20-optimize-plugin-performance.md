---
title: "Optimize plugin performance: async, events, and smooth ticks"
description: "Keep your Paper/Spigot plugins fast with async patterns, event hygiene, and profiling—practical recipes included."
slug: "optimize-plugin-performance"
date: "2025-09-07"
updated: "2025-09-07"
authors:
  - "HostChicken Editorial Team"
category: "Plugins"
tags:
  - "performance"
  - "paper"
  - "spigot"
  - "plugins"
image: "/og/hostchicken-blog.png"
canonical: "https://hostchicken.com/blog/optimize-plugin-performance"
seo:
  title: "Optimize plugin performance | HostChicken Blog"
  description: "Async, events, and profiling for smooth server ticks."
  keywords:
    - "spigot plugin performance"
    - "paper async io"
    - "optimize minecraft plugin"
  twitterCard: "summary_large_image"
  og:
    title: "Smooth plugin performance"
    description: "Async patterns and event best practices."
    image: "/og/hostchicken-blog.png"
robots:
  index: true
  follow: true
---
## Optimize plugin performance: async, events, and smooth ticks

Great plugins feel invisible—they add features without adding lag. This guide collects practical patterns to keep your Paper/Spigot plugins fast and friendly on live servers.

### Golden rules

- Never block the main thread with I/O (files, databases, web calls).
- Do less work per tick; batch or defer heavy tasks.
- Profile regularly using Paper timings or Spark.

### Async without fear

- Use the scheduler to run blocking work async, then hop back to main thread to touch Bukkit API.
- Cache results so you don’t re‑query every tick.

Example pattern (pseudocode):

```java
runAsync(() -> {
    Data d = db.load(playerId);
    runSync(() -> applyToPlayer(player, d));
});
```

### Event hygiene

- Filter early: Check simple conditions first and return quickly.
- Avoid repeated lookups; store computed values.
- Don’t log spam in hot events (e.g., move, tick, damage).

### Data structures that help

- Use `EnumSet`, `Int2ObjectMap` (fastutil), and primitive collections for hotspots.
- Prefer immutable configs loaded once at startup.

### Reduce allocations

- Reuse objects in tight loops.
- Avoid string concatenation in hot paths; prebuild messages.

### Configuration

- Load configs once, not per event.
- Validate config values and clamp extremes (e.g., max radius, max iterations).

### Scheduling and batching

- Spread heavy work across multiple ticks.
- For scans or searches, process N items per tick, not all at once.

### Play nicely with the server

- Respect view/simulation distances; don’t force‑load huge chunk areas.
- Avoid keeping chunks loaded unnecessarily.

### Profiling 1‑2‑3

1. Reproduce the lag in a controlled session.
2. Run `/timings on`, play 5–10 minutes, then `/timings paste`.
3. Identify top offenders and optimize or disable features.

### Testing and CI

- Unit test core logic where possible.
- Keep a staging server with sample data.
- Benchmark critical paths if you do heavy math or pathfinding.

### Communicate limits

- Expose sane defaults.
- Document costs (e.g., scanning a 200×200 area is heavy) and provide admin toggles.

Small habits add up. With good async patterns, event filtering, and regular profiling, your plugins will feel smooth—even when your players get creative.


