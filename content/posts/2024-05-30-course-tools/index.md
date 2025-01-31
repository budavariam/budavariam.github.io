---
layout: post
title: Online Training Course Tools
tags: [ programming, teaching, my-solution ]
cover: 
    alt: Aerial View of Tropical Beach with Palm Trees
    hidden: false
resources:
  - name: cover
    src: cover.png
date: 2024-05-30
---

It's time of the year that I'm preparing to share my knowledge arcoss the company.
I tend to forget the goodies that worked for me I'll collect them here to simplify my workflow.

<!--more-->

## Create the presentation from Markdown

RevealJS

- [Print slides](http://localhost:9999/?print-pdf-now)

You can add CSS classes to control the presentation

```md
![Image that stretches](./bunny.png) {.stretch}
- List item that shows up later {.fragment}
- List item that shows up later {.fragment}
```

You can define a frontmatter definition in the top:

```yaml
---
theme: "white"
transition: "none"
highlightTheme: "monokai"
customTheme: "overrides"
logoImg: "./images/logo.png"
slideNumber: true
center: false
title: "Presentation"
---
```

## Present From a Single Laptop

- [DeskPad](https://github.com/Stengo/DeskPad) is a great tool to share a virtual screen with others.
So that on my screen I can manage all other relevant information like:

- the app for the online meeting
- the notes for the class
- preparing the examples for the next task without the audience having to watch me collect them

## Command Line Code Examples

[ASCIinema](https://asciinema.org/) is an awesome tool to record the shell.

### How To Record

```bash
asciinema rec ./demo.cast -i 2 -c "PS1='\[\033[01;34m\]\w\[\033[00m\]\$\n> ' bash"
```

- idle-time-limit to compress waiting time in the recording to this number
- command: to use for the current shell
- `ctrl + \` - pause recording

### How To Play The Recording

```bash
asciinema play ./demo.cast
```

### How To Play The Recording In the presentation

[ASCIInema player](https://github.com/asciinema/asciinema-player)

## Recording the session

- Teams and Zoom apps can record the sessions

## Final words

Happy coding!

{{< photo_credit
    img-site="Pexels"
    artist-name="Juraj Vice"
    artist-url="https://www.pexels.com/@juraj-vice-1310046759/"
    img-url="https://www.pexels.com/photo/aerial-view-of-tropical-beach-with-palm-trees-30447886/"
>}}
