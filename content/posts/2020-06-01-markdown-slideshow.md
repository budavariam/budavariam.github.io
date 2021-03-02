---
layout: post
title: Markdown Slideshow
tags: [ markdown, slideshow, vscode ]
date: 2020-06-01
---

Today I've found an awesome library, called
[reveal.js](https://github.com/hakimel/reveal.js),
that lets me create slideshows in markdown format.
It has a
[VSCode plugin](https://marketplace.visualstudio.com/items?itemName=evilz.vscode-reveal),
that is intuitive to use.
My main purpose was to create a slideshow in plaintext format, and this lib exceeded my hopes.
<!--more-->
## VSCode plugin

The plugin adds a new item to the sidebar, that shows the outline of the opened document.
In the top bar there are options to present or save the presentation.

* Save to HTML
* Save to PDF
* Open presentation in the browser
* Open presentation to the side

The side presentation even syncs up with the cursor and shows only the current slide.

## Basics

For a basic overview of the possibilities the VSCode plugin promotes a sample file, that is available
[here](https://raw.githubusercontent.com/evilz/vscode-reveal/master/sample.md).

This is the first time I met this lib, and I haven't yet got time to dive in the docs,
here are the essential parts I needed:

* The markdown file has to start with a front-matter like this:

    ```yml
    ---
    theme: "night"
    transition: "slide"
    highlightTheme: "monokai"
    logoImg: "logo.png"
    slideNumber: false
    title: "My first markdown slide"
    ---
    ```

* To scroll the slides to the right, separate the pages with `---`, for bottom scroll use `--`.
* Markdown syntax can be used. So I can insert an image with:

    ```md
    ![Alt text](./images/file-location.png)
    ```

* Tables can be embedded as well.
* I needed to get rid of image borders. I added `customTheme: "overrides"` to front-matter,
and this css to `overrides.css` in the same folder as the presentation.
There might be a more sophisticated way, but it was fine for me.

    ```css
    .reveal section img {
        background: none;
        border: none;
        box-shadow: none;
    }
    ```

* To fragment a page I need to add `{.fragment}` at the end of the block I want to show later.

    ```md
    ### Trivia

    What is the answer to the
    Ultimate Question of Life,
    the Universe, and Everything?

    ... calculating {.fragment}

    ... still calculating {.fragment}

    42 {.fragment}
    ```

* To make sure that an image is fit to the whole screen add `{.stretch}` class to it

    ```md
    ![Alt text](./images/file-location.png) {.stretch}
    ```

* Some useful shortcuts during runtime:
  * To pause the presentation press `.`
  * To draw in the presentation press `c`
  * To show all slides and navigate easily press `ESC`

## What I missed during this first day

One thing I miss though is a simple way to build the presentation, to publish,
but I'm sure I'll figure something out when I'll need it.

Still it's an amazing tool, I'm grateful for its creators.

Happy coding!
