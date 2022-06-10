---
layout: post
title: Sticky Table Of Contents Navigation in Hugo
tags: [ site-updates, hugo ]
cover: 
    image: /images/2022-06-10-sticky-table-of-contents-navigation-in-hugo/cover.jpg
    alt: A Person Scooping Out a Cheesy Pizza
    hidden: false
date: 2022-06-10
draft: false
---

Nowadays it's pretty common to have the Table Of Contents on the side, that follows the user's scrolling. I've decided to see what it takes to add it to my Hugo blog.

<!--more-->

At first I've looked around in the web, whether Hugo already supports it.
It seemed to me that it's not yet available by default, while some themes might support it due to their underlying framework that they use. 
For example Bootstrap has [ScrollSpy](https://getbootstrap.com/docs/4.5/components/scrollspy/).

## Inspiration

I've found this [great article](https://css-tricks.com/sticky-table-of-contents-with-scrolling-active-states/) on [CSS-tricks](https://css-tricks.com/) by [Chris Coyier](https://twitter.com/chriscoyier) that gave me a headstart on how it can be simply implemented.

{{< rawhtml >}}
<iframe height="300" style="width: 100%;" scrolling="no" title="Smooth Scrolling Sticky ScrollSpy Navigation" src="https://codepen.io/budavariam/embed/XWZyVbQ?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/budavariam/pen/XWZyVbQ">
  Smooth Scrolling Sticky ScrollSpy Navigation</a> by Mátyás Budavári (<a href="https://codepen.io/budavariam">@budavariam</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
{{</ rawhtml >}}

## My Tricky Part

For my hugo site I use a modified version of the [PaperMod](https://adityatelange.github.io/hugo-PaperMod/) theme.
Nowadays I do not follow it's updates while I have many of my own customizations in it.

### Sections

For sticky headers it's essential to know which item is currently visible in the browser.
I hadn't yet had that info. In markdown I can just embed many headers, and it's content won't have any knowledge in the DOM of where it is...

My layout looked like this:

```html
<h1>Title</h1>
<p>Paragraph</p>
<h2>Sub Title</h2>
<p>Another Paragraph</p>
<p>Yet another Paragraph</p>
<h2>Another Title</h2>
<p>Another Paragraph: Tokyo Drift</p>
```

Instead of something like this:

```html
<section>
    <h1>Title</h1>
    <p>Paragraph</p>
    <section>
        <h2>Sub Title</h2>
        <p>Another Paragraph</p>
        <p>Yet another Paragraph</p>
    </section>
    <section>
        <h2>Another Title</h2>
        <p>Another Paragraph: Tokyo Drift</p>
    </section>
</section>
```

I wrapped all my `headings` into `sections` as it shall be done in the example above with a well/placed regular expression, after the markdown parse has already happened.

It's usually a bad idea to replace content in HTML with regular expressions. But since I have a generated code it has enough constraints, that I can trust enough to hope that it's a solid solution.

I added `<section>` in the beginning, `</section>` at the end and replaced `<h\d`s by prefixing `</section><section>` this way the number of starting and closing tags will always match, and I don't have to write a more complicated parser, neeither do I have to come up with an algorithm that tries to keeps track of the state of scrolling with limited information.

### Table Of Contents

The theme had a `toc.html` file with complicated logic.
In the [docs I've found](https://gohugo.io/content-management/toc/), that hugo does it for me already... and lets me use a rather simple `{{ .TableOfContents }}` variable in the template.

I just needded to style it.

### Hide On Smaller Screens

I'm not completely proud of my current solution.
I id not want to erwrite the whole layout. At first an absoulute positioned parent seemed feasible, but a good ol' `float: right` works exactly I expect it.

Since it's just a convenience feature I hide it if the sceen is smaller than where this TOC would fit already.

## Summary

It was a great practice to get to know hugo better, while creating something fancy.

Happy coding!

Cover Photo by [ENESFILM](https://www.pexels.com/@enesfilm/) from [Pexels](https://www.pexels.com/photo/a-person-scooping-out-a-cheesy-pizza-9513587/)