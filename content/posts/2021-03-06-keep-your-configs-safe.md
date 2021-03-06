---
layout: post
title: Keep Your Configs Safe
tags: [ dotfiles, shell, config, git, productivity ]
cover:
    image: /images/2021-03-06-keep-your-configs-safe/cover.jpg
    alt: Gold Padlock Locking Door
    hidden: false
date: 2021-03-06
---

A few years ago I switched between a few machines on a daily basis,
and tweaked my environments constantly.
It was a tedious task to update each of them one by one,
every time I changed configs or aliases in any of them.
I figured this has got to be easier somehow,
and found the hidden world of dotfiles.

<!--more-->

Yesterday I told a friend to set up a small zsh plugin to make his life easier,
but somehow he managed to remove some essential lines from his config.
It took some time to guess what it was, and he may never know what else did he remove.
That's when I realized, it feels good to have a safety net around my configs
I collected over the years, and I like that I don't have to deal with these kind of problems anymore. 
I want to spread the word about its benefits.

## Dotfiles

In *nix systems user configuration files are usually stored
in folders and files with a name that starts with a dot.
These files are added upon install, and can be modified later.

To keep your configurations safe you can put them under Version Control Systems.
That way you can easily roll back to a previously working config,
and sync the current configs to multiple machines easily.

Many applications modify config files after their install,
for example add some scripts to the rc files of the users' shells.
With version control you can keep track of these modifications.

Many people on github has a public repository called something like `dotfiles`
that shows their approach.
You can learn from their approaches, and even share your way with the community.

### How to get started

There are different ways to create the dotfiles backups:

- Roll your own scripts from scratch
- See others' approach, and tweak it to your needs
  - That's my preferred way
- Use a tool like [Dotbot](https://github.com/anishathalye/dotbot) to do the heavylifting
  - There are many more general-purpose solutions
- Put your whole home folder into git
  - Make sure you ignore the folders that you want to exclude
  - I think it's an overkill, also not all necessary configs are stored in that directory

You can find more information with repositories, tips and tricks and other tools
at [https://dotfiles.github.io](https://dotfiles.github.io).

### But what about secrets

It's not advised to store passwords and crucial keys in
[VCS](https://en.wikipedia.org/wiki/Version_control) like git.

You can store it in a safe vault elsewhere and reference them as regular files.
You can also store them in the same folder but add them to `.gitignore`.

I'd make sure that my configs work without those files.
Also I wouldn't use names that store any additional info about its whereabouts, or its contents.

If you accidentally pushed some keys to the git repository,
it's not enough to revert those changes, and commit again, since it's part of the history now.
You can follow
[this guide](https://docs.github.com/en/github/authenticating-to-github/removing-sensitive-data-from-a-repository)
to remove it completely from the repository.

## My way

I keep the public part of my configs at
[https://github.com/budavariam/dotfiles](https://github.com/budavariam/dotfiles).

I wanted to get my hands dirty, and didn't want to use any external tools for this purpose.
I took inspiration from other dotfiles repos and customized the shell scripts enough to fit my needs.

I need to run the install script once, and it's ready to go.
The files are symlinked to their proper locations,
so if I change anything in an other machine all I have to do
is call `git pull` in my dotfiles repository.

It's not prepared for all usecases, and not suited for reruns.
I don't often add new things to the repo,
and the scripts are not too large to run some of its parts manually if needded.

I advise you to find the method that fits you the best, and keep your configs safe.

Happy coding!
