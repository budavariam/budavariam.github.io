---
layout: post
title: Starschema Hackathon 2026 Challenge
tags: []
cover:
    alt: Cover
    hidden: true
resources:
  - name: cover
    src: cover.png
date: 2026-01-10
draft: true
---

<!--more-->

Today was another working saturday switched from jan 2. Instead of a regular hackathon we got to choose from different activities. My main goal was to make my plotter work, that i failed to do so in the [earlier hackathon](/posts/2025/10/29/starschema-hackathon-2025/).

## Activities

Treasure hunt, yoga, chess, snowman building, shooting with airsoft. I chose to focus on my plotter.
I tried out shooting.

{{< figure
    src="shooting.jpg"
    caption="Score on my first try"
    height="300px"
    align="center"
>}}

## Plotter challenges

My goal for today was to get familiar with the corexy mechanics and figure out the config si that my 0,0 point is in a proper place and make sure homing works well. It'd be an icing on the cake if I got to a drawing at the end.

Yesterday I got the pen lifting work with my MKS DLC32v2. All I need now is to set the canvas.
Apparently I had 2 options and luckily I did not have to change the config. The board already had 2 Y motor slots with opposite directions. I had set up the endstop buttons in the right place.

During execution I had a little problem with the endstop modules. Its back-side is not properly isolated, I do not have a 3d case for it yet. So to prevent problems I attached some electrical tape on the back. Umluckily I tightened the nut so hard into the rail that the pins cut through the tape and caused a short circuit.

I had another problem with motor wire lengths, but luckily it's just an inconvenience, that I can not change the location of the board, but not a dealbreaker.

## Generate something nice

I wanted to close day by an ambitious drawing.

### Maze

I had an idea to generate a random maze patter, then with a tool change gcode (M10?) I can draw the solution with a different color, since my app handles this.
I made a quick maze generator code, but the image did not scale up properly, it ended uo in the top corner...

{{< figure
    src="maze.svg"
    caption="Generated maze"
    height="300px"
    align="center"
>}}

So I ditched it and dud a fallback to one of my first test images.

{{< figure
    src="maze.png"
    caption="It seemed too small"
    height="300px"
    align="center"
>}}

### Bauhaus art

{{< figure
    src="abstract.png"
    caption="Original stock photo"
    height="300px"
    align="center"
>}}

I have some python algorithms to enhance raster images into generative artworks.

{{< figure
    src="masterpiece.svg"
    caption="Circlular line art enhancement via python"
    height="300px"
    align="center"
>}}

I only  had tme for a single shot. I was satisfied by the soothing movement. 
There was one error in the generation where the pen was not elevated properly.
And I miscalculated the canvas size, in the rush I dud not consider the margins properly.

{{< figure
    src="masterpiece.jpg"
    caption="Plotted result"
    height="300px"
    align="center"
>}}

In hinsight I could have chosen a more recognizable shape, like a tattoo or a teapot...

{{< figure
    src="teapot.png"
    caption="Teapot I generated last year"
    height="300px"
    align="center"
>}}
