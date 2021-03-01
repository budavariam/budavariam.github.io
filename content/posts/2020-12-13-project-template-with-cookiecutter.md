---
layout: post
title: Project Template With Cookiecutter
tags: [ programming, python, template ]
date: 2020-12-13
---

Sometimes I work on similar projects that need so little customization
I feel like I can just copy and paste it, and tweak some variables,
then create a new repo for it, and start to generate the content.
Here is where project templates come into play.

[Cookiecutter](https://github.com/cookiecutter/cookiecutter) is a python tool
that lets you create an initial template that you can use for later projects.
Just because it is written in python it does not mean it can only scaffold python projects.

## Getting started

The theory is dead simple.

1. You create a folder for your templates.
1. In each template mark the text substitution points in your file content,
   file names or directory names. with `{{cookiecutter.CUSTOM_VARIABLE_NAME}}`.
1. Specify the variables that cookiecutter needs to look for in `cookiecutter.json` file for each project.
1. Profit

I recommend that you follow the
[official docs instructions](https://cookiecutter.readthedocs.io/en/1.7.2/first_steps.html),
because my article can become outdated.

The awesome part is that you can even use a github repo to start out from.

## My experience with it

I first encountered with this tool when I worked on a [custom plotly-dash react component](https://dash.plotly.com/plugins).

In order to get started with that, I only needed to execute
`cookiecutter https://github.com/plotly/dash-component-boilerplate.git`, answer a few questions about the projects and
I was ready to go with a working personalized template.
I was amazed by this simplicity.

I usually present my [advent of code](/posts/2020/12/01/advent-of-code/) solutions in the same style over the course of a year.
This year I decided to create a [project template](https://github.com/budavariam/advent_of_code/tree/master/2020/template)
for the solutions, and it works great.

I use the python API interface to have some custom behavior and
[start it out from this python script](https://github.com/budavariam/advent_of_code/blob/master/2020/init.py).

## Disclaimer

I was not asked to create this post, and did not get anything for it,
I just wanted to share how simple it is to use and some of my experience with it.

Happy coding!
