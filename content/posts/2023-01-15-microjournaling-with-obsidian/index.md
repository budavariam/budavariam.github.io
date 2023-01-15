---
layout: post
title: Microjournaling With Obsidian
tags: [productivity, obsidian, markdown, android]
cover:
    alt: Closeup obsidian
    hidden: false
resources:
  - name: cover
    src: cover.jpg
date: 2023-01-15
draft: false
---

This week I listened to the Art of Manliness podcast ep. [#867](https://www.artofmanliness.com/character/habits/7-journaling-techniques-that-can-change-your-life/) about journaling techniques that could change your life.

It really resonated with me, and got me thinking about doing something about my bad habits and stepping on the path I'd like to walk.

<!--more-->

## Takeaways from the Podcast

In this podcast [Campbell Walker](https://www.instagram.com/struthless69/) taks about his experiences, his book, and shares actionable tactics to make the most out of journaling.

{{< rawhtml >}}
<iframe height="200px" width="100%" frameborder="no" scrolling="no" seamless src="https://player.simplecast.com/23d9162a-17f4-4c72-9885-c2b4065e9d87?dark=true"></iframe>
{{< /rawhtml >}}

### Switch up bad habits with better ones

Sometimes my autopilot just opens up my phone and and goes through its clicking routine, switching between apps, without gaining anything out of it.
My brain just wants to get a little endorphine boost.
What I came to realize is that it's a complete waste of time, and I end up learning something I didn't even wanted to hear about. Or just reading about other people's complaints or bits of their lifes without any interaction just filling my head with noise.

For some time killer apps I uninstalled the dedicated apps, this way their functionalities are much limited and more painful to use.

For the ones I kept, I set up timers to warn me after 30 minutes.
Also I made sure that the worst time killer apps are not in reach, and I have to deliberately search for them.

To tackle this mindless clicking I want to channel this energy to `create notes`,
and think about my ongoing issues whenever I feel like I have a few minutes to use my phone.

If I have more time I'll read my ebooks using [ReadEra](https://play.google.com/store/apps/details?id=org.readera&hl=en&gl=US) app.

### Microjournaling

Our minds are not meant to store information, although it's pretty good in capturing ideas.
These ideas tend to stick with us until we do something with them, holding on a huge portion of our bandwidth.

Sometimes small thoughts are bothering me, but if they only exist in my head it's
harder to see them objectively, and I might exaggerate them.

If I write these down I can see them objectively, issue a priority to them, and handle them accordingly.

For journaling, any note with more than a single word will do just fine.

There are no rules, whatever format works for you is fine, just write down your thoughts.

## My tools

I've used [Google Keep](https://keep.google.com/) extensively for note taking.
Although nowadays these notes went out of my hand and I left them unorganized.

I don't like that it's only available in its dedicated site and its separated application.

I don't want to get started with Notion for this purpose for the same reason.

I've been thinking about adapting [Obsidian](https://obsidian.md/) ever since I heard about its [graph view](https://help.obsidian.md/Plugins/Graph+view).

It's sad that it does not have good integration with VSCode, but it has a nice dedicated app for it that works for this purpose. And I understand that the target audience might not be just programmers.

## Obsidian

My favourite documenting format is markdown.
I'm in the process on unifying my personal knowledge base.

These microjournaling realizations made me think about getting started with markdown journaling on my phone.

Obsidian feels to be the perfect test subject.

### Daily Notes

What I like the most is that I can set up a [Daily note](https://help.obsidian.md/Plugins/Daily+notes) with any template I wish.

I started with a simple one:

```md
## What drained me
## What am I grateful for
## What did I learn
## What decisions I made or should I make
```

If I open the app in any given day it gives me this default note.

### Sync Obsidian

I saw that there's an option to sync to Obsidian cloud for a monthly fee, but my whole point of moving away from Google Kepp to take control of my data does not play well with this idea. So I started to see what are my options.

- Obsidian cloud sync for $8/month
- [GitJournal](https://gitjournal.io/), a promising open source app

Upon further investigation I realized I could simply use git to store my data.
Sadly the Github app is not usable for this purpose but 
[Termux](https://termux.dev/en/) is configurable to help out.

### Termux Git Sync in Android

It was not a trivial setup, I write down what worked for me.
I had Termux installed before it was deprecated to use if from the PlayStore.

1. Download [Obsidian app](https://play.google.com/store/apps/details?id=md.obsidian&hl=en&gl=US) and create a new vault
1. Setup Termux storage access with: `termux-setup-storage`
1. Install git and ssh in Termux

   ```bash
   # NOTE: the PlayStore version has outdated repo urls
   #       https://github.com/termux/termux-packages/issues/6726
   echo "deb https://grimler.se/termux-packages-24 stable main" > $PREFIX/etc/apt/sources.list
   echo "deb https://grimler.se/termux-packages-24 stable main" > $PREFIX/etc/apt/sources.list.d/game.list
   echo "deb https://grimler.se/termux-packages-24 stable main" > $PREFIX/etc/apt/sources.list.d/science.list
   pkg update
   pkg upgrade
 
   pkg install git
   pkg install openssh
   ```

1. Create Github Limited Personal Access Token
   - [Github docs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
   - It has to have an expiration date

   > This is still in beta but as a precaution I do not to want to give access to my whole user

1. Create a new Github repo and push the journal content to it

   ```bash
   cd "~/storage/shared/Document/$VAULT_NAME"
   git init
   git remote add origin "https://$GH_USERNAME:$(cat "$GITHUB_PAT_LOCATION")@github.com/$GH_USERNAME/$REPO_NAME"
   git push --set-upstream origin main
   ```

1. Create a script to update the secret key easily one year from now:

   ```bash
   #!/bin/bash

   NEW_KEY=${1}
   NEW_URL=$(git remote get-url origin | sed -E "s/(:)github_pat[^@]+(@)/\1${NEW_KEY}\2/g")
   git remote set-url origin "${NEW_URL}"
   ```

1. Set up a yearly reminder to create new token using your preferred Calendar.

Optionally create scripts or shortcuts to simplify change handling with git.

## What I'll need to do later

- Move to F-Droid Termux app for keeping everything up to date

## Disclaimer

I had no affiliation with and podcast, product, site, tool, app mentioned in the blogpost.

I just wanted to share my experience and code I used to connect it together.

Happy coding!

Cover Photo by [Troy Squillaci](https://www.pexels.com/@troy-squillaci-1303476/) from [Pexels](https://www.pexels.com/photo/close-up-of-obsidian-4766367/)
