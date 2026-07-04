---
layout: post
title: Taming .env Files and Dev Sessions with project-env-utils
tags: [programming, cli, developer-toolbox, productivity, rust, tmux]
cover:
  alt: Terminal split into panes showing a dev session starting up
  hidden: true
date: 2026-07-04
---

For years `.env` files were a one-time setup ritual. Then feature branches started requiring different database
configs, API keys, and service URLs — and suddenly I was doing the same manual swap dozens of times a week.
This is the story of the tool I built to stop doing that.

<!--more-->

## The .env problem nobody talks about

Early in my career, setting up a `.env` file meant reading a README once, copying the example, filling in the
blanks, and forgetting about it. Done. The file sat there forever, quietly doing its job.

That changed when I started working on features that required switching between environments frequently.
Suddenly every branch change came with a question: *"Do I need the test database for this, or the dev one?
Which API key does staging use?"*

At first I just kept backups. A folder of named copies: `.env.test`, `.env.uat`, `.env.dev`. I'd copy-paste
the right one before running anything. When I forgot — and I always forgot — the app would start, behave
weirdly, and I'd spend a few minutes debugging before realising I had the wrong database connection pointing
at production data in a dev session.

The backup folder grew. The cognitive overhead grew with it. I started writing comments in my PRs: *"Remember
to load the test preset before running this."* That's a bad sign.

## The tmux conversation

Around the same time I had a conversation with a colleague who couldn't stop talking about his tmux setup.
He had a session for every project, windows for every concern, and a keybinding for everything. His workflow
had a kind of physical memory to it — he knew exactly where things were without thinking.

That got me thinking about my own habits. Every time I set up my machine, or after a reboot, I'd open the
same terminal tabs, `cd` to the same directories, run the same startup commands. Docker compose here, backend
there, frontend over there. I knew the sequence by heart. I was the human automation.

I'd actually solved this before — badly. I had a shell script for one project that launched a tmux session
with a hardcoded layout. It worked great, and then I forgot it existed. When I came back to that project
three months later I started setting up the session manually again before noticing the script sitting right
there. I'd written the solution and then lost track of it.

The underlying problem was that every project had its own scattered solution, or more often no solution at
all. There was no consistent place to look.

## What I built

