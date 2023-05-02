---
layout: post
title: Organizing Project Scripts
tags: [my-opinion]
cover:
    alt: Cover
    hidden: false
resources:
  - name: cover
    src: cover.jpg
date: 2023-03-06
draft: false
---

Working on a project often comes with many different scripts.
When I switch between projects and languages sometimes I found it tiring having to figure out what buld tool I'm using an how to execute those scripts that are lying around. I'm looking for a unified solution.

<!--more-->

When something requires me to do at least 2 steps in a repeatable way I most likely create a script to automate that.
These could be as simple as:

- Spinning up a development version
- build the project, (if applicable)
- run the tests project
- release a new version, update the changelogs
- generate charts, reports from source code
- and so on

Each languages have their own preferred toolset, some authors even create general-purpose build tools in specific lanuages.

I write a `README.md` file into every project that I work with, and it usally starts with a `Getting Started` section. In this section I like to list the different ways to start the project, to help my future self remember what is necessary to get started quickly.

This is by far not the best way, I usually move one level up after a certain point.

## Current JavaScript-like way

If I spin up a new project, I usually run `npm init` alngside it, no matter what kind of project it is going to be, just to use [npm scripts](https://docs.npmjs.com/cli/v9/using-npm/scripts) for organizing the increasing number of build scripts.

### What I love about npm scripts

- Over the years it became a no-brainer for me. I have an `.npmrc` in my [dotfiles](https://budavariam.github.io/posts/2021/03/06/keep-your-configs-safe/), that can give me the base structure.

  ```json
  {
    "name": "SideProject001",
    "version": "0.0.1",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "Mátyás Budavári <budavariam@gmail.com> (https://budavariam.github.io/)",
    "license": "MIT"
  }
  ```

- I work with JSON format most of the time, it's easy to read and it's a simple format
- Gives easier start for some common keywords: `start`, `build`, `test`...
- Gives me version number handling as a bonus without much effort

  ```bash
  # bump verion number
  npm version patch --git-tag-version true  
  # get version number
  node -p "require('./package.json').version"
  ```

- It's easy to connect the scripts with `pre` and `post` prefixes to write more complex pipelines
- VSCode automatically detects npm tasks as [runnable tasks](https://code.visualstudio.com/docs/editor/tasks#vscode)

### What I don't like about npm scripts

- It makes every project look like a JavaScript project. I don't think that it's idiomatic to have `package.json` in a [golang](https://go.dev/) project for example
- In order to understand what script depend on each other you have to look into the code and understand how it flows
- JSON is a strict format, it uses `"`-s, so in your scripts you have to escape these strings
- package.json file does not support comments, if you really need to comment, you have to write it in the code itself, or add a fake property to it
- It's not clear what parameters shall be passed forward. You can use `--` in your script to mark that the code accepts code, but you can pass down anything.
- node/npm might not be available in the system by default

## Initial spark to look for different solutions

During the weekend I was working on my Python OCR script to scan dictionary-like images and extract the text into a formatted CSV.

I did not want to remember the long parameter list, and I wanted something more language-indipendent than npm run scripts.

I remembered that in university we used make for building C projects. I dusted off my knowledge and utilized it as an experiment.

## Makefiles

Makefiles are useful for creating a starting point for your application, a general way of letting the public know how to build your applications.

> Make can be used to manage any project where some files need to be updated automatically from others whenever the others change in addition to building programs.

[source](https://en.wikipedia.org/wiki/Make_(software))

### Example

```makefile
SHELL := /bin/bash
.PHONY: clean build test

build:
    gcc -c -o main.o main.c
    gcc -o exampleprogram main.o
clean:
    rm -f *.o exampleprogram
test:
    ./exampleprogram
```

The `.PHONY` variable needs to be set to tell `make` that these strings are batch targets and shuold not be handled as file names

In a Makefile, the default target is the `first target` defined in the file if there is no explicit target specified on the command line.

### What I like about make

- It's a robust widely-used tool
- It's available in most Unix-like systems by default
- It has a simple format
- Simple to invoke `make build PARAM=value`
- Supports comments
- Supports parameters
- Supports multiline code
- Supports dependencies between tasks

### What I don't like about make

- `.PHONY` variable has to duplicate all task names
- It can also grow to be too complex. There are tools (like [makefile2graph](https://github.com/lindenb/makefile2graph) to visualize it.
- It has to use tabs for identation
- Variable definitions overlap with bash. In order to escape dollar sign you have to double them e.g `$$HOME` is an environment variable from the system, while `$HOME` is a variable defined in the makefile

## Other possibilities

Every language has their preferred toolchain. Developers can stick to them, and move them between projects. It's just a question of preference.

As far as I know

- JavaScript has npm scripts, jake, gulp, grunt
- Java has ANT, gradle, Maven
- Ruby has Rake
- .Net has MSBuild

Countless tools [written in python](https://wiki.python.org/moin/ConfigurationAndBuildTools).

It's up to you (and your tech-lead {{< emoji `:sweat_smile:` >}}) what do you prefer to work with.

### Conclusion

I'll try it out for some of my new non-js projects that have a bunch of shell scripts.

I wouldn't replace the idiomatic language choices.
But for projects that need some utilities that might even be in different languages it seems to be a good alternative for me.

Happy coding!

{{< photo_credit
    img-site="Pexels"
    artist-name="Pixabay"
    artist-url="https://www.pexels.com/@pixabay/"
    img-url="https://www.pexels.com/photo/black-text-on-gray-background-261763/"
>}}
