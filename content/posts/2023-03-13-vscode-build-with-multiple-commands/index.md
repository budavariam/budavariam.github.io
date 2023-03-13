---
layout: post
title: Vscode Build With Multiple Commands
tags: [my-solution, vscode, build, lit-element]
cover:
    alt: House floor plan
    hidden: false
resources:
  - name: cover
    src: cover.jpg
date: 2023-03-13
---

In the past few weeks, I became familiar with [LitElement](https://lit.dev/).
I love the [starter kit](https://lit.dev/docs/tools/starter-kits/), but I hate to start up the manual build tasks.
Nowadays, I work with VSCode a lost, so I tried to devise a convenient vendor locked-in solution for a change.

<!--more-->

## How I worked before

When I started development, I needed to take the following steps, which I now got bored of:

1. Opened the DEV.md file in the project to figure out what npm scripts I need
2. Open two different split shells
3. Copy and paste the build scripts into it

I just knew there has to be a way to automate these steps...

## VSCode Task

Here's the best I could come up with in about 10 minutes of searching around.

Here are the current [VSCode Tasks docs](https://code.visualstudio.com/docs/editor/tasks) for reference if it gets outdated.

This new setup does exactly what I need.

The key points to look at:

- The tasks have to be defined separately
- There has to be a task that depends on these tasks **by name**.
- The tasks have to be `"isBackground": true`, to avoid an endless spinner
- The tasks have to have a `presentation.group` defined in them with `"panel": "shared"` to match up
- An empty problem matcher is just an added bonus: `"problemMatcher": [],`
- You can make the aggregated task default with `"group": {"kind": "build", "isDefault": true}`

Here is the `.vscode/tasks.json` file:

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Serve",
            "type": "shell",
            "command": "npm run serve",
            "isBackground": true,
            "presentation": {
                "group": "builders",
                "reveal": "always",
                "panel": "shared",
            }
        },
        {
            "label": "Build:watch",
            "type": "shell",
            "command": "npm run build:watch",
            "isBackground": true,
            "presentation": {
                "group": "builders",
                "reveal": "always",
                "panel": "shared",
            }
        },
        {
            "label": "Build",
            "dependsOn": [
                "Serve",
                "Build:watch",
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
```

## Auto open

You can use your favorite shortcut to start the default build task. On Mac, it's `cmd+shift+B`.
It will open up the split terminals in the integrated Terminal upon this keystroke or from the `Tasks: Run Build task` command.

If it's too much effort, you can set the task up with `"runOptions": {"runOn": "folderOpen"}`. Whatever you prefer.

Just look out for `task.allowAutomaticTasks.on` in your settings not to get tricked.

## Conclusion

Enjoy.

Happy coding!

Cover Photo by [Pixabay](https://www.pexels.com/@pixabay/) from [Pexels](https://www.pexels.com/photo/house-floor-plan-271667/)