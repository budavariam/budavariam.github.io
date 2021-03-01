---
layout: post
title: Regular Expressions Are Awesome
tags: [ programming, regex, developer-toolbox ]
date: 2021-01-18

---

From time to time I come across a rant on Twitter, that regular expressions are
confusing and hard in general. I think if you know the basic building blocks of it,
you'll see how useful they are, and you can unleash its power in your daily coding life.

You do not have to know everything about them to be productive with them.

## What are regular expressions

To put it simply, a regular expression (regex, regexp) is a sequence of characters that defines a pattern, that can be used on other strings to see whether they match the pattern or not.

It has roots in [formal language theory](https://en.wikipedia.org/wiki/Regular_expression#History).

You can imagine a regular expression as a machine, that checks whether the input string corresponds to its precoded rules or not.

### Base building blocks

Char | Description
---- | ----
`[`*characters*`]`| Matches any character in *characters* (can be an interval)
`[^`*characters*`]`| Negation: Matches any character that is not in *characters*
`|` | Matches any one element separated by the pipe (`|`) character
`.` | Match any 1 character (except linebreaks)
`?` | Matches the previous element zero or one time
`*` | Matches the previous element zero or more times (greedy, it matches as much as it possibly can)
`+` | Matches the previous element one or more times (greedy)
`()`| Creates a capture group, that can be extracted, or checked for repeating, assigns a number for it starting from 1
`^` | Marks the start of the line
`$` | Marks the end of the line

You can build many patterns out of these simple building blocks. Here are a few examples.

- `[a-zA-Z]+` matches any word that consists of upper or lowercase letters of the English alphabet
- `[0-9]+` matches any character string that constist of only numeric characters
- `th[ae]n` matches *than* OR *then*
- `winter|spring|summer|autumn` matches one of 4 seasons
- `^line$` matches a line that only contains the text *line*
- `[^02-9][8-9][1-4][0-9]` matches numbers between 1810-1840 OR 1910-1940
- `(key)?board` matches *keyboard* OR *board*
- `(https?|ftp)://` matches *http://*, *https://*, *ftp://*

It's not always reasonable to write down all possible matches, but it's always a good idea to keep the possibilities in mind.

- `a+(bb|dd)*c?$` matches text that follows the pattern: at least 1 `a` followed by 0 or more occurrances of `bb` or `dd` and an optional `c` at the end

### Advice to read regexp

In order to understand what can a certain regular expression match, you need to follow these simple rules:

1. Read it from left to right
1. Do not skip any characters
1. If you encounter unknown syntax, read the appropriate docs, or use a tool like [regex101](https://regex101.com/)

Tip: Syntax highlight and bracket matching usually helps to understand complex expressions.

### Advice to write regexp

- Keep it simple
- Make sure it's readable for others. I like to comment my intentions, in case the expression seems confusing
- Use `.` sparingly
- Try to keep greedy patterns to the minimum, for performance (see [ReDoS](https://en.wikipedia.org/wiki/ReDoS))

## Some "advanced" concepts I like to use

- Word boundaries: `\b` allows you to perform a "whole words only" search with e.g: `\bword\b`
- Shorthand character classes
  - Whitespace: `\s`
  - Word:  `\w` stands for `[A-Za-z0-9_]`
  - Digit: `\d` stands for `[0-9]`
  - Negated forms: `\S`, `\W`, `\D`
- Backreference: match the same text as the marked capture group
- Non-capturing groups: `(?:)` do not store the result of the group
  - `(?:19)?(9[0-9])` matches numbers 1990-1999 OR 90-99, but captures only the second group
- Non-greedy matches (`*?`, `+?`) try to keep the match to the bare minimum so that the remaining part matches
- Exact number of matches
  - `{n}`: Matches the previous element exactly `n` times
  - `{n,}`: Matches the previous element at least `n` times
  - `{n, m}`: Matches the previous element at least `n` times and at most `m` times

Good to know about:

- [Lookahead/Lookbehind assertions](https://www.regular-expressions.info/lookaround.html)
- [Named groups](https://www.regular-expressions.info/named.html)

## Where can we use them

Nowadays they can be used almost anywhere where there's an option to process/match text.

Most modern text editors have an opt-in option to use regular expressions in search.
The best part is that they usually support replace patterns with regular expressions.
That means that, you can use capturing groups in the replacement part.

UNIX/Linux utilities like `sed`, `(e)grep`, `find`.

Programming languages generally support regular expressions.

For finding text in codebases via command line I often use [ack-grep](https://beyondgrep.com/) or its speed optimized competitor [ag](https://github.com/ggreer/the_silver_searcher).

Different programs can use different regular expression parsing engines, they can differ in what functionalities are available or what syntax do they use. It's always reasonable to check the appropriate docs when writing complex expressions.

## Sites I recommend

- In my opinion, the best way to understand and debug your regular expressions is [regex101](https://regex101.com/)
- [regular-expressions.info](https://www.regular-expressions.info/) is a comprehensive colorful tutorial on regular expressions
- [Regexcrosswords](https://regexcrossword.com/) is a mindboggling brainteaser, where you can practice your newfound knowledge

Happy Coding!
