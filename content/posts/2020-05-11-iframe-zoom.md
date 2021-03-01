---
layout: post
title: Iframe zoom
tags: [ programming, my-solution, html, css ]
date: 2020-05-11
---

I need to set the zoom factor in an iframe.
I knew exactly how much space should the embedded content fit into.
And the scale needs to be adjustable.
Here's how I'd do it.

```html
<div class="container">
    <iframe
        class="scaled-iframe"
        src="https://example.com"
        frameborder="0">
    </iframe>
</div>
```

## Container

The iframe has to be wrapped into a container div element, that can have any size.
I set a [css custom property](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
on it, that can be changed with javascript later on.

```css
.container {
    --scale-factor: 0.5;
    overflow: hidden;
    /* props below are not mandatory */
    width: 50%;
    height: 500px;
    border: 1px solid black;
}
```

The container's `width` and `height` can be any reasonable value, the `--scale-factor` should be a positive number around 1 (1 is 100%, zero does not make sense).

Since I'll fit the iframe content to the container, I don't need to show any possible overflows.

## Iframe

The main trick is that in the iframe  `transform: scale` can change its contents' size.

If I set `width: 100%; height: 100%;` on the iframe to keep it fit into its container,
the scaling will change them as well.
I need to adjust the width and height of the iframe element so that it fits in its container.
I can `calc` the necessary adjustments based on the custom property this way: `calc(1/var(--scale-factor) * 100%)`.

```css
.scaled-iframe {
    transform: scale(var(--scale-factor));
    width: calc(1/var(--scale-factor) * 100%);
    height: calc(1/var(--scale-factor) * 100%);
}
```

In case I don't want to fill the whole container, and I don't like that it's aligned to the middle,
I need to set the `transform-origin` property to a different value.
E.g: `0 0;` will start to scale it up from the top left corner.

## Browser support

As of now css variables are not supported in IE11, JS can be used instead of it.

Opera mini stays out of this game completely.

For up to date info check out [caniuse.com](https://caniuse.com):

* [calc](https://caniuse.com/#feat=calcs)
* [transform](https://caniuse.com/#feat=transforms2d)
* [css variables](https://caniuse.com/#feat=css-variables)
