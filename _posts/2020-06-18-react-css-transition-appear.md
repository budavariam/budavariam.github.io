---
layout: post
title: React CSSTransition appear animation with in=false and without unmountOnExit
comments: true
---

[React Transition group](http://reactcommunity.org/react-transition-group/css-transition) is a great library for animations in react.
I want to share my experience on how to have an appear animation on components that are mounted with an `in={false}` property.

My only constraint was hat I could not use `unmountOnExit` property.

When the component mounted, it showed up immediately without the fade-in effect, then when it actually should have shown, then the animation started.
I had to make sure that the component do not show up before the fade-in animation happens.

As stated in the docs, the `in={false}` setting prevents any classes applied to the component with `CSSTransition`.

> If the transition component mounts with in={false}, no classes are applied yet.
> You might be expecting *-exit-done, but if you think about it,
> a component cannot finish exiting if it hasn't entered yet.

Bummer.

So the first time we see the component, it won't have any classes added to it. And later on it will only have classes that has a suffix like `*.enter-done`.
Then how do we apply an effect to it?

I came up with a simple solution. The `classNames` property can be any string,
and the additional classes will be applied to the end of it.
For example `my-node` will be transformed to `my-node-enter` on enter.

I needed a way to know when the initial transition has happened.

If I set a string with a space in it, then technically it will apply 2 classes.
It add a suffix to the last one only, and evidently the first untouched one will mark that
`CSSTransitionGroup` has changed the classes, while giving us a class to easily check it.

```js
<CSSTransition in={falseAtFirst} key="unique" timeout={200}
    classNames="css-transition-applied hello-world-message"
>
<span className="message">Hello world</span>
</CSSTransition>
```

Then with this css I can assure that the component do not show up prematurely.

```css
.message:not(.css-transition-applied) {
    display: none;
}
```

Hope you won't need this.

Happy coding!
