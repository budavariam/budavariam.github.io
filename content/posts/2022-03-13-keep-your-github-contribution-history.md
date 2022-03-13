---
layout: post
title: Keep Your Github Contribution History
tags: []
cover: 
    image: /images/2022-03-13-keep-your-github-contribution-history/cover.png
    alt: Cover
    hidden: true
date: 2022-03-13
draft: true
---

Have you ever been in a situation where you work for a few repositories over a prolonged period of time, and all of a sudden you're notified that you'll no longer have access to these repos in a few weeks?

<!--more-->

## Contribution history is not a good metric

Nowadays it's trendy to try to figure out how active a developer is, by looking at their contribution history.

Even though it's not a good metric for many reasons:

- Not all developers use github
- Contributions can be spread across many repository hosting services even on-prem private ones
- The number of commits does not say anything about their quality

Anyways, it bothers me a bit when this happens.
When all those nice lil' green boxes go away.

## How to mitigate

There are a few options.

I must mention that you should **NOT** save the repo privately.
If they took away your access, chances are high, that you should get rid of the confidential codebase.

### Star the private repo

I found [this thread](https://github.com/isaacs/github/issues/1138), that talks about this exact issue.

>>> "We recommend starring any repositories you contribute to. That way, your commits to those repositories will remain in your contributions graph even if you leave the organization that owns the repository or delete your fork of the repository" from [Support-Protips](https://github.community/t5/Support-Protips/Getting-all-your-commits-in-your-contributions-graph/ba-p/19)

This comment might save the day.

### Save the commit metadata to a separate repo

If you only care about commit contributions, you can:

1. Create a single private repo for lost contributions
1. Filter the given repo with only your commits
1. Recreate the commits in the new repo without any sensitive data
1. Set up github to show private contributions in the activity history
1. Enjoy

You have to make sure that the commits conform to the [rules to be counted](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-graphs-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile).

It might sound as cheating, but keeps your contributions safe even if the organization gets deleted, or the repo is removed.

### Accept it and move on

There are more serious matters nowadays, that you can worry about. Why bother?

## My approach

For a small programming exercise I created a small python script that follows the steps described [above](#Save-the-commit-metadata-to-a-separate-repo).

{{< hgist 300px budavariam e946ecde50dee226ed2ec218e0c497d2 >}}

You only need to modify the code insde the `main` function to personalize.
It needs a list with the project names and locations, and the target repo to work with.

During development I created a single repo for all different repos and used the project name as a branch and the message of the commit as well.
The commits will only show up in my contribution graph, when I merge them back to the main branch.

How the `process_repo` code works:

- `get_email_addresses`: 
  - Lists all found email addresses of the contributors
  - Waits for you to select yours as a space separated list
- `get_filtered_commit_history`:
  - Goes through all of the commits, filters yours based on the email selection
- `prepare_repo`:
  - Tries to `git init` the target repo, switches to the new branch called similarly as the given project name.
- `create_commits`:
  - Creates new commits into the target repo's target branch by modifying a single file with the commit's date

## Summary

Writing this code gave me some hope that I can have some control over my contribution graph.
It was a great exercise, but I might not use it for real at all.

Happy coding!
