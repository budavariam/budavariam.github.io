---
layout: post
title: Gitting Started
tags: [git, beginner, version-control, developer-toolbox]
cover:
    alt: Mona the Rivetertocat at https://octodex.github.com/mona-the-rivetertocat/ by https://github.com/johncreek
    hidden: false
resources:
  - name: cover
    src: mona-the-rivetertocat.png
date: 2026-02-04
draft: false
---

I did not learn git until I started working professionally. In the university we learned about SVN.
We did not really use branches, wee followed trunk based development in all of the group projects.
At my second job I had to get into git quickly. It was overwhelming at first, but luckily I had patient mentors,
who answered my questions with enthusiasm, and taught me best practices that I still carry with me.

<!--more-->

## What is Git

Git is a [version control system](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control).
Think of it as a time machine for your code.
Every time you make changes and save them in git, you create a snapshot of your project at that moment.
If you mess something up later, you can always go back to any previous snapshot.

When you write documents in Word or Google Docs, they keep track of your changes.
You can see the edit history, go back to previous versions, and even see who changed what.
Git does something similar, but for code.

### Why plaintext matters

Unlike Word documents that save in a special format, code files are just plain text.
This is actually great for version control because git can easily see exactly what changed between versions.
It can tell you "on line 42, you changed `name` to `username`" which is much more useful than
"you changed something somewhere in the document".

If you've worked with CSV files, you've seen plain text.
Open a CSV in a regular text editor and you'll see all the data as text separated by commas.
Code files work the same way.

## Git vs GitHub

Many people are confused by this, so let me clear it up right away.

Git is a program that runs on your computer. You [install it](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git),
and it tracks your changes locally. You don't need the internet to use it.
You don't need to sign up for anything. It just works on your machine.

