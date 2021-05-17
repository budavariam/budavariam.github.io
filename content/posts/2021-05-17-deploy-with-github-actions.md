---
layout: post
title: Deploy With Github Actions
tags: [github-actions, github, gatsby, react, hugo, my-solution, config]
cover:
  image: /images/2021-05-17-deploy-with-github-actions/cover.png
  alt: Cover
  hidden: false
date: 2021-05-17
---

Recently I tried Github actions to deploy some of my static sites, and I've been quite happy with its capabilities.
Let me share my configs for different kinds of setups.

<!--more-->

## What is Github Actions

[Github Actions](https://github.com/features/actions) is an embedded CI/CD pipeline of Github.
You need to define the workflow files in yml files under `.github`
folder in the repository root folder,
and you can unleash its true power.

Its main benefit is that it's a Github service embedded in,
and you can use it for free until (at the time of writing) 2000 build minutes per month. More info about [pricing](https://github.com/pricing) here.

## Create React App on Github Pages

[Create React App](https://create-react-app.dev/) is a popular starter project
for [react.js](https://reactjs.org/) applications.

[Example repo](https://github.com/budavariam/asciiart-text/)

{{< hgist 300px budavariam a8d0dc999fe8cd43585aa05eecf828aa >}}

The tricky part is that if you use your Github pages site without a domain,
it will serve your site in a subpath, BUT by default, Create-React-App assumes you serve it from the root.

In `package.json`, you need to set the `"homepage"` property to the name of the repository,
starting with a forward slash.

For example, in my [asciiart-text](https://budavariam.github.io/asciiart-text/) site, I needed to add:

```json
{
  "homepage": "/asciiart-text"
}
```

## Hugo site on Github Pages

[Hugo](https://gohugo.io/) claims to be the fastest static site generator, and I can not agree more.

[Example repo](https://github.com/budavariam/budavariam.github.io/)

{{< hgist 300px budavariam ac739a72e8a034ff8b7df82b39d7b57d >}}

I publish my blog to Github pages built with Hugo.

## Gatsby Static site on Github Pages

[Gatsby](https://www.gatsbyjs.com/) is an incredible static site generator based on react.

[Example repo](https://github.com/budavariam/gatsby-theme-classroom-blog/)

{{< hgist 300px budavariam 0260cf038f147d0e0a1f167509164ef5 >}}

There are different predefined workflows for many static site generators, and I found one for gatsby. It worked fine, but I could not make it publish from a subdirectory, though it said in the docs. I spent a little time investigating, only to figure that the owner did not release the last version, so I forked it and fixed it for me.

## Disclaimer

I have no affiliation with Github, and I just wanted to share my experience and collect my configs for future reference.