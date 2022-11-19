---
layout: post
title: Log4Shell Check
tags: [security, java, log4shell, docker]
cover:
  alt: Log4Shell logo
  hidden: false
resources:
  - name: cover
    src: cover.jpeg
date: 2021-12-14
---

Unless you were under a rock for the past couple of days, I assume you've heard about log4shell.
The [RCE](https://en.wikipedia.org/wiki/Arbitrary_code_execution) exploit of the popular Java logging module [log4j](https://logging.apache.org/log4j/2.x/), that caused havoc all over the internet.
I haven't worked with Java for years, but I'm curious if my projects are vulnerable to this exploit. Let's find out.

<!--more-->

If you prefer, you can call it [CVE-2021-44228](https://www.cvedetails.com/cve/CVE-2021-44228/).

## The Main problem

I found a great tool [log4j-detector](https://github.com/mergebase/log4j-detector) to check my source codes for nested embedded log4j versions.
My problem with it is that it's written in Java, and I didn't want to spend time installing it into my machine.

I like to work with docker, so I decided to run in it. After a few minutes of search
I did not find any suitable image, so I decided to create one instead.

I put my code on my [github repo](https://github.com/budavariam/log4j-detector-docker).

Luckily it did not find any vulnerable version :) hooray.

I know that it does not mean that everything is in perfect condition. But it's as good as the tool gets.
I will look deeper into this issue to know how to defend against it.

## Conclusion

I'm sure things will move pretty fast, and there will be uprising tools to look for these issues and fix them.
Hopefully, we can get over it soon.

Happy coding!

<!-- twitter_simple GossiTheDog 1469252646745874435 -->
