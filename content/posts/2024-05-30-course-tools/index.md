---
layout: post
title: Online Training Course Tools
tags: [ programming, teaching, my-solution ]
date: 2024-05-30
---

## Create the presentation from Markdown

RevealJS

- [Print slides](http://localhost:9999/?print-pdf-now)

## Present From a Single Laptop

- [DeskPad](https://github.com/Stengo/DeskPad)

## Command Line Code Examples

ASCIINEMA

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