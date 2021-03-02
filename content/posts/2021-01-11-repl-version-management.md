---
layout: post
title: Node/Python Version Management
tags: [ programming, python, node, version-manager, developer-toolbox ]
date: 2021-01-11
---

I work with some projects that can be only used with specific versions of node/python and it's not feasible to simply dockerize them.
Every time I switch between these projects I'd need to reinstall different versions of node/python.
That would be plain silly... BUT there's a better way.
<!--more-->
## Node.js

For Node, there's an npm package called [n](https://www.npmjs.com/package/n).

1. Install any version of [node](https://nodejs.org/en/download/)
1. Run `npm install -g n`
1. Verify install: `n --help`

Options I use the most:

- Install specific version: `n <version>`
  - e.g.: `n 15.5.1`
- Select version from installed: `n`
- Install and use latest node version: `n latest`
- Clean up all versions except the current: `n prune`

In case it does not work without `sudo` you can follow the advice in the [docs](https://github.com/tj/n#installation):

> To avoid requiring sudo for n and npm global installs,
> it is suggested you either install to your home directory using N_PREFIX,
> or take ownership of the system directories

Note: It's not supported on windows.

## Python

For Python, there's a community made package manager solution called [pyenv](https://github.com/pyenv/pyenv).
It uses shell scripts and builds the selected python environment from source.

1. Install any version of [python](https://www.python.org/downloads/)
1. Follow the instructions at its [README](https://github.com/pyenv/pyenv#installation)

Options I use the most:

- Install specific python version: `pyenv install <version>`
  - e.g: `pyenv install 3.9.0`
- Use specific python version only for the current folder structure: `pyenv local <version>`

I hope it'll help you as much as it helped me.

Note: It has a [fork](https://github.com/pyenv-win/pyenv-win) for windows.

Happy Coding!
