---
layout: post
title: Reveal.js CLI
tags: [ programming, markdown, slideshow, javascript, reveal.js, cli, my-solution ]
comments: true
---

Ever since I wrote about [VSCode Reveal](/posts/2020/06/01/markdown-slideshow/),
I wanted to have a command-line interface to generate the same output.
I loved that well-configured behavior and did not want to start from scratch. Finally, I had the time to do it.

## Getting started

The [revealjs-cli npm package](https://www.npmjs.com/package/revealjs-cli) is available here.

The [Github repo](https://github.com/budavariam/revealjs-cli) is available here.

Install

```bash
npm install revealjs-cli
```

Create a markdown file for the slideshow.

Access info about the available features via `--help` flag.

![revealjs cli help](/images/2020-12-17-revealjs-cli.png)

## Export slides

Run the tool with params to export

```bash
revealjs-cli \
    --build \
    --location ./slides-dist \
    --open ./path/to/markdown/slideshow.md
```

> NOTE: It removes the folder that the `location` is set to. It asks for permission before that happens. You can bypass it with `--yes` flag, for CI-friendly behavior.

## Export PDF

You can create a pdf with the browser's print feature.

It can be forced with `?print-pdf-now` queryparam at the end of the url.

## Serve Slides

If you specify `--serve` flag, or a port to serve on with `--port`, then the server will not shut down, and it can be accessed from e.g. a browser.

Happy sliding!
