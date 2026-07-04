---
layout: post
title: Split and Conquer
tags: [developer-toolbox, productivity, vim, tmux, iterm2, cheatsheet]
cover:
  alt: Terminal splits and panes
  hidden: false
resources:
  - name: splits-overview
    src: splits-overview.png
  - name: iterm-tmux-cc
    src: iterm-tmux-cc.png
  - name: vim-tmux-nav
    src: vim-tmux-nav.png
date: 2026-06-09
draft: false
---

I keep forgetting split shortcuts. Not all of them, just the awkward ones — the ones I reach for maybe once a week.
They live in that gap between "not used often enough to memorize" and "too useful to stop using."
This post is my cheat sheet for split management across Vim, tmux, and iTerm2.

<!--more-->

I've written about [Vim](/posts/2021/03/13/vim/) and [tmux](/posts/2021/02/27/think-outside-the-box/) separately before.
This post zooms in on the one thing I keep blanking on: how splits work in each tool and how they compare.

{{< figure
    src="splits-overview.png"
    caption="Vim splits, tmux panes, and iTerm2 splits side by side"
    align="center"
>}}

## Choosing your layer

On a typical Mac setup you might have all three running at once: Vim inside a tmux pane inside an iTerm2 tab.
Each layer can split independently, which is fine until you forget which tool currently owns your focus.

A few things that reduce the friction:

**Prefer `tmux -CC` over bare iTerm2 splits.**
Running tmux in *control mode* (`tmux -CC`) tells iTerm2 to render tmux panes as native iTerm2 splits.
You keep tmux's session persistence and you get iTerm2's rendering, font smoothing, and mouse support.
I covered iTerm2's newer features in [Boost Developer Workflow](/posts/2025/01/15/boost-dev-workflow/) —
`-CC` mode fits right into that setup.

Open a new session with:

```bash
tmux -CC new -s work
```

Or attach to an existing one:

```bash
tmux -CC attach -t work
```

{{< figure
    src="iterm-tmux-cc.png"
    caption="tmux -CC renders tmux panes as native iTerm2 splits"
    align="center"
>}}

