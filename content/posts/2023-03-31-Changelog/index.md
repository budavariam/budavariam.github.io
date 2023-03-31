---
layout: post
title: Keep a CHANGELOG
tags: []
cover:
    alt: Cover
    hidden: true
resources:
  - name: cover
    src: cover.png
date: 2023-03-31
draft: true
---

<!--more-->

Here is an example starter

```md
<!-- markdownlint-disable MD024 -->
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Used keywords can be: `Added`, `Changed`, `Removed`, `Fixed`

## [Unreleased]

## [0.0.2] - 2023-03-31

## Added

- minor changes

## [0.0.1] - 2023-03-29

## Added

- first version

[Unreleased]: https://github.com/budavariam/budavariam.github.io/compare/v0.0.2...HEAD
[0.0.2]: https://github.com/budavariam/budavariam.github.io/releases/tag/v0.0.1...v0.0.2
[0.0.1]: https://github.com/budavariam/budavariam.github.io/releases/tag/v0.0.1
```

## Update Version

As you see it has a manual part that need to be updated upon creating a new version.

I've created a small python package for that that's available in pip

```bash
pip install update_changelog
update_changelog
update_changelog --v 1.1.1 --changelog CHANGELOG.md
```
