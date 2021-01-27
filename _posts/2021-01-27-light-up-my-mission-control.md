---
layout: post
title: Light Up My Mission Control
tags: productivity, theme
comments: true
---

I'm currently following the trends with my dev setup.
I use dark theme in almost all of my tools.
That make my [Mission Control](https://en.wikipedia.org/wiki/Mission_Control_(macOS)) a monochrome mess.
Most of my tools have theming options, so a few months ago I decided to light things up.

## The Problem

My general workflow in mac heavily relies on **finding** windows, and **switching** between them.
At a given time I usuallly have 10+ windows open.
With the embedded gestures, I can just swipe 3 fingers up and search for the appropriate window.

For 2 or 3 windows that I use often, I use **fullscreen** to access them quickly by swiping left/right with 3 fingers,
but more windows make it slower to find the necessary place to continue the work.

To make things even harder, for some reason mac **rearranges the windows** after every switch.

With dark theme everywhere, it's pretty **hard to distingush** between the different applications,
you have to rely on small random features.

![Image of monochrome mess](/assets/post/2021-01-27-light-up-my-mission-control-monochrome.png)

It's not fun to switch between these windows.

Unless you set **themes**!

My most crucial triad are: `Iterm2`, `Slack` and `VSCode`.
`Chrome` is top 4, but I currerntly I like its default dark theme.

## Iterm2 Tab Colors

In [iterm2](https://iterm2.com/) I use **vertical tab** arrangement.
That way more tabs can fit in the screen.
The tabs can have custom colors.

![Vertical tab custom colors](/assets/post/2021-01-27-light-up-my-mission-control-iterm2-colorful.png)

It might not help too much in the big picture,
BUT at least tabs are found easily.

## Slack Themes

My main motivation is to have a bright color that can be seen from a distance.

[Slack](https://slack.com/) has an option to customize its theme colors.

![Slack custom color selection](/assets/post/2021-01-27-light-up-my-mission-control-slack-themes.png)

Since themes are defined as a concactenated list of colors, 
there are many sites that hoost combinations with custom names.
You can definitely find one that suits your needs.

I really like the default `CMYK` theme

```text
#20252C,#0E0B01,#6BC9FF,#0E0B01,#0E0B01,#FCEBF9,#FCE54D,#CD2553,#D53C9F,#0E0B01
```

## VSCode Theme Customization

VSCode is my main IDE, generally 4+ instances are open at a given time.
I figured that [theme customization](https://code.visualstudio.com/api/references/theme-color#side-bar)
let me distingush between them.
By recoloring the sidebar, I was finally able to mark the projects I needed the most.

```json
{
    "activityBar.background": "#62bfda",
    "activityBar.foreground": "#15202b",
}
```

![VSCode sidebar](/assets/post/2021-01-27-light-up-my-mission-control-vscode.png)

### Peacock

[Peacock](https://marketplace.visualstudio.com/items?itemName=johnpapa.vscode-peacock) helps to automatize this flow.

I only want it to recolor the sidebar, luckily there are settings to disable recoloring the other parts.
I added these settings globally.

```json
{ 
    "peacock.affectAccentBorders": false,
    "peacock.affectStatusBar": false,
    "peacock.affectTitleBar": false,
}
```

It's pretty powerful tool, but my favorite part is that I can just ask it for a **random harmonic colorset**.

![Surprise me](/assets/post/2021-01-27-light-up-my-mission-control-peacock-random.png)

It writes to the settings file, and since it modifies the embedded theme settings,
it can work for colleagues that do not have this extension.

## Final thoughts

There is a saying, that if you mark everything, it's as efficient as not marking anything.
But I think this is not the case.
I like to think of these tweaks as multiple colorful bookmarks in a huge textbook.

![Final result](/assets/post/2021-01-27-light-up-my-mission-control-colorful.png)

I achieved my goal, I significantly reduced the time I need to look for small details,
I can spot the colors easily and navigate to the desired app.