**Use vim-tmux-navigator to unify Vim and tmux navigation.**
The [vim-tmux-navigator](https://github.com/christoomey/vim-tmux-navigator) plugin replaces the separate
`Ctrl+w hjkl` (Vim) and `Ctrl+b Arrow` (tmux) with a single set of bindings that works across both:

```vimscript
" Add to .vimrc (or let the plugin manager handle it)
" Then use Ctrl+h/j/k/l to jump between Vim splits AND tmux panes
" No need to think about which tool has focus
```

The tmux side requires a small addition to `~/.tmux.conf` — the plugin README covers it.

{{< figure
    src="vim-tmux-nav.png"
    caption="vim-tmux-navigator: Ctrl+h/j/k/l jumps across Vim and tmux seamlessly"
    align="center"
>}}

**Conceptual model for each tool:**

- **Vim** — `Ctrl+w` is the window prefix. Lowercase `hjkl` navigates, uppercase `HJKL` *moves* the split to an edge. This distinction trips people up constantly.
- **tmux** — `Ctrl+b` is the prefix. Everything is stateful and survives disconnects. Zoom (`Ctrl+b z`) is non-destructive — it hides other panes without closing them. See [Think Outside The Box](/posts/2021/02/27/think-outside-the-box/) for the broader tmux picture.
- **iTerm2** — Mac-native shortcuts (`Cmd+D`, `Cmd+Shift+D`). Best used as the outermost layer or via `-CC` integration.

---

## Opening with splits pre-loaded

Sometimes you want to jump straight into a layout without building it by hand every time.

### Vim

Pass multiple files on the command line and Vim opens each in its own split:

```vimscript
vim -O file1.txt file2.txt    " vertical splits (side by side)
vim -o file1.txt file2.txt    " horizontal splits (stacked)
```

You can also fire a command at startup with `-c`:

```vimscript
vim -c "vsplit file2.txt" file1.txt
```

For a full layout you want to come back to, save and restore a session:

```vimscript
:mksession ~/sessions/work.vim   " save current splits and buffers
vim -S ~/sessions/work.vim       " restore on next launch
```

### tmux

Chain pane-split commands in a one-liner to get a layout in one shot:

```bash
tmux new-session \; \
  split-window -h \; \
  split-window -v \; \
  select-pane -t 0
```

Wrap it in a shell function for a project-specific dev layout:

```bash
function dev() {
  tmux new-session -d -s dev \; \
    send-keys "vim ." Enter \; \
    split-window -h -p 35 \; \
    split-window -v \; \
    select-pane -t 0 \; \
    attach-session -t dev
}
```

For more complex or team-shared layouts, two plugins handle this well:

- **[tmuxinator](https://github.com/tmuxinator/tmuxinator)** — YAML config per project, one command restores the full layout with commands running in each pane.
- **[tmux-resurrect](https://github.com/tmux-plugins/tmux-resurrect)** — saves and restores sessions across reboots with no per-project config required.

---

## Split Management Reference

| Action                    | Vim                     | tmux                           | iTerm2            |
| ------------------------- | ----------------------- | ------------------------------ | ----------------- |
| **Open horizontal split** | `:split` or `Ctrl+w s`  | `Ctrl+b "`                     | `Cmd+Shift+D`     |
| **Open vertical split**   | `:vsplit` or `Ctrl+w v` | `Ctrl+b %`                     | `Cmd+D`           |
| **Close split**           | `:q` or `Ctrl+w q`      | `Ctrl+b x`                     | `Cmd+W`           |
| **Full focus (zoom)**     | `Ctrl+w o` or `:only`   | `Ctrl+b z`                     | `Shift+Cmd+Enter` |
| **Move split left**       | `Ctrl+w H`              | `Ctrl+b {` (swap)              | -                 |
| **Move split right**      | `Ctrl+w L`              | `Ctrl+b }` (swap)              | -                 |
| **Move split up**         | `Ctrl+w K`              | -                              | -                 |
| **Move split down**       | `Ctrl+w J`              | -                              | -                 |
| **Jump to split left**    | `Ctrl+w h`              | `Ctrl+b Left`                  | `Cmd+Opt+Left`    |
| **Jump to split right**   | `Ctrl+w l`              | `Ctrl+b Right`                 | `Cmd+Opt+Right`   |
| **Jump to split up**      | `Ctrl+w k`              | `Ctrl+b Up`                    | `Cmd+Opt+Up`      |
| **Jump to split down**    | `Ctrl+w j`              | `Ctrl+b Down`                  | `Cmd+Opt+Down`    |
| **Cycle splits forward**  | `Ctrl+w w`              | `Ctrl+b o`                     | `Cmd+]`           |
| **Cycle splits backward** | `Ctrl+w W`              | -                              | `Cmd+[`           |
| **Resize split left**     | `Ctrl+w <`              | `Ctrl+b Ctrl+Left`             | -                 |
| **Resize split right**    | `Ctrl+w >`              | `Ctrl+b Ctrl+Right`            | -                 |
| **Resize split up**       | `Ctrl+w +`              | `Ctrl+b Ctrl+Up`               | -                 |
| **Resize split down**     | `Ctrl+w -`              | `Ctrl+b Ctrl+Down`             | -                 |
| **Equalize splits**       | `Ctrl+w =`              | `Ctrl+b Space` (cycle layouts) | -                 |

---

## Notes worth calling out

- In **Vim**, uppercase `HJKL` with `Ctrl+w` *moves* the pane to the edge in that direction,
  while lowercase `hjkl` *navigates* to a neighboring pane.
  This is a common source of confusion — same keys, completely different behavior.
  The [Vim post](/posts/2021/03/13/vim/) has more on the broader modal key model.

- **Full focus behavior differs** across the three tools. tmux's zoom (`Ctrl+b z`) is a toggle
  that hides and unhides panes without closing them. Vim's `:only` / `Ctrl+w o` actually closes
  all other splits. iTerm2's `Shift+Cmd+Enter` is a visual toggle like tmux.

- In **tmux**, `Ctrl+b {` / `Ctrl+b }` swaps the current pane with the previous/next one,
  which is the closest native equivalent to directional pane moving.

- **iTerm2** has no built-in directional resize shortcuts by default,
  but you can add custom key bindings under `Preferences > Keys`.

Happy coding!
