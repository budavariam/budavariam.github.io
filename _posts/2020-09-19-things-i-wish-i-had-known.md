---
layout: post
title: Things I Wish I Had Known As a Junior
tags: programming my-advice keyboard developer-toolbox
comments: true
---

A few days ago I read a question in twitter, what is the thing that you wish you had known when you started to code.

I started to learn programming in high school, we tackled the basics of the field, by learning sql,
networks, logic, binary calculations, imperative programming, but we did not really learn how these are going to work in real life.

I collected some concepts that work for me now during my day-to-day coding, that I did not use much when I started out.

- [Interpreters can help with quick calculations](#interpreters-can-help-with-quick-calculations)
- [Sandboxes are great to investigate problems in isolation](#sandboxes-are-great-to-investigate-problems-in-isolation)
- [Read as much code as you can](#read-as-much-code-as-you-can)
- [Debugger is usually easy to set up, and really useful](#debugger-is-usually-easy-to-set-up-and-really-useful)
- [Learning new programming languages comes easier with each new language](#learning-new-programming-languages-comes-easier-with-each-new-language)
- [Terminal can be simpler than GUI](#terminal-can-be-simpler-than-gui)
- [Typing is crucial](#typing-is-crucial)
- [Write documentation what you'd like to read](#write-documentation-what-youd-like-to-read)
- [Other advices I find helpful](#other-advices-i-find-helpful)

## Interpreters can help with quick calculations

For scripting languages like python, bash, javascript, I find it beneficial to have a
separate tab for a [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop)
environment.

It's comforting to have a mini sandbox to try out small snippets on the go without the need to run/restart the complex app that I develop.

## Sandboxes are great to investigate problems in isolation

In order to solve problems it's a good tactic to isolate the issue, and try to solve the actual problem.

For web projects I love online sandboxes, some of them have base templates and let me choose the frameworks that I want to include.

I can share them with my colleagues and we can experiment in them together independently.

- [CodePen](https://codepen.io)
- [CodeSandbox](https://codesandbox.io)
- [Repl.it](https://repl.it/)

## Read as much code as you can

Some of my university teachers told us, that it is good practice to read open-source library codes and try to familiarize ourselves with them.

I occasionally need to use libraries for special cases that are not documented, this advice really come in handy.
It empowered me to get my hands dirty and look into the source to figure out what happens under the hood.

In lucky cases they have tests for these issues, and can easily see how they should be used,
if that's not the case, the code still holds the truth of what they're capable of.

I like to read merge requests of my colleagues, and familiarize myself with the changes they made

## Debugger is usually easy to set up, and really useful

For me it was scary at first, I did not get a tutorial on how these things work.

It's pretty simple, mark the points where you'd like to stop code execution, start the code in debug mode, and make the code reach that point.
From there you can inspect the variables, step forward, step into function calls, continue execution, and many more depending on the language and IDE.

The simple debugging tactic is to log every variable that needs to be inspected, but it can be hard to determine what variable do you actually need.

Usually when I have to write vanilla javascript code, my main problem is that I can not always be sure what properties are available at a certain point for the available objects.
Debugger makes it easy to see the possible options.
Otherwise I'd need to guess what I need to log to the console, but this way I can just freeze time and look around.

Chrome devtools has a great intro article, if you want to learn more about [debugging in Javascript](https://developers.google.com/web/tools/chrome-devtools/javascript)

## Learning new programming languages comes easier with each new language

Programming languages have the same basic principles based on their paradigm.
If you need to learn a new object oriented language you don't need to relearn the concept,
just understand the differences in the syntax and the possibilities.

When you learn a new language you don't have to know everything about it at first, learn what's
enough and if you need to use advanced approaches you can find the answers to your questions later on.
The important thing is to practice.

I found it useful to have a script language that I know very well.
If I can quickly solve simple problems with it, it can boost productivity in my daily coding routine.

You can write mini disposable code to achive a one-time simple task, that you'd otherwise have to type out.
For example if you need to type the same pattern over and over, it's frustrating to figure out in the middle, that the pattern should be different. Generated code can save you from this nightmare.

Programming challange sites helped me achive learning new languages better by presenting
problems in an isolated state.
They do not require you to handle all errors and write production ready code, but still great for practice.
They make you able to focus on the way it has to be calculated.

My favourite programming challenge sites:

- [CodeSignal](https://codesignal.com/)
- [HackerRank](https://www.hackerrank.com/)
- [SPOJ](https://www.spoj.com/)

## Terminal can be simpler than GUI

If an application comes with a terminal, or command interpreter, it's worth it to learn to use what it's capable of.
Most of the time it involves less clicking and mouse movement to achieve the same thing, or even do many more options.

My favourite examples are Excel and AutoCAD.

In Excel you can select the commands from a form and add each parameter for a function.
But when it comes to nesting those params, you'll end up with juggling many windows.
At least it was the case in version 2003, I haven't really used new versions since then, but this experience stuck.
You have the option to write a formula, that's simpler, and the help menu and the next property hovers over the cursor anyways.
The only thing you need to be aware of, not to make any syntax errors.
I recall one time I needed a specific drawing command option, but it was not available as a button. TODO: look for it.

My favorite IDE is curretly VSCode, I always keep the terminal open in the bottom.
I can pipe together operations that would be impossible to do in the GUI of the operating system.

## Typing is crucial

I learned to code in Hungarian keyboard layout, and it's not the most coding friendly layout. In mac it's even worse,
the special characters are spread across the keyboard with cryptic shortcuts, in order to have all accented keys easily reachable.

![Hungarian QWERTZ layout](/assets/post/2020-09-19-things-i-wish-i-had-known_hu.svg)

It might not be news for you, but I figured that English layout is much more convenient. It has all the special characters I need at most one SHIFT key away.

![United states QWERTY layout](/assets/post/2020-09-19-things-i-wish-i-had-known_us.svg)

I learned touch typing by myself, when I realized that my typing speed could be enhanced.
There are some great sites and applications for that, there are even sites that let you practice writing code.

The best advice that helped for me is that you should not look at your hand when you're typing.

Some of my colleagues take it one step further, and do not really use their mouse at all. They edit code with modal editors
like vim, or [VSCode vim extension](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim),
and use [tiling window manager](https://en.wikipedia.org/wiki/Tiling_window_manager)s.

My favourite learning materials were:

- [gtypist](https://www.gnu.org/software/gtypist/): practice in the terminal offline
- [Typing Study](https://www.typingstudy.com/): helped me to learn the basics
- [Typing Club](https://www.typingclub.com/): great stories
- [Typing.io](https://typing.io/): practice typing code

## Write documentation what you'd like to read

In my first few months of coding at a company was a totally new experience unlike anything.
I had to familiarize myself with many things all at once.
I found myself asking the same questions all over again.
One day I saw a colleague taking notes in a Word document.
I realized it can save me a lot of time, and I can process the new information while I write them down.

I started out with simple txt files, later I changed to [markdown](https://en.wikipedia.org/wiki/Markdown), to get familiar with it.

Nowadays I find it useful to write README files for each project I'm working on,
to make it easier for others to get started.

Most importantly the docs I write help **me** get restarted, when I need to work on the projects again after a long time (more than 2 weeks).

The processes might seem logical at the time of writing, but a few projects and many new experiences/trends later it might not behave as what you'd expect them to be.

It takes effort to keep the docs up to date, but if you handle them as the main source of truth, it's going to worth it.

## Other advices I find helpful

- It's an underrated and invaluable skill to be able to search for the right terms about a problem you face,
  to find the documentation, discussions in the internet, articles about it, open or long closed github issues.
- Be curious, find the reasons, of why things misbehave, don't be satisfied with quick patches that seem to fix the issues
- Instead of inline parameters use variables with a clear names about it's intention
- Clean after yourself, leave the code cleaner than you found it, code will be read more than written. (Clean code, boy scout rule)
- Read through your changes before you submit a merge request, to avoid the mistakes that can be easily spotted
- Linters are good to keep a consistent style, and save you from common mistakes
- [Pragmatic programmer](https://en.wikipedia.org/wiki/The_Pragmatic_Programmer) principles
- [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
- [KISS](https://en.wikipedia.org/wiki/KISS_principle)
- [12 factor app](https://12factor.net/)
- [UX rules](https://lawsofux.com/)
- Practice practice, practice

...

Happz coding$