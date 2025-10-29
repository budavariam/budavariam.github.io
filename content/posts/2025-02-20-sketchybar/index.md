---
layout: post
title: Sketchybar
tags: [my-solution, productivity, customization, tool, macOS, dotfiles]
cover:
    alt: Cover
    hidden: true
resources:
  - name: cover
    src: cover.jpeg
date: 2025-02-20
draft: true
---

A few weeks ago I came across a tool called `Sketchybar`.
I did not think I needed it, then I got hooked.

<!--more-->

## First Thoughts

My initial thought was that I love the way how the macOS toolbar works, 
it's good enough for me. Then I realized that most of the time the icons I need are hidden

At first I thought it did not work, as the toolbar showed up at all times. Rookie mistake.

## What is this

I started to play with the layout, the looks.

I started to collect plugins from others, then the turning point came when I started to write my own plugins.

## Plugin development

Basically you can access the toolbar with the `sketchybar` cli command, and customize it from the command line.

For configuration you can write shell scripts to implement your desired behaviour

You can find my current configuration at my
[dotfiles](https://github.com/budavariam/dotfiles/tree/master/_mac/sketchybar/.config/sketchybar) github repository.

## My custom plugins so far

- logo with notification: send a notification message to show up in the toolbar
- exchange rate tracker: track how other currencies compare to mine,
  showing the change direction with colors that fade away over time
- weather information: track current weather info with colorful logo
- spotify track info and control: see the now playing music
- current vpn and wifi information
- cpu usage info: get the avg percent of current usage if I hover the mouse to the cpu icon
- aerospace workspace info: see the current workspace ID,
  list the apps in a dropdown on click, and focus the selected workspace and app on click

## Debug experience

- I separated the setup to `items` and `plugins` directories.
  The **items** define the initial look and feel, and the **plugins** define the inner working
- Make sure to add execution privileges to the shell scripts you write: `chmod +x plugins/*.sh`
- during development if I develop the plugin I don't need to reload the app,
  as it's running the latest version (if I need to change the items then I need to run again)

  ```bash
  # run debug code in the app
  echo "$SENDER $NAME $1" >> /tmp/.debug_sketchybar

  # start sketchybar from CLI to see the messages
  sketchybar --reload && rm /tmp/.debug_sketchbar && touch /tmp/.debug_sketchybar && tail -f /tmp/.debug_sketchybar
  ```

## Conclusion

Beware, it's addictive! You'll always see something to tweak.

Happy coding!