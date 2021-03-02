---
layout: post
title: Emmet
custom_css: post-emmet
tags: [ programming, emmet, html, cheatsheet ]
date: 2020-04-12
---

In my opinion Emmet is an essential tool for web developers.
You can code in abbreviations that you can translate into html layouts, css styles, or even xsl transformations.
These handy shortcuts make development faster, if you know what you can use by heart.
<!--more-->
## Basics

You can find the detailed basics in the [official docs](https://docs.emmet.io/abbreviations/syntax/).

Also I recommend you to check out the [official cheat sheet](https://docs.emmet.io/cheat-sheet/).

I've been coding in VSCode, and emmet has been
[integrated](https://code.visualstudio.com/docs/editor/emmet) to it for a few years now.
It is enabled by default for many file types e.g: `html`, `jsx`, `xml`, `xsl`, `css`, `scss`, `sass` etc.

When you type in an emmet statement in those file types, you can expand it with `ctrl+space` helper, or with the `Emmet: Expand Abbreviation` command.

I list the basic building blocks below, that you can combine in any way you'd like.
Just because my examples are simple it does not mean that it can not create complex layouts.
(In some examples I shorten the generated code with `...` to save space).

Emmet shines when it can make you type less. In my opinion it is better to [keep it simple](https://en.wikipedia.org/wiki/KISS_principle) in general, so that you won't waste more time to create the perfect snippet, than what it would've taken to type it in the first place.

### Tags, properties and text

* Use `.` for class
* Use `#` for id
* Use `[]` for custom attributes
* Use `{}` to add cutom text
* Use `lorem` for [lorem ipsum](https://en.wikipedia.org/wiki/Lorem_ipsum) filler text. You can specify a number to limit the word count. e.g: `lorem10`.

What | Emmet | Generated HTML
---- | ---- | ----
class | `a.myClassName` | `<a href="" class="myClassName"></a>`
id | `p#myId` | `<p id="myId"></p>`
attributes | `td[title="Hello world!" colspan=3]` | `<td title="Hello world!" colspan="3"></td>`
custom text | `div{Welcome}` | `<div>Welcome</div>`
filler text | `lorem5` | `Lorem ipsum dolor sit amet.`

### Movements

* Use `>` to step into the previous item, and define its children.
* Use `+` to define a sibling of the previous item.
* Use `^` to climb up to parent. (It can be used multiple times).

What | Emmet | Generated HTML
---- | ---- | ----
move down | `ul>li>lorem4` |  `<ul><li>Lorem ipsum dolor sit.</li></ul>`
add siblings | `div>span.a+span.b+span.c` | `<div><span class="a"></span><span class="b"></span><span class="c"></span></div>`
move up | `div>p>span+strong^^footer` | `<div><p><span></span><strong></strong></p></div><footer></footer>`

### Control

* Use `*n` for multiplication, where n is a number that defines how many times an element should be outputted
* Use `()` for grouping (e.g. it is useful to combine with multiplication)
* Use `$` to insert an increasing number.
  * The number of preceding zeroes can be defined with the number of `$`s.
  * You can reverse the number count direction to decrease with `@-`. (For me it does not seem to work now)
  * You can change the start number with `@n` where `n` is the desired number.

What | Emmet | Generated HTML
---- | ---- | ----
Add counter | `ul>li.item$*5` | `<ul><li class="item1"></li><li class="item2"></li>...</ul>`
Group mulltiplication | `(div>label+input[type=radio])*2` | `<div><label for=""></label><input type="radio"></div><div><label for=""></label><input type="radio"></div>`
Multiple zeros | `ul>li.item$$$2*5` | `<ul><li class="item001"></li>...<li class="item005"></li></ul>`
Start from different base | `p#id$@34*4` | `<p id="id34"></p>...<p id="id37"></p>`
Counter in text starting from 2 | `span{I have $@2 cats}*8` | `<span>I have 2 cats</span>...<span>I have 9 cats</span>`

## Implicit tag names

Emmet can assume some tagnames based on context. For example unordered lists can only contain `li` tags, `table` contains `tr`s, and `tr`s contain `td`s.
Divs are commonly used, so if you don't use any tag, and the context does not tell it otherwise then it can assume you meant to use `div`s.

What  | Short                       | Long
----  | ----                        | ----
div   | `.wrap>.content`            | `div.wrap>div.content`
span  | `em>.info`                  | `em>span.info`
list  | `ul>.item*3`                | `ul>li.item*3`
table | `table>#row$*4>[colspan=2]` | `table>tr#row$*4>td[colspan=2]`

## Things to be aware of

* Note that `space is a stop symbol` where Emmet stops abbreviation parsing, so do not use it outside `{}`.
* When you expand an emmet abbreviation the cursor has to be at the end of the statement.

## HTML, CSS, XSL

There are many abbreviations to check out.
I recommend the [official cheat sheet](https://docs.emmet.io/cheat-sheet/) for this purpose.

## Emmet in React

Since last year I've been coding in React with `.js` files for frontend development.
As you might have noticed `.js` is not in the default enabled list above, so I haven't used my emmet knowledge for a while.

A few days ago I looked around, and I've [found a way](https://medium.com/@eshwaren/enable-emmet-support-for-jsx-in-visual-studio-code-react-f1f5dfe8809c)
to turn on emmet for react javascript files that do not have `.jsx` extension.
I just needed to set this in VS Code's `settings.json`.

```json
{
   "emmet.includeLanguages": {
      "javascript": "javascriptreact"
   }
}
```

Finally I can use it again! This rediscovery inspired me to write about this tool, and share how much I love it.
I hope I was able to prove how simple and powerful it is.

Happy coding!
