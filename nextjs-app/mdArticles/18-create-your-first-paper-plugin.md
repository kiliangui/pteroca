---
title: "Create your first Paper plugin: a simple command plugin"
description: "Make a tiny Paper plugin that adds a /hello command. Learn the project structure, build tools, and API basics."
slug: "create-your-first-paper-plugin"
date: "2025-09-07"
updated: "2025-09-07"
authors:
  - "HostChicken Editorial Team"
category: "Plugins"
tags:
  - "paper"
  - "spigot"
  - "plugin development"
image: "/og/hostchicken-blog.png"
canonical: "https://hostchicken.com/blog/create-your-first-paper-plugin"
seo:
  title: "Create your first Paper plugin | HostChicken Blog"
  description: "A beginner guide to a simple command plugin with Paper."
  keywords:
    - "paper plugin tutorial"
    - "spigot plugin hello command"
    - "HostChicken"
  twitterCard: "summary_large_image"
  og:
    title: "Create your first Paper plugin"
    description: "Project setup, API, and a /hello command."
    image: "/og/hostchicken-blog.png"
robots:
  index: true
  follow: true
---
## Create your first Paper plugin: a simple command plugin

Writing a Paper plugin is a great way to customize your server with features you can’t get from existing plugins. We’ll create a tiny plugin that adds a `/hello` command, covering the tools you need and the structure of a typical Paper project.

### What you need

- Java 17+
- Gradle or Maven (we’ll show Gradle)
- Paper API dependency
- An editor (IntelliJ IDEA recommended)

### Project setup (Gradle)

Create a new Gradle project and add the Paper API:

```gradle
plugins {
    id 'java'
}

group = 'com.example'
version = '1.0.0'

repositories {
    mavenCentral()
    maven { url = uri('https://repo.papermc.io/repository/maven-public/') }
}

dependencies {
    compileOnly 'io.papermc.paper:paper-api:1.20.1-R0.1-SNAPSHOT'
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}
```

### Basic plugin class

Create `src/main/java/com/example/HelloPlugin.java`:

```java
package com.example;

import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.plugin.java.JavaPlugin;

public class HelloPlugin extends JavaPlugin {
    @Override
    public void onEnable() {
        getLogger().info("HelloPlugin enabled!");
    }

    @Override
    public void onDisable() {
        getLogger().info("HelloPlugin disabled.");
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (command.getName().equalsIgnoreCase("hello")) {
            sender.sendMessage("Hi there! Have fun on the server.");
            return true;
        }
        return false;
    }
}
```

### plugin.yml

Create `src/main/resources/plugin.yml`:

```yaml
name: HelloPlugin
version: 1.0.0
main: com.example.HelloPlugin
api-version: 1.20
commands:
  hello:
    description: Say hello
    usage: /hello
```

### Build the jar

Run:

```bash
./gradlew build
```

The plugin jar will appear in `build/libs/`. Copy it to your server’s `plugins/` folder and start the server.

### Test in game

- Join your server and run `/hello`.
- You should see the friendly message.

### Next steps

- Register a command executor class instead of using `onCommand` for larger plugins.
- Listen to events (e.g., `PlayerJoinEvent`) to react to gameplay.
- Add a config file to customize messages.

### Tips for success

- Never run blocking I/O on the main thread. Use async tasks for database or web calls.
- Keep logs informative but not spammy.
- Start small; iterate with version control.

With this foundation, you can build commands, events, and features tailored to your server. In the next article, we’ll expand this into a `/home` plugin.


