---
layout: post
title: Clipboard Goodies For Productivity
tags: [ developer-toolbox, multi-clipboard, cli, productivity ]
date: 2021-01-20
---

Have you ever typed ctrl-c instead of ctrl-v and had to recopy again?
Have you ever needed to copy and paste multiple entries at once from a page causing you to switch back and forth?
Have you ever needed to copy the output of a program running in the terminal?
I did, and got fed up with them almost 5 years ago, I'll show you how you can eliminate these problems.
<!--more-->
## Clipboard History

Most of my clipboard-related frustration came from the fact, that default clipboards
in the operating systems store only one entry at a time.
If I were to access the clipboard history, most of my problems were gone.
Luckily there are apps for that.

### OS Defaults

The latest version of **Windows 10** have a setting to make clipboard history
available in the `System` settings under `Clipboard history`.
It makes clipboard history available with `win+V` key.
Not too configurable, but perfectly usable.

On **Mac** you can use a secondary clipboard with `ctrl+k` (copy) and `ctrl+y` (paste),
alongside `cmd+c` (copy) and `cmd+v` (paste).
You can still only have 2 separate entries at once.

### Ditto

I started to use [Ditto](https://ditto-cp.sourceforge.io/) to eliminate this problem.
I loved that I could access my previous clips throughout the day.
It had configurable shortcuts to access the last 10 entries separately.
The only problem I had with it, that it **only worked for windows**.

### CopyQ

When I started to use [Ubuntu](https://ubuntu.com/) for my daily work I found
[CopyQ](https://hluk.github.io/CopyQ/),
a free open-source multiplatform clipboard manager. I use it daily ever since.

I love that it has a configurable
clipboard **size**, I can **search** through the entries,
and it has a configurable shortcut to `Show main window under mouse cursor` that can **speed up work**.

![Search through clipboard entries on mac](/images/2021-01-20-cipboard-goodies-copyq-find.png)

In case I copy **sensitive data**, I can turn off clipboard monitoring all at once with a configurable shortcut:
`Toggle Clipboard Storing`.

My only problem with it is that it sometimes tends to **quit unexpectedly on mac**.
According to their [github issues](https://github.com/hluk/CopyQ/issues/1563) they're working on it.

## Clipboard in the command line

In the command line you can take advantage of the operating system's pipeline.
Imagine *copy* as a utility that consumes text, and *paste* as one that produce text,
and when you use them the clipboard changes accordingly.

Let's see what are the exact utilities that can be used for different systems.

### Mac

Mac has built-in utility commands to `pbcopy` and `pbpaste` to the clipboard.

```bash
# copy text to clipboard by piping to `pbcopy`
echo "Text to copy" | pbcopy

# paste text from clipboard by piping from `pbpaste`
pbpaste | less
```

### Linux

On Linux that use [X window manager](https://en.wikipedia.org/wiki/X_window_manager) you can use [xclip](https://github.com/astrand/xclip).
In case you switch between Mac and Linux often, you can use aliases to keep things consistent.

```bash
# Install it with the available package manager.
# Add to e.g: ~/.bash_profile to load on startup
alias pbcopy='xclip -selection clipboard'
alias pbpaste='xclip -selection clipboard -o'
```

On linux servers that does not have window manager I did not yet see the point to investigate this further.

### Windows

Windows has builtin [clip.exe](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/clip).
Unfortunately, it can only copy TO the clipboard, can not read from it.

If you need access to the clipboard you need to use
[Get-Clipboard](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-clipboard?view=powershell-7.1)
powershell module.

```bash
REM copy to clipboard with clip.exe
echo "Text to copy" | clip

REM get data from clipboard
powershell -command "Get-Clipboard"
REM get data from clipboard into file
powershell -command "Get-Clipboard" > file.txt
```

#### Cygwin

If for some reason you still use [Cygwin](https://cygwin.com/cygwin-ug-net/using-specialnames.html),
you're in luck!
It makes Windows clipboard available as `/dev/clipboard`.

```bash
# copy text to clipboard by redirecting to `/dev/clipboard`
echo "Text to copy" > /dev/clipboard
# paste text from clipboard by reading from `/dev/clipboard`
cat /dev/clipboard
```

## Web Browsers

In web browsers you can use the modern
[Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
to interact with the clipboard.
Previously you could use
[document.execCommand()](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand)
but it's obsolete, that means it might still work, but it's discouraged.

For browser support see [clipboard at caniuse.com](https://caniuse.com/?search=clipboard).

For up to date and extensive examples see these pages sbove.

### Chrome DevTools

In Chrome developer Console you can use
[copy(object)](https://developers.google.com/web/tools/chrome-devtools/console/utilities#copy)
builtin function to put an object to the clipboard.

It can be handy during debugging.
Combined with [$0](https://developers.google.com/web/tools/chrome-devtools/console/utilities#dom) you can copy whole dom elements quickly.

```js
copy($0)
copy($0.value)
copy(window.myGlobalObject)
```

Happy coding!
