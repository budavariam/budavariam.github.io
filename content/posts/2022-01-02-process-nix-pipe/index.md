---
layout: post
title: Process *nix pipe with a script
tags: [cli, javascript, node, python]
cover:
  alt: Waterfall
  hidden: false
resources:
  - name: cover
    src: cover.png
date: 2022-01-02
draft: false
---

I came across situations in the past where I needed to modify a pipe just slightly.
I immediately knew how to do it imperatively but could not develop a feasible chain of *nix utilities in a reasonable time.

Here's where my knowledge of a scripting language comes in handy.

<!--more-->

## UNIX Philosophy

One of the main points of [UNIX philosophy](https://en.wikipedia.org/wiki/Unix_philosophy) is to write simple code.

Peter H. Salus summarized it well:

> - Write programs that do one thing and do it well.
> - Write programs to work together.
> - Write programs to handle text streams because that is a universal interface.

Take this chain, for example.

```bash
seq 1 10 | shuf | tail -5 | sort -n
```

It removes 5 random items from the list 1-10.
First, it generates the 10 numbers, then shuffles the list, takes the last five items, and sorts the list back.

## Toolbox

If you're a command-line magician, the chances are high that you can chain together the built-in utilities to achieve what you need in most situations.
If you're familiar with [sed or awk](/posts/2021/02/18/grep-sed-awk-filters/), it increases your chances.

Otherwise, one option would be to save the current stdout to a file and write a script in a language that you're familiar with to process that file.
Then continue the pipe from its stdout.

And another option is to process the input Stream.

The power of the method I'm writing about shows up when you need to do some tricky calculations.

## Pipe example

For illustration, I created a pipe that writes 20 random numbers into the stdout every second.
And the task I came up with for now is to multiply each number by five,
pass them forward immediately on stdout, and print the summary at the end.

The `initpipe` function creates this chain into a [named pipe](https://en.wikipedia.org/wiki/Named_pipe) called `mypipe`.

```bash
function initpipe {
    # init 20 random numbers between 1-100 (inclusive)
    rm -f mypipe
    mkfifo mypipe
    seq 1 20 | \
    awk \
        -v min=1 \
        -v max=100 \
        -v seed=${1:-42} \
        'BEGIN{srand(seed);} {print int(min+rand()*(max-min+1)); system("sleep 1")}' \
    > mypipe &
}
```

I know it's SOOO easy with awk, but let's move on, and see how we can do it in Python and JavaScript.

```bash
initpipe "$RANDOM";
tee /dev/tty < mypipe | awk 'BEGIN {res=0;} {curr=int($1) * 5; res += curr; print(curr); } END { print(res) }'
```

I'll use `tee /dev/tty` to show the current line to process. It might not be available on every OS.
It's not even necessary. It's there for visualization.

## JavaScript

If you plan to run JavaScript code in the command line, you need to pick an interpreter and see how it connects to the standard input.
I usually choose node.js for this purpose. It uses a [readable Stream](https://nodejs.org/api/process.html#processstdin) to access stdin.
Then on `data` event, it spits out a [Buffer](https://nodejs.dev/learn/nodejs-buffers).

The code below loads the processes the stream line by line:

```javascript
const stdin = process.stdin;
let result = 0;
stdin.on("data", (buf) => {
  const curr = parseInt(buf.toString().trim()) * 5;
  process.stdout.write(curr);
  result += curr;
});
stdin.on("end", () => {
  process.stdout.write(result);
});
```

Save it as, e.g. `multiplybyfive.js` and call it as:

```bash
initpipe "$RANDOM";
tee /dev/tty < mypipe | node multiplybyfive.js
```

There can be other solutions by using npm packages, but I aimed for a solution without additional packages.

### Node one-liner

If you're into ugly solutions, you can call it without saving it into its separate file:

```bash
initpipe "$RANDOM";
tee /dev/tty < mypipe | node -e 'let i=process.stdin,r=0,o=process.stdout;i.on("data",(c)=>{const c=parseInt(c.toString()) * 5;res+=c;);i.on("end",()=>{o.write(r)});'
```

## Python

In python, the [sys](https://docs.python.org/3/library/sys.html#sys.stdin) package lets you access the standard input, and you need to read it line by line.

```python
import sys
import os
result = 0
for line in iter(sys.stdin.readline, ''):
    curr = int(line) * 5
    result += curr
    sys.stdout.write(str(curr) + os.linesep)

sys.stdout.write(str(result) + os.linesep)
```

### Python Oneliner

The above code would look even uglier than the javascript version, but if you only need the final result, you can use a simplified version:

```bash
initpipe "$RANDOM";
tee /dev/tty < mypipe | python3 -c "import sys;print(sum([int(line) * 5 for line in iter(sys.stdin.readline, '')]))"
```

## Summary

I hope it will help you as much as it will help me.

Happy coding!

{{< photo_credit
    img-site="Pexels"
    artist-name="Rifqi Ramadhan"
    artist-url="https://www.pexels.com/@rifkyilhamrd"
    img-url="https://www.pexels.com/photo/photography-of-waterfalls-between-trees-788200/"
>}}