---
layout: post
title: Organization Specific Git Config
tags: [git, quick-tip, dotfiles, config]
cover: 
    alt: Carnival mask decorated with pink flower
    hidden: false
resources:
  - name: cover
    src: cover.png
date: 2022-04-04
draft: false
---

I often need to present myself differently in git per project.
When I work on a client's own github, and they provide me an email address,
it's more professional, *and most of the time a requirement*, to use it to identify myself.
Git, by default lets me specify configuration globally, or per repository.
However, with a little trick I can set it on any abstraction level I need.

<!--more-->

## The situation

Take the simplest example, that I need to change my email address across different git repositories.
Imagine I have a folder structure:

- Personal sandbox: where I'd like to use my personal address
- Company level internal development: where I'd like to use my company address
- One folder per each clients: where I'd like to use my vendor addresses

Each of these folders can contain many repositories, and the git config depends on the top level folder.

The problem is that I really don't want to set up different email addresses per new repositories.

Let's see what we can do about this.

We'll dive in [git config](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration) a bit.

```bash
# You can set up the single global email address
git config --global user.email "company_email@example.com"
# You can modify the configs per repository as well
git config user.email "name@company.com"
```

## Git Include to the rescue

[Git Includes](https://git-scm.com/docs/git-config#_includes) give you a way to extend your git configurations by loading other files into them.

You can even do this conditionally with the [includeIf](https://git-scm.com/docs/git-config#_conditional_includes) directive.

You need to do 2 things:

1. Define the gitconfig snippet with your favourite editor / command in the desired location.

   ```bash
   echo """[user]\n   email = personal_address@example.com""" >> ~/project_dir/personal/.gitconfig
   ```

1. Extend your git config conditionally

   ```conf
   [includeIf "gitdir:~/project_dir/personal/"]
       path = ~/project_dir/personal/.gitconfig
   ```

> After this, every git repository anywhere under `~/project_dir/personal/` will see your email address as `personal_address@example.com`, based on `~/project_dir/personal/.gitconfig`.

### See what's happening

You need to add an `includeIf` directive to your global git config file.

It needs to have a single parameter, to define for which git repositories should it add the snippet.

The parameter can start with a `gitdir:` keyword that tells git to test the location of the current repository, whether if matches the defined [glob](https://en.wikipedia.org/wiki/Glob_(programming)) pattern.
If it matches, then the snippet defined in the `path` param of the `includeIf` directive will be included.

You can have relative paths, but it will be relative to the current repo, **NOT** the global config file.

## What if I use dotfiles

If you share your [dotfiles](/posts/2021/03/06/keep-your-configs-safe/) in a public repository, I highly advise you **NOT** to share your different email addresses with the whole world.

Here's where `.gitignore` and `include` can come in handy.

### Ignore

You can define a pattern for sensitive data in your [gitignore file](https://git-scm.com/docs/gitignore) e.g. ignore all files that start with the `sensitive` prefix.

> You need to remember to add these files when you set up a new machine.

### Include

And in your global gitconfig you can safely include your additional configs, where you define the extensions via `includeIf` directives.

```conf
[include]
    path = ~/dotfiles/git/sensitive-gitconfig
```

### File locations

It's up to you where you put the snippets.
I prefer to keep them in the dotfiles repository.
It's also good to keep them near the repositories.

See what works for you the best.

## Summary

I hope it will prevent you many headaches.

Happy coding!

Cover Photo by [Ibolya Toldi](https://www.pexels.com/@ibolya-toldi-2149985/) from [Pexels](https://www.pexels.com/photo/carnival-mask-decorated-with-pink-flower-3836671/)
