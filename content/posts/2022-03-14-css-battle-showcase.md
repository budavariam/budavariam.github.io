---
layout: post
title: CSS Battle Showcase
tags: [css-battle, css, next.js, react.js, tailwind.css]
cover: 
    image: /images/2022-03-14-css-battle-showcase/cover.png
    alt: Cover
    hidden: false
date: 2022-03-14
---

I came across [CSS Battle](https://cssbattle.dev) last year. I tried code golfs before, but this is a whole new level.

<!--more-->

It reminds me of [suicide chess](https://en.wikipedia.org/wiki/Losing_chess). You have the same building blocks, as the original but you have to think in reverse, in a completely different way.

What makes your code beautiful and readable are a burden in this game.

## What is CSS Battle

>The objective of the game is to write HTML/CSS to replicate the given target image in the least code possible.

It sounds simple, isn't it. They restrict using JavaScript, SVG-s, images, canvas, or anything that would make it simple to draw shapes. You need to rely on basics CSS and HTML to make your playground get a 100% pixel perfect match with their given image.

## It sounds horrible, what is good in it?

Some say you need to break things to get to know them better.

You can learn more about different shorthand syntaxes and makes you dive deeper into the inner mechanics of how CSS and HTML really works.

You have to know the rules so that you can break them.

## Tips I found useful

Since you need to write the shortest code possible, it will be inevitably ugly and mostly unreadable.

Some reminders and tips that I read, or figured out myself that made my solutions shorter:

- You need to remove all whitespaces, because they're counted as well.
- You don't need to write valid xHTML, it just need to render. e.g: the `<p>` tags are working fine without closing tags
- You have a fixed sized layout, you can use magic numbers
- Shorthand syntax is your friend:
  - The `inset` is shorthand for `top`/`right`/`bottom`/`left`.
  - For directional items 1 repeats for all, 2 stands for (y,x) axis from top to bottom, left to right
- `padding` can be used for size instead of: `width`/`height`
- `margin`/`inset` can be used for positioning instead of: `top`/`right`/`bottom`/`left`
- You can omit units, it will be `px`
- You can omit quotes
- You can omit values, mostly it will be what the property name is.
- You can omit the last `;` from CSS rules
- You don't always have to use closing tags in HTML
- You don't need to write `class`-es:
  - `<a b>` can be matched with `a[b]{}`
  - `<a id=b>` can be matched with `#b{}`
- `<body bgcolor=111111>` is shorter than `body { background-color: "#111111"; }`
- You can target all items with `*`
- `::before`/`::after` and `border` are good building blocks

## Showcase Application

My code is not golfy enough yet. Also I don't have many people to race against, so I decided to put up my solutions to github.

I decided to create a showcase site for it. I took this opportunity to get started with [next.js](https://nextjs.org/) static-site-generator and [tailwind.css](https://tailwindcss.com/) css utility library.

It shows the original image, renders my solution and prints it with syntax [highlight.js](https://highlightjs.org/).

I might add some thoughts on the different tasks, wth some details on how I approached the problems.
The code contains mdx renderer, so I can add my thoughts easily next to the code in a moslty generic way.
I like the dark/light mode integration with the code highlghter, andd tailwind's support of it.

You can reach the [DEMO](https://budavariam.github.io/css-battle-showcase/) site here.

Or browse [my solutions](https://github.com/budavariam/css-battle-showcase/tree/main/public/solutions) over here on Github.

## Resources for CSS

- [web.dev: learn CSS](https://web.dev/learn/css/). An awesome and detailed css course.
- [MDN docs](https://developer.mozilla.org/en-US/docs/Web/CSS). The best webdev reources.
- [CSS Specification as of 2021](https://www.w3.org/TR/css-2021/). The source of thruth.

## Summary

When I first found this game I thought of creating a tool to minify my code. I don't know if I'm going to get better at this game first or make the tool happen.

I enjoyed creating the next.js site. Tailwind is simpler than I first imagined.
I'd like to thank [ChangoMan](https://github.com/ChangoMan/nextjs-typescript-mdx-blog) for the starter code, that contained what I imagined to get started.

Happy coding!
