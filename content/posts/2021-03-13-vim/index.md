---
layout: post
title: Vim
tags: [ developer-toolbox, text-editor, vim ]
cover:
    alt: O RLY funny book cover parody about exiting vim is hard
    attr: Practical DEV Twitter
    attrlink: https://twitter.com/ThePracticalDev/status/747843812219813888/photo/1
    hidden: false
resources:
  - name: cover
    src: cover.jpeg
featured:
  - "home"
featured_weight: 2
date: 2021-03-13
---

My first memory with vim is in early 2010s, I was just learning git, and I messed up my repo badly,
a colleague came to help, he told me seemingly random sequence of characters to type,
and suddenly everything went back to normal. Git's default editor was vim and I think we did an interactive rebase.
We might have just fixed it in an other way, but still it felt powerful.
Later on I saw vim books at the operators' desks, and I got really curious of what it is and how can it help my daily work.

<!--more-->

## Getting started

Vim is a modal text editor, that is available by default in most Linux distributions

Keys mean different commands in different **modes**,
there are a few key points to know for basic usage:

- vim starts in `NORMAL` mode
- in `NORMAL` mode `:` enters `COMMAND` mode, type `:wq` save file and quit or `:q!` to quit without saving
- `q:` opens the command line, close it with `ctrl-c`
- in `NORMAL` mode press `i` to change to `INSERT` mode, navigation keys and backspace characters work as expected
- go back to `NORMAL` mode with `ESC`
- in `NORMAL` mode type `/` to start a search, press `n` for the next match, and press `N` for the previous match
- in `NORMAL` mode press `u` to undo the changes made, `ctrl-r` to redo the reverted changes

{{< figure
    src="vim-modes.png"
    caption="vim modes"
    attr="aantipov"
    attrlink="https://dev.to/aantipov/vim-modes-diagram-5hhc"
    height="300px"
    align="center"
>}}

## The catch

When you open a file with vim, you can not see what are your options, what key combinations can you use.

You have to understand many things all at once, an there's no onboarding in the application.
When you open it up, and start to type, some characters might not show up, and the cursor navigates away.
It's not even clear how to exit this hellhole.

You have to read throgh the manual, find some getting started guides or cheatsheets.

After you fight yourself through the initial difficulties, you can unleash its true power.

## Why I love it

It gives me a no config editor, that I can just install anywhere.
Most of the time it's already installed and I'm ready to be productive in no time.

I like touch typing, and I can benefit from it, since I can keep my hands in the home row.
I can use the characters for actions, without relying on key chords.

Its keybindings are supported by many tools and sites.
It can be used even in bash command line with `set -o vi`.

## How I learned it

When I was working with servers most of my time I felt the need to edit files on them more effectively.
Editing files locally then moving them back and forth was not convenient.

I got to know simpler editors like [nano](https://en.wikipedia.org/wiki/GNU_nano),
but later on I desperately wanted to learn vim.

### Beginnings

When I started out, I searched for some good materials over the internet. This image perfectly depicts my experence.

{{< figure
    src="vim-learning-curve.jpeg"
    caption="vim learning wall"
    attr="pascalprecht"
    attrlink="https://pascalprecht.github.io/posts/why-i-use-vim"
    height="300px"
    align="center"
>}}

At first I started using `vimtutor`.
It's a command line utility that opens vim with an onboarding text as a sandbox,
it's installed alongside vim by default.
I went through it once per day for 2 weeks, it felt hard in the beginning, but got less painful later on.

```text
===============================================================================
=    W e l c o m e   t o   t h e   V I M   T u t o r    -    Version 1.7      =
===============================================================================

     Vim is a very powerful editor that has many commands, too many to
     explain in a tutor such as this.  This tutor is designed to describe
     enough of the commands that you will be able to easily use Vim as
     an all-purpose editor.

     The approximate time required to complete the tutor is 30 minutes,
     depending upon how much time is spent with experimentation.

```

### Over the basics

I disabled arrow keys to force myself learn to navigate with `h`, `j`, `k`, `l` keys.
I can tell you force is not the best way to learn, but I was determined, and wanted to try to out.

I mapped my capslock key to escape, because my wrist got tired of the twisting moves.
I read, that they chose escape because on early keyboards it was located closer to the home row.

{{< figure
    src="KB_Terminal_ADM3A.svg"
    caption="ADM3A key mapping"
    attr="wikipedia"
    attrlink="https://en.wikipedia.org/wiki/ADM-3A"
    width="75%"
    align="center"
>}}

These made me pick up the good habit of entering INSERT mode only when I really needed it.

### Good influence

I was happy with this level, used it once or twice for simple things over the next year, but not too much.

The next phase started when I started to work at another company and one developer used vim as his IDE.

I was determined to dust off my knowledge, and start to learn it again.
And I really mean again, sadly my muscle memory faded almost completely.
It's a skill that you need to practice constantly.

### Practice

I found the amazing [rtorr cheatsheet](https://vim.rtorr.com/).
And decided to write out my favourite combos into
[github](https://github.com/budavariam/learn-vim/blob/master/vim-cheatsheet.md).
While I was looking for productivity tips,
[fandom wikia vim tips](https://vim.fandom.com/wiki/Vim_Tips_Wiki) page was really helpful.

{{< hgist 300px budavariam 9fbf38f35749bdb62f10d93d1657a39a >}}

I even created a
[small python scipt](https://github.com/budavariam/learn-vim/blob/master/practice.py)
to practice them as flash cards, but I guess I'll be the only one ever who plays with it.

When I changed my blog I found [fuse.js](https://fusejs.io/), a fuzzy finder library.
As a practice I created a [mini site](https://budavariam.github.io/learn-vim/) for my cheatsheet.

I know people who use
[VIM keybindings in VSCode](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim),
but it don't really like it,
because it messes up my beloved multi-cursor editing, and makes me less productive.
What I love in VSCode is that it evolves month by month without my supervision,
but third-party tools/configsets usually do not keep up quickly.

## Side effects

There are some patterns I spotted over the years on the servers,
that made me suggest that those were edited by people who only occasionally use vim.

- `hjkl` keys in random locations, sometimes even causing typos in variables
- no identation in blocks, although it's fairly simple with vim
- too much whitespace at the end of the lines

## Editor wars

From time to time there are huge debates between whether vim or
[emacs](https://www.gnu.org/software/emacs/) is the ultimate superior editor.
I think it comes down to preference and experience with these tools.

I invested time and energy to learn vim because I saw potential in it after the first try.
I don't say that other editors are worse, it's just happend to be a great fit to my usecases.

I learned many `emacs` key combos over the years, since they work by default in the terminal.
But I did not yet took the time to get to know it more.

If you like modern tools, `vim` has a hyper extensible version called [neovim](https://neovim.io/).

Happy coding!