I wrote **[project-env-utils](https://github.com/budavariam/project-env-utils)** — a Rust CLI called `penv`
that handles both problems together.

The core idea is a `settings.json` at the root of the tool directory that describes your project: which
services exist, what their presets are, and how to lay out a dev session. `penv` lives alongside your
service repos and knows how to wire everything together.

### Env preset management

A *preset* is a named set of `.env` files. `test`, `uat`, `dev` — whatever makes sense for your project.
`penv` can store these in a local SQLite database (the default), in 1Password, or pull them from a secret
management service. Loading a preset means `penv` writes the right `.env` file into each service repo in
one command:

```bash
penv load-env test        # load 'test' preset into all service repos
penv load-env uat buz-api # load 'uat' preset into one service only
```

It tracks which preset each service is currently on in a small state file, so you always know where you
stand. The `morning-check` command compares your local files against the stored presets and surfaces any
drift — if you edited a `.env` directly, it asks what you want to do about it before you start your day.

```
=== BuZ morning check ===

  Checking env sync for preset 'dev':
  buz-api [dev]: in sync ✓
  buz-ui [dev]: .env differs from SQLite  (local .env is newer — your changes likely)

    [d] show diff  [push] push local → SQLite  [p] pull from SQLite  [s] skip
```

The `env-age` command shows the modification timestamps for a service's env across all three locations —
the deployed `.env`, the local cache, and the backend — so you can see at a glance which copy is newest
and propagate in either direction.

### Session management

The same `settings.json` describes how to launch a dev session. You define tabs with a grid of panes, and
`penv dev-session` creates the whole layout in one go:

```json
{
  "sessions": [{
    "session_name": "my-project",
    "tabs": [
      {
        "name": "backend",
        "panes": [
          { "repo": "my-api",  "cmd": "npm run dev", "col": 0, "row": 0 },
          { "repo": "my-api",  "cmd": "npm test -- --watch", "col": 0, "row": 1 },
          { "col": 1, "row": 0 }
        ]
      },
      {
        "name": "frontend",
        "panes": [
          { "repo": "my-ui", "cmd": "npm run dev",       "col": 0, "row": 0 },
          { "repo": "my-ui", "cmd": "npm run storybook", "col": 0, "row": 1 }
        ]
      }
    ]
  }]
}
```

Running `penv dev-session` picks the preset interactively if you haven't specified one, runs a sync check,
creates the session, and attaches. The idle pane in the first tab gets a small helper script that exposes
`reload_env`, `show_info`, and `close_session` as shell functions — so common tasks are always one command
away wherever you are in the session.

It works with **tmux**, **byobu**, and **GNU Screen**. Set `session_multiplexer` in your local settings and
it uses the right binary throughout.

### Sharing secrets with new team members

One thing `.env` backups in a personal folder never solved: onboarding. The classic handover is someone
Slacking you a wall of environment variables, you pasting them into a file, half of them being wrong or
outdated, and spending an hour debugging until someone mentions the values changed two weeks ago.

With a shared backend like 1Password, the flow becomes different. The team maintains one vault with the
canonical presets. A new joiner runs:

```bash
op signin
penv op pull dev     # pulls every service's dev preset from 1Password
penv load-env dev    # writes them all into the service repos
```

That's it. They have the same environment as everyone else, including the updates from last week that
nobody announced.

The same mechanism solves drift for existing team members. If someone rotates an API key and pushes the
update to 1Password, `morning-check` will notice the next day:

```
buz-api [dev]: differs from 1Password  (1Password was updated — backend changes likely)

  [d] show diff  [p] pull from 1Password  [push] push local → 1Password  [s] skip
```

It shows which direction the change went — whether your local version is newer (you made changes) or the
backend is newer (someone else did). You pick the right direction without guessing.

For teams that don't use 1Password, the same model works with SQLite: one person maintains a shared
`secrets.db` and distributes it (or puts it in a private repo), and everyone pulls from the same source.
It is not as ergonomic as a real secrets manager, but it is still better than a group chat full of
`.env` snippets.



There are two config files:

- `settings.json` — tracked in git. Describes services, presets, session layout. Shared with the team.
- `settings.local.json` — gitignored. Your personal backend choice, vault names, multiplexer preference.

```json
{
  "secret_backend": "sqlite",
  "session_multiplexer": "tmux"
}
```

This means everyone on the team shares the same session layout and preset names, but uses whatever secret
backend they prefer — SQLite locally, 1Password for those who have it set up, or nothing at all (profiles
without secrets still work, they just won't have credentials filled in).

## What I use it for day to day

My actual flow when starting work on a feature:

1. `penv dev-session --session my-project` — if the session doesn't exist, it asks which preset I want,
   runs morning-check, and builds the layout. If it already exists, it just attaches.
2. When I switch to a branch that needs a different database: `penv load-env test` — done in under a second.
3. If I've edited a `.env` directly and want to save that back: `morning-check` surfaces the diff and I
   can push it to SQLite in one keypress.

The part that surprised me most was how much mental overhead disappeared once the session layout was defined
once. I stopped thinking about which tab to open and started just working.

## What's next

The tool is open source at [github.com/budavariam/project-env-utils](https://github.com/budavariam/project-env-utils).
The `demo/` directory in the repo has a working example you can run immediately with the SQLite backend —
no accounts or external services needed.

I built it to scratch my own itch, so it fits the way I work. If you find yourself doing the `.env` shuffle
or rebuilding the same tmux layout from memory every morning, it might fit yours too.
