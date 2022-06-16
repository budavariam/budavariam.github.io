---
layout: post
title: Save Disk Space with pnpm
tags: [pnpm, javascript, programming, node, developer-toolbox]
cover:
    alt: pnpm logo
    hidden: false
resources:
  - name: cover
    src: cover.svg
date: 2022-06-15
draft: false
---

I like to write my projects in JavaScript.
Since I don't have time to juggle between all of them, it's inevitable that they're abandoned after a while and left as they were last touched for eternity.
I bet this story feels familiar.

<!--more-->

## The node_modules Multiverse

Currently I don't have a way to let my machine know, that
I won't work on some of my projects for a while. It does not know, that it's safe to get rid of the large unnecessary build artifacts and dependencies.
I mostly use node that comes with npm package manager by default.
Npm has a *huge* downside illustrated below.

{{< figure
    src="node_modules.png"
    caption="Heaviest objects in the universe"
    attr="(source: reddit)"
    attrlink="https://www.reddit.com/r/ProgrammerHumor/comments/6s0wov/heaviest_objects_in_the_universe/"
    height="300px"
    align="center"
>}}

For every project that you're woking on, it'll create a new **separate** `node_modules` folder, downloading all dependencies and pack it into a single tree structure.
This `node_modules` folder can quickly grow to hundreds of megabytes even if you only use a small set of dependencies.
That's because your dependencies most likely depend on other projects, and so on...

## Out of Space

In the last couple of days I've been struggling with the amount of free space I have.
I've cleaned up in the most obvious places aleady, but it was not enough.

I decided to take a deepdive into my projects folder stucture.

```bash
find ~/project -iname 'node_modules' -type d | grep -v '/node_modules/'
```

I looked for leaf folders with the name `node_modules`.
To my surprise I found around 50 sandboxes, playgrounds, current projects, recently abandoned projects and REALLY old ones.

At that point rage was my guiding star, so I went through them one by one, and removed the unused ones.

Now I know that there are better ways to tackle this problem.
One of which is [npkill](https://npkill.js.org/) that promises to easily find and remove old and heavy `node_modules` folders.

In the end I managed to save up around 20GB of space... I let it sink in. 20GB.

### How to solve it

At first I thought about moving to docker for all frontend related development.
I could use development images, build the code there and move the problem away with one level of abstraction.

I already have a preferred way to clean up dangling images,
but I felt like there must be a better way to solve the space problem globally.

## Reuse Modules with pnpm

A few weeks ago I've heard about [pnpm](https://pnpm.io/), but I did not feel the urge then to look into it.
*Now* I felt it's the perfect time to try something new.

The feature I like in it the most is that it uses a
**single loaction to download all modules** throughout all the projects that you use with pnpm.
During each install it even shows how many packages were reused from the store.
It's really pleasing.

I also like that it can coexist with npm, if you have some special needs that it can not yet solve with pnpm.

The project has similar [motivation](https://pnpm.io/motivation) than my needs, even it's name stands for [performant npm](https://pnpm.io/faq#what-does-pnpm-stand-for).

<!-- https://twitter.com/HemSays/status/1434921646083563525 -->
{{< twitter HemSays 1434921646083563525 >}}

## Getting started with pnpm

The official docs are a good source to have it up and running in a glance.

### Installation

The [installation](https://pnpm.io/installation) was pretty straightforward for me.
I chose a feasible one from their listed ways and it worked flawlessly.

```bash
corepack enable
corepack prepare pnpm@7.2.1 --activate
```

### How to add/remove modules

The [pnpm add PACKAGE](https://pnpm.io/next/cli/add) command adds the `PACKAGE` dependency,
and as an added bonus it makes sure that the new module is added to your `package.json` as well.
So hopefully you won't ever run into a problem, that your code depends on a package that you've installed,
but your coworker can not run the app.

```bash
# use is-number package as an example
pnpm add is-number
```

The [pnpm remove PACKAGE](https://pnpm.io/next/cli/remove) removes it from `package.json` and the node_modules folder.
I'd like to add that it **won't** remove the package from the global store, so reinstalling a package is lightning fast.

```bash
# use is-number package as an example
pnpm remove is-number
```

### How to clean up after a project

The [pnpm store prune](https://pnpm.io/cli/store#prune) command removes unreferenced projects from the **global store**.
The global store is not cleaning up itself, and contains multiple versions of the same pakages, as per the dependencies need it.
Although when you update some packages in a project, some modules might only have been referenced by your old versions, thus they can be safely deleted.

It is advised to run this command once in a while, not too often though.

#### Abandon a project on purpose

When you no longer develop a project, you can just remove the `node_modules` folder as usual.
The new thing to do is to run `pnpm store prune` and enjoy your regained free space.

```bash
# abandon a project
cd $(pnpm root)/..
rm -rf ./node_modules

pnpm store prune
```

### Where is the global store

You can find the store's location with [pnpm store path](https://pnpm.io/cli/store#path) command.

```bash
pnpm store path
```

### My current challenge is different node versions

I use n for [managing node versions](/posts/2021/01/11/node/python-version-management/).
I did not find any documentation of how these can coexist.
Although I must add that it's not the best searchable name.

I have some old projects that only work with older node versions, and I might need to switch between them occasionally in the future.

[pnpm env](https://pnpm.io/cli/env) can hopefully help me with that.

```bash
pnpm env use --global lts
pnpm env use --global 14.17.0
```

> Note: `--global` flag is mandatory for this command as per v7.x

It's said that it works with [nvm](https://nvm.sh/), I might try that in a next iteration.

### Closing Words

I'm glad that I found [pnpm](https://pnpm.io/), I know my hard drive will thank me later.
I already like how much module it reuses in the few projects I utilized it in.
It already helped me catch bad imports, it's a good start.

I just need to learn to write `pnpm` instead of `npm` from now on.

> I'm not affiliated in any way with this project or its authors. This post represents my opinion and limited experience with this tool.

Happy coding!
