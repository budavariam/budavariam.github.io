---
layout: post
title: Quickly test mail sending through SMTP
tags: [python, smtp, email, telnet]
cover: 
    alt: Mail
    hidden: false
resources:
  - name: cover
    src: cover.jpg
date: 2021-08-04
---

In the past few days I've been working with a code where I needed to see whether the service successfully sends mails through SMTP.
I did not want to use or set up an actual mail server locally.
As is turns out Python has a oneliner to solve this situation.

<!--more-->

## Python oneliner

Python by default has a module called [smtpd](https://docs.python.org/3/library/smtpd.html), that you can use to event implement SMTP servers.
Though it's deprecated in favor of [aiosmtpd](http://aiosmtpd.readthedocs.io/), it's still useful for my purposes, namely to intercept outgoing messages.

```bash
python -m smtpd -n -c DebuggingServer localhost:2500
```

It's as simple as this.

## Test it out

For testing out that it really works, I used `telnet`.

```bash
telnet localhost 2500
# The lines below should be typed into telnet, WITHOUT the starting `>`
> helo localhost
> mail from: sender@example.com
> rcpt to: receiver@example.com
> data
Subject: Integration test email #1

This template is used by integration tests only.
> .
> quit
```

And the message will appear in `stdout` of the `DebuggingServer`.

```text
---------- MESSAGE FOLLOWS ----------
Subject: Integration test email #1
X-Peer: 127.0.0.1

This template is used by integration tests only.
------------ END MESSAGE ------------
```

Happy coding!

Cover Photo by [Ylanite Koppens](https://www.pexels.com/@nietjuh) from [Pexels](https://www.pexels.com/photo/letters-and-an-eyeglass-on-table-1809342)