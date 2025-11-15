---
title: "Build a “/home” plugin step‑by‑step (Paper)"
description: "Create a Paper plugin with /sethome and /home commands, YAML storage, and clean permissions—great starter project."
slug: "build-a-home-plugin-step-by-step"
date: "2025-09-07"
updated: "2025-09-07"
authors:
  - "HostChicken Editorial Team"
category: "Plugins"
tags:
  - "paper"
  - "plugin development"
  - "homes"
image: "/og/hostchicken-blog.png"
canonical: "https://hostchicken.com/blog/build-a-home-plugin-step-by-step"
seo:
  title: "Build a /home plugin (Paper) | HostChicken Blog"
  description: "Step-by-step tutorial for a homes plugin with YAML storage."
  keywords:
    - "/home plugin paper"
    - "spigot homes tutorial"
    - "HostChicken"
  twitterCard: "summary_large_image"
  og:
    title: "Build a /home plugin"
    description: "Commands, storage, and permissions for Paper."
    image: "/og/hostchicken-blog.png"
robots:
  index: true
  follow: true
---
## Build a “/home” plugin step‑by‑step (Paper)

Let’s extend your first plugin into something useful: a simple homes system. Players can set a home and teleport back anytime with `/sethome` and `/home`. We’ll store data in a YAML file to keep it easy.

### Project outline

- Commands: `/sethome`, `/home`
- Storage: `plugins/Homes/homes.yml`
- Permissions: `homes.sethome`, `homes.home` (optional)

### plugin.yml

```yaml
name: Homes
version: 1.0.0
main: com.example.homes.HomesPlugin
api-version: 1.20
commands:
  sethome:
    description: Set your home
  home:
    description: Teleport to your home
permissions:
  homes.sethome:
    default: true
  homes.home:
    default: true
```

### Main plugin class

```java
package com.example.homes;

import org.bukkit.Bukkit;
import org.bukkit.Location;
import org.bukkit.World;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.configuration.file.YamlConfiguration;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

public class HomesPlugin extends JavaPlugin {
    private File homesFile;
    private FileConfiguration homes;

    @Override
    public void onEnable() {
        homesFile = new File(getDataFolder(), "homes.yml");
        if (!homesFile.getParentFile().exists()) {
            homesFile.getParentFile().mkdirs();
        }
        if (!homesFile.exists()) {
            try { homesFile.createNewFile(); } catch (IOException ignored) {}
        }
        homes = YamlConfiguration.loadConfiguration(homesFile);
        getLogger().info("Homes enabled");
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!(sender instanceof Player player)) {
            sender.sendMessage("Players only.");
            return true;
        }

        if (command.getName().equalsIgnoreCase("sethome")) {
            if (!player.hasPermission("homes.sethome")) {
                player.sendMessage("You don’t have permission.");
                return true;
            }
            setHome(player.getUniqueId(), player.getLocation());
            player.sendMessage("Home set!");
            return true;
        }

        if (command.getName().equalsIgnoreCase("home")) {
            if (!player.hasPermission("homes.home")) {
                player.sendMessage("You don’t have permission.");
                return true;
            }
            Location home = getHome(player.getUniqueId());
            if (home == null) {
                player.sendMessage("You don’t have a home yet. Use /sethome.");
                return true;
            }
            player.teleport(home);
            player.sendMessage("Teleported home!");
            return true;
        }
        return false;
    }

    private void setHome(UUID uuid, Location loc) {
        String path = uuid.toString();
        homes.set(path + ".world", loc.getWorld().getName());
        homes.set(path + ".x", loc.getX());
        homes.set(path + ".y", loc.getY());
        homes.set(path + ".z", loc.getZ());
        homes.set(path + ".yaw", loc.getYaw());
        homes.set(path + ".pitch", loc.getPitch());
        try { homes.save(homesFile); } catch (IOException ignored) {}
    }

    private Location getHome(UUID uuid) {
        String base = uuid.toString();
        if (!homes.contains(base)) return null;
        World world = Bukkit.getWorld(homes.getString(base + ".world"));
        if (world == null) return null;
        double x = homes.getDouble(base + ".x");
        double y = homes.getDouble(base + ".y");
        double z = homes.getDouble(base + ".z");
        float yaw = (float) homes.getDouble(base + ".yaw");
        float pitch = (float) homes.getDouble(base + ".pitch");
        return new Location(world, x, y, z, yaw, pitch);
    }
}
```

### Build and install

Build your jar and place it in `plugins/`. Start the server and test with a friend.

### Enhancements

- Add multiple homes per player (`/sethome <name>`)
- Add cooldowns and costs
- Integrate with LuckPerms for per‑group limits

You now have a practical plugin players will use every day—and a foundation to grow from.


