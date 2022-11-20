---
layout: post
title: Hugo Development Tips
tags: [hugo, go, cheatsheet]
cover:
    alt: 4 letters put together from scrabble blocks, forming the word blog.
    hidden: false
resources:
  - name: cover
    src: cover.jpg
date: 2022-07-14
draft: false
---

I've [moved my blog content build to hugo](/posts/2021/03/02/new-blog-engine/) more than a year ago, but I still forget how to achieve some basic things in [Hugo](https://gohugo.io/) or where to find them in the docs. I've put together this cheatsheet to help me later on. I hope it'll benefit you as well.

<!--more-->

## Go Templating Basics

[Docs](https://pkg.go.dev/text/template)

## Hugo Templating Basics

[Getting started guide](https://gohugo.io/templates/introduction/)

Access parameters with [.Get](https://gohugo.io/templates/shortcode-templates/#access-parameters)

### Custom templates
  
- Create a new folder under `content` e.g: `a`
- Create a file for the list template under `layout/section/a.html`
- Create a folder under `layout/a` and put the files that you want to override from `_default` like `single.html`

## Embed Content Into Markdown Files

### ShortCodes

- [Shortcodes](https://gohugo.io/content-management/shortcodes/)

### Emojis

[emoji support](https://gohugo.io/functions/emojify/)

I suggest you not to enable emoji parsing globally, because it can mess up source codes.
I'd prefer to use ```{{ emoji `:emojicode:` }}``` in markdown content.

```go
// Add this shortcode definition to e.g: `layouts/shortcodes/emoji.html` in order to use it
{{ .Get 0 | emojify }}
```

### Figure

Available properties of Figure

```text
align
alt
attr
attrlink
caption
class
height
link
rel
src
target
title
width
```

## Create Custom Lists From Content

[Taxonomies](https://gohugo.io/content-management/taxonomies/) are awesome to create custom lists of posts

## Easily Manipulate Data With Scratch

[Scratch](https://gohugo.io/functions/scratch/)

It's good to create a static map of values.

```hugo
{{ $scratch := newScratch}}
{{ $scratch.Add "email" "mailto:" }}
{{ $scratch.Add "gmail" "mailto:" }}
<a href="{{ $scratch.Get "gmail" }}email@domain.com"></a>
```

## Debugging

### Print Values

[printf](https://gohugo.io/functions/printf/)

debug values: `{{ printf "Count %#v " .Count }}`

### Check Whether Partials Load

To debug partials whether they show up or not, you can add this simple hack to the first line of its html file.
You'll quickly notice if they've loaded even iff it does not show any visible content just from the background change.

```html
<style>body{background:red!important;}</style>
```

## Handle Images

[Image Processing](https://gohugo.io/content-management/image-processing/)

```go
{{ with .Resources.GetMatch "img.png" }}
  <img src="data:{{ .MediaType }};base64,{{ .Content | base64Encode }}">
{{ end }}

{{- $images := .Resources.Match "*" -}}
{{ printf "nr of images %#v " ( len $images ) }}
```

## Available Variables

Some variables are available by default in different parts of the site.

### Configuration Values

In case you have `parameterValue` in `config.yml` like this:

```yml
params:
  parameterValue: 23
```

You can access it in your code throug Site Params in your partial templates.

```go
{{ .Site.Params.parameterValue }}
```

### Pages

[Page Variables](https://gohugo.io/variables/page/)

```go
<pre>
{{ printf "File: %s" .File }}
{{ printf "Content: %s" .Content }}
{{ printf "Data: %s" .Data }}
{{ printf "IsPage: %s" .IsPage }}
{{ printf "Kind: %s" .Kind }}
</pre>
```

## Summary

I hope you've found what you were looking for.

Cover Photo by [Pixabay](https://www.pexels.com/@pixabay/) from [Pexels](https://www.pexels.com/photo/blog-icon-information-internet-262508/)
