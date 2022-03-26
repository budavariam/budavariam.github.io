---
layout: post
title: Starschema Hackathon 2022
tags: [hackathon, my-solution, react, javascript, challenge]
cover: 
    image: /images/2022-03-26-starschema-hackathon-2022/cover.jpg
    alt: Inside of empty aircraft before departure
    hidden: false
date: 2022-03-26
draft: false
---

New Year, new transferred working day. Luckily we had the opportunity to do something fun in a Saturday instead of just extending our work week. So we had another Hackathon! {{< emoji `:tada:` >}}

<!--more-->

## Our Idea

Now that the weather starts to be better, people tend to go back to the office.
Since there could be weeks since they've been there the last time, their usual sweet seats might have been taken by someone else.

What if we could book seats just like meeting rooms in advance?

## Team

We have an internal portal with many fun addons, we decided to extend it with a functionality smilar to
[Officely](https://www.getofficely.com/), but with even more granuality.

We wanted to let the workers mark that they'll show up in the office AND book their preferred seats in advance at once.

Our team of 5 was split into 3 parts:

- backend + db: to store the requests
- visuals: create the pixel perfect image mapping
- frontend: create the logic to show the boxes and communicate with the DB (that's me)

## Result

We did not have time to connect all the dots together, but luckily we reached a point to
have a demoable state of the frontend with some magic numbers.

I've created a small [github](https://github.com/budavariam/hackathon-seat-booker) repo to catch the essence of the work.

![look and feel](/images/2022-03-26-starschema-hackathon-2022/lookandfeel.png)

> In our internal portal it looks much fancier.

We got the most votes from the other contestants, and took 1st place (out of 7 teams). {{< emoji `:tada:` >}}

## Image map creation

During the day we had to improvise how to come up with data.
For the proper data matching we needed to map each locations with the DB.
It was a bit slow to get each seat's ID and location properly manually.

Later I figured that [Inkscape](https://inkscape.org/) has a `Calligraphic Brush Stroke Pen`, that I can use to create small circles, and collect their x,y coordinates later.

![image-map-creation](/images/2022-03-26-starschema-hackathon-2022/image-map-creation.png)

Bash is [my friend](/posts/2021/02/18/grep-sed-awk-filters/), all I needed to do to extract the sizes is to look for these `circle`-s, and get their properties.
I made an assumption that the order is `cx`, `cy` and `r`, and I only needed the first 2.
In VSCode I could easily paste the result to the `constants`.

```bash
grep 'circle' /tmp/floorplan.svg \
    | sed -E "s/[<>=a-zA-Z\"/]//g" \
    | awk '{printf("[%d, %d]\n", int($1), int($2))}' \
    | pbcopy
```

## Further development

I'm pretty sure that we'll finish this up, and put it into the portal.

During development we already had some ideas:

- Show who booked the seats
- Cancel booking
- Mark as dedicated seat

## Summary

We had much fun, I really liked how everyone was into our idea, and we were able to present a seemingly working solution.

I'm looking forward to the next Hackathon.

Happy coding!

Cover Photo by [Kelly L](https://www.pexels.com/@kelly-l-1179532/) from [Pexels](https://www.pexels.com/photo/inside-of-empty-aircraft-before-departure-3861783/)