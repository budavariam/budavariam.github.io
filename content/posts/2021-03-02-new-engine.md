---
layout: post
title: New Blog Engine
tags: [ template, hugo ]
date: 2021-03-02
cover:
    image: /images/2021-03-02-new-engine/cover.png
    alt: Footer from my previous blog engine
    hidden: false
---

A few weeks ago I came across a post about recommended static site generators.
I decided to reevaluate my previous choice for a blog engine.
I've used [Jekyll](https://jekyllrb.com/) and
[Gatsby.js](https://www.gatsbyjs.com/) before, now I wanted something new.

<!--more-->

I used Jekyll for my first theme only because at that time
(without [github actions](https://github.com/features/actions)),
it was the simplest way to push content into
[github pages](https://pages.github.com/)
from a repo wthout buildng it on my machine.

## Hugo PaperMod

Many people recommended [Hugo.go](https://gohugo.io/), I decided to give it a try.
After browsing for a while in the themes [Papermod](https://themes.gohugo.io/hugo-papermod/)
caught my eye. It has a similar minimalistic vibe, as my previous site,
but also has many embedded features out of the box. :tada:

![Previous header](/images/2021-03-02-new-engine/header.png)

I [forked it](https://github.com/budavariam/hugo-PaperMod/tree/budavariam)
and started to tweak it, to keep the features I liked in my previous page.

My first impression is that hugo is really blazing fast.

### Templating

It took me some time to figure out the logic behind the templating.
I spent the most time with the social icons, to keep the feature,
that I only need to specify the username, and it uses the proper icon AND the proper URL.
Later on I got so confident in this strange syntax,
I even implemented inverse logarithmic scale coloring for tag numbers,
so small differences stand out more than with a simple linear scale.

### SVG icons

I had some extra logic to be able to modify svg icons separate from the code,
I just needed to replace a few lines of code, to make it work.

I hopped on the chance to add [svgo](https://www.npmjs.com/package/svgo) to the mix,
to generate optimized svg-s to the site, no matter what I save in my folder.

### Deployment

For deployment Jekyll has first level support from github.
Github actions has templates for hugo deployment, it works just fine.

It kept me thinking what I did wrong when I got a 404 in the first deploy.
`peaceiris/actions-gh-pages@v3` by default pushes to a separate `gh-pages` branch, and I needded to adjust my repo settings, to load giithub pages from that location.

## New features

I dedicate this chapter to the new feature I love in PaperMod, that I did not have before.

- sexier typography, nice looking components
- cover images
- scroll to top button
- quick search
- autodetect or switch between dark mode/lightmode
- read time for posts
- emoij parser
- paginated view for all posts
- post archive
- tags / show posts by tags
- embed shortcodes (components) into markdown

![New look and feel in dark mode](/images/2021-03-02-new-engine/new-look.png)

I hope you like the new look and feel as much as I do.

Happy coding!