[GitHub](https://github.com) is a website where you can store your git projects online.
It's like Google Drive, but specifically designed for code. GitHub adds features like code review tools, project management,
and makes it easy to collaborate with others.

The best analogy I've seen on the internet is that git is like video content, and GitHub is like YouTube.
One creates the content, the other hosts and shares it.
There are also alternatives to GitHub like [GitLab](https://gitlab.com) and [Bitbucket](https://bitbucket.org),
which offer similar hosting services.

### What GitHub adds

GitHub provides web-based previews of your code, lets you browse through the history in a nice interface,
and integrates with external tools for testing, deployment, and code review. Many open source projects live on GitHub,
which is why you'll see it everywhere when learning to code.

If you're new to GitHub, check out their [getting started guide](https://docs.github.com/en/get-started/quickstart/hello-world)
to create your first repository.

### Why can't I just download one folder?

When browsing a repository on GitHub, you might want to download just a single folder instead of the entire project.
Unfortunately, the standard "Download ZIP" button always gives you the whole repository.

This is because of how git works fundamentally. Git doesn't think about your project as individual files and folders.
It thinks about it as a series of snapshots of the entire project over time. When you clone or download a repository,
you're getting the complete history, not just the current files.

GitHub does offer a way to download the current state as a ZIP file, but it's all or nothing. There are a few workarounds:

- Use a third-party tool like [DownGit](https://downgit.github.io/) to download specific folders
- Use [sparse checkout](https://git-scm.com/docs/git-sparse-checkout) if you're comfortable with the command line
- Clone the full repository and just use the folder you need

For most purposes, cloning the full repository is the recommended approach.
Storage is cheap, and having the complete project context is usually helpful even if you only care about one part.

## Mental model

Understanding how git thinks about your code will save you from hours of confusion.

### Commits are snapshots

A commit is like taking a photo of your entire project at a specific moment.
It captures what all your files looked like at that time. Each commit has a unique ID and a message describing what changed.

### The working directory, staging area, and repository

Git has three main states for your files:

1. **Working directory**: This is your actual files on your computer. When you edit code, you're changing the working directory.
2. **Staging area**: This is like a draft of your next commit. You choose which changes to include in your next snapshot.
3. **Repository**: This is where git stores all your commits, the complete history of your project.

The workflow goes like this: you make changes in your working directory,
you add those changes to the staging area, then you commit the staged changes to the repository.

### Branches

A branch is like a parallel version of your project. The default branch is usually called `main` or `master`.
You can create a new branch to try out an idea without affecting the main version.
If it works out, you can merge it back. If it doesn't, you can delete the branch and nothing is lost.

Think of branches as different timelines. They all start from the same point, but can diverge and later come back together.

### Local and remote

Your local repository is on your computer. A remote repository is on a server somewhere, like GitHub.
When you work on a project, you often have both. You make changes locally, then push them to the remote so others can see them.
You pull changes from the remote to get updates others have made.

`origin` is just the default name for your main remote repository. You can have multiple remotes if needed.

{{< imagetheme
    alt="Locals and Remote"
    darksrc="remote_dark.png"
    lightsrc="remote_light.png"
>}}
<!--
```mermaid
sequenceDiagram
    participant WD as Working Directory
    participant SA as Staging Area
    participant LR as Local Repo
    participant RR as Remote Repo

    Note over WD,SA: Making changes
    WD->>SA: git add

    Note over SA,LR: Committing changes
    SA->>LR: git commit

    Note over LR,RR: Syncing with remote
    LR->>RR: git push

    Note over RR,LR: Getting remote changes
    RR->>LR: git fetch

    Note over LR,WD: Updating working directory
    LR->>WD: git checkout
    LR->>WD: git merge
``` -->

## GUI apps

When I started out with git a long time ago, it was confusing to use a GUI app because I didn't understand what was happening under the hood.
The menu items matched the git commands, but I didn't have the proper mental model at that time.
That's why I learned the command line version first.

After understanding the basics through the terminal, GUI apps became much more useful.
They can show you visual representations of your branches, make it easier to review changes before committing,
and generally speed up your workflow.

### My favourites

Here are some GUI apps I've used or heard good things about:

- **[VS Code](https://code.visualstudio.com/)**: If you're already using it for coding, it has built-in git support that's quite good for basic operations.
- **[GitHub Desktop](https://desktop.github.com/)**: The official GitHub app. It's simple and works well if you're mainly using GitHub.
- **[SourceTree](https://www.sourcetreeapp.com/)**: Free and feature-rich, good for visualizing complex branch structures.
- **[GitKraken](https://www.gitkraken.com/)**: Has a nice interface and is popular among developers.
- **[Fork](https://git-fork.com/)**: A fast git client for Mac and Windows with a clean interface.

My recommendation is to learn the command line basics first, then pick a GUI that fits your workflow.

## Essential CLI commands

These are the commands you'll use almost every day. Don't try to memorize them all at once.
Start with the basics and build up from there.

### Getting started with a repository

```bash
# Create a new git repository in the current folder
git init

# Copy an existing repository from a remote location
git clone https://github.com/username/repository.git
```

### Checking the status

```bash
# See what files have changed and what's staged
git status
```

### Making commits

```bash
# Add files to the staging area
git add filename.txt
# Or add all changed files
git add .

# Create a commit with your staged changes
git commit -m "Describe what you changed"

# See the commit history
git log
```

### Working with branches

```bash
# List all branches
git branch

# Create a new branch
git branch feature-name

# Switch to a branch
git checkout feature-name

# Create and switch to a new branch in one command
git checkout -b feature-name

# Merge another branch into your current branch
git merge other-branch
```

### Syncing with remote repositories

```bash
# Get changes from the remote but don't merge them yet
git fetch

# Merge fetched changes into your current branch
git merge

# Fetch and merge in one command
git pull

# Send your local commits to the remote
git push
```

Note that `git pull` is essentially `git fetch` followed by `git merge`. Understanding this helps when things go wrong.

### Undoing changes

```bash
# Unstage a file but keep the changes
git reset filename.txt

# Discard changes in your working directory
git checkout -- filename.txt
```

### Modern alternatives

There are newer tools that aim to make git easier:

- **[lazygit](https://github.com/jesseduffield/lazygit)**: A terminal UI for git that's faster than typing commands
- **[tig](https://jonas.github.io/tig/)**: A text-mode interface for git that helps with browsing history
- **[delta](https://github.com/dandavison/delta)**: A syntax-highlighting pager for git that makes diffs easier to read

These can be helpful once you understand the basics.

## Gotchas

Here are some things that tripped me up when I was learning, and I still see them confuse newcomers.

### SSH keys for GitHub

When you try to push code to GitHub from a new machine, you'll likely hit an authentication error.
GitHub needs to know it's really you. The most common way to handle this is with SSH keys.

You need to [generate an SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) on your machine and
[add the public part to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).
GitHub's documentation walks you through the process step by step, but it's one of those things nobody mentions until you run into the error.

### SSH vs HTTPS

When you clone a repository or set up a remote, you'll see two URL options: HTTPS and SSH.

**HTTPS** looks like: `https://github.com/username/repository.git`

- Easier to set up initially, no SSH keys needed
- Uses your GitHub username and password (or personal access token)
- Can be slower for frequent operations
- Some corporate firewalls block SSH but allow HTTPS

**SSH** looks like: `git@github.com:username/repository.git`

- Requires SSH key setup (one-time process)
- No need to enter credentials every time
- Generally faster and more secure
- The standard choice for developers

Most developers prefer SSH once they've set it up. The initial setup takes a few minutes,
but then you never have to think about authentication again. With HTTPS,
you'll need to manage tokens or enter credentials more frequently.

You can switch between them later if needed using:

```bash
# Switch from HTTPS to SSH
git remote set-url origin git@github.com:username/repository.git

# Switch from SSH to HTTPS
git remote set-url origin https://github.com/username/repository.git
```

### Vim is the default editor

Sometimes git needs you to write a message or resolve a conflict, and it opens a text editor.
By default, this is often vim. If you're not familiar with vim, you'll open it, try to type,
nothing works properly, and you can't even exit.

The quick fix: press `ESC`, then type `:wq` and press Enter to save and quit. Or `:q!` to quit without saving.

The better fix: change git's default editor to something you know.

```bash
# Set VS Code as the default editor
git config --global core.editor "code --wait"

# Or use nano, a simpler terminal editor
git config --global core.editor "nano"
```

### Detached HEAD state

This sounds scary when you see it, but it's not as bad as it seems. HEAD is git's way of saying "where you are right now".
Normally, HEAD points to a branch. When you checkout a specific commit instead of a branch,
HEAD points directly to that commit. You're in a detached HEAD state.

It's fine for looking around at old code. Just don't make commits here unless you know what you're doing.
To get back to normal, checkout any branch.

```bash
git checkout main
```

### Line endings

This is platform-specific. Windows uses different line endings than Mac and Linux.
Git can try to handle this automatically, but it sometimes causes issues where files show as changed even though nothing actually changed.

You can configure how git handles this:

```bash
# On Windows
git config --global core.autocrlf true

# On Mac/Linux
git config --global core.autocrlf input
```

### Merge Conflicts

When two people edit the same part of a file and try to merge their changes,
git can't automatically decide which version to keep.
This is a merge conflict, and you'll need to resolve it manually.

When you pull and hit a conflict, git marks the conflicting sections in the file like this:

```bash
<<<<<< HEAD
your changes
=======
their changes
>>>>>> branch-name
```

To resolve it:

- Open the file and decide which changes to keep
- Remove the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
- Save the file
- Stage it with `git add filename`
- Complete the merge with `git commit`

Most modern editors and IDEs have built-in tools to make this easier,
showing you both versions side by side and letting you click to choose which one to keep.

### Force Pushing and Why Your Colleagues Won't Like It

Sometimes when you try to push, git refuses with a message like "Updates were rejected because the tip of your current b
ranch is behind its remote counterpart."

Git helpfully suggests using `git push --force`, but **this is almost always a bad idea on shared branches**.
When I started out I had an occasion where I thought if `git` told me there is option to put my code in the remote with a parameter that must be the thing I need. Then a very nervous colleague arrived at my desk and yelled at me for a bit never to do such thing again.
I learned my lesson.

Force pushing overwrites the remote branch with your local version.
If anyone else has based work on those commits you're overwriting, their history becomes incompatible with yours.
They'll get confusing errors when they try to pull, and they might lose work.

The safer alternative is `git push --force-with-lease`. This only force pushes if nobody else has pushed changes since you last pulled.
It's a safety check that prevents you from accidentally overwriting a colleague's work.

```bash
# Dangerous - overwrites no matter what
git push --force

# Safer - fails if remote has changed
git push --force-with-lease
```

Even with `--force-with-lease`, only force push on branches where you're the sole contributor, like feature branches.
Never force push to main, master, or any other shared branch unless your team has explicitly agreed to it and everyone knows it's happening.

If you've already pushed commits and realize you need to change something, consider just adding a new commit to fix it rather than rewriting history. It's not as clean, but it's much easier for everyone else working on the project.

## Moving forward

Once you're comfortable with the basics, there are some quality-of-life improvements you can make.

### Aliases

Git lets you create shortcuts for commands you use often. Instead of typing `git status` every time, you can set up `git st`.

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
```

I keep my aliases and other configurations in my [dotfiles repository](https://github.com/budavariam/dotfiles).
It's a common practice to version control your configuration files so you can easily set up new machines
with your preferred settings.

### Configuration tweaking

Git has many [configuration options](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration).
Here are a few useful ones:

```bash
# Set your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Use colors in the terminal
git config --global color.ui auto

# Set the default branch name for new repositories
git config --global init.defaultBranch main
```

You can see all your configurations with:

```bash
git config --list
```

### Ignoring files with .gitignore

Not everything in your project folder should be tracked by git.
There are files you want to keep locally but never commit to the repository.

Common examples include:

- **Dependencies**: Node modules, Python virtual environments, vendor folders - these can be reinstalled from package files
- **Build artifacts**: Compiled files, bundled assets, generated documentation
- **IDE settings**: Personal editor configurations that differ between team members
- **OS files**: `.DS_Store` on Mac, `Thumbs.db` on Windows
- **Temporary files**: Log files, cache directories, debug output
- **Secrets**: API keys, passwords, certificates (never commit these (!!!) )

You tell git to ignore these files by creating a [`.gitignore`](https://git-scm.com/docs/gitignore) file in your project root.
Each line specifies a pattern for files to ignore.

```gitignore
# Dependencies
node_modules/
venv/
__pycache__/

# Build outputs
dist/
build/
*.exe
*.dll

# IDE
.vscode/
.idea/
*.swp

# OS files
.DS_Store
Thumbs.db

# Environment variables
.env
.env.local

# Logs
*.log
logs/
```

GitHub maintains a collection of [useful .gitignore templates](https://github.com/github/gitignore) for different programming languages and frameworks. You can use these as a starting point for your projects.

### What not to commit

A common beginner mistake is committing everything in the project folder.
This leads to bloated repositories and potential security issues.

Here's what you should avoid committing:

#### Binary files and executables

Compiled programs, executables, and large binary files don't belong in git. Here's why:

- **Size**: A 50MB executable makes every clone and pull slower for everyone
- **Diffs don't work**: Git can't show meaningful differences between binary versions
- **Build from source**: Other developers should build executables from your source code
- **Platform-specific**: Your Windows .exe file is useless to Mac users anyway

#### How GitHub Releases solve this

If you need to distribute compiled binaries to users,
[GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) are the answer.

Releases let you:

- Attach binary files to a specific version tag
- Provide download links for different platforms
- Write release notes explaining what changed
- Keep binaries separate from your source code history

When you're ready to release version 1.0 of your project:

1. Create a git tag: `git tag v1.0.0`
2. Push the tag: `git push origin v1.0.0`
3. Go to your GitHub repository's releases page
4. Create a new release from the tag
5. Upload your compiled binaries as release assets
6. Write your release notes

Users can download the source code or the pre-built binaries, whichever they need.
Your repository stays lean, but your software is still easy to distribute.

Many projects automate this process with CI/CD tools that build and publish releases automatically when you push a new tag.

### Git hooks

[Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) are scripts that run automatically at certain points in the git workflow.
For example, you can run tests before every commit, or check your code style before pushing.

They live in the `.git/hooks` directory of your repository. You can rename the sample files there and customize them,
or use tools that manage hooks for you.

Common hooks include:

- `pre-commit`: Runs before a commit is created
- `pre-push`: Runs before pushing to a remote
- `post-merge`: Runs after a merge completes

This is more advanced territory, but it's good to know it exists when you need it.

I think it's best not to use long running tasks as pre-commit hooks, not to break the flow of developers.

### Modern git features

Git keeps evolving. Some relatively newer features that are worth knowing about:

- `git switch` and `git restore`: Newer commands that split the functionality of `git checkout` into clearer separate commands
- `git rebase --interactive`: Edit your commit history before sharing it
- `git stash`: Temporarily save your uncommitted changes

## Conclusion

Git has a reputation for being difficult to learn, and honestly, it can be overwhelming at first.
But you don't need to know everything to be productive. Start with the basics:
`clone`, `add`, `commit`, `push`, `pull`. Build your mental model of what git is doing.
Understand the difference between your working directory, the staging area, and the repository.

When you run into errors, read the messages carefully. Git usually tells you what went wrong and often suggests how to fix it.
Keep the [official documentation](https://git-scm.com/doc) and [GitHub's guides](https://docs.github.com/en/get-started) handy,
and don't be afraid to search for solutions online. Many developers have encountered the same issues you'll face.

The investment in learning git pays off quickly. Once it clicks, you'll wonder how you ever managed without it.
You'll experiment more freely, knowing you can always go back. You'll collaborate more easily.
You'll have a complete history of your project and be able to understand how it evolved.

Take it one step at a time, and before you know it, git will feel natural.

Happy coding!
