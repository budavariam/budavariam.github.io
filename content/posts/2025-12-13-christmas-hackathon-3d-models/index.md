---
layout: post
title: Prompting My Way Through 3D Models
tags: [hackathon, openscad, ai, prompt-engineering, claude-code]
cover:
  alt: Christmas Hackathon - AI Prompting Competition
  hidden: false
resources:
  - name: cover
    src: cover.png
date: 2025-12-13
draft: false
---

Another working Saturday means another chance to work on something outside of daily work.
This time I decided to do a solo hackathon to learn prompt engineering through creating 3D models.

<!--more-->

## The Teams

Since many people chose to spend this day as a vacation instead of a working day. There were not much "competitors" today. I chose to work alone, as I assume many of us did. Even half the evaluator committee was on vacation, so there was no formal evaluation today. 

I joined from the comfort of my own home, and I ordered some pizza to keep the Hackathon spirit.

{{< figure
    src="pizza.png"
    caption="Would it be a hackathon without pizza?"
    height="300px"
    align="center"
>}}

## The Goal

The assigment was to enhance our prompt engineering skills.
There was an option to enroll on a course or deliver something. I wanted to improve my hands-on experience.

My plan was to use `Claude Code` to generate `OpenSCAD` models through conversation,
build reusable component libraries, and complete a real project.
At the beginning it was not clear what would be the final goal, I could only think about ESP32 cases.
Later I figured it would be fun to generate an advent calendar with snap-fit doors.

## Building the Foundation

First step was getting Claude to analyze my codebase and write documentation.
It created a `CLAUDE.md` file that covered project structure, development commands, and OpenSCAD patterns.
I needed to set up a few extra rules to track my progress.

For example I asked Claude to save all my prompts in a file an suggest improvement opportunities so I could learn from it later.
This way I do not have to repeat myself in every conversation, these facts are taken into consideration (mostly) all of the time.


I started with a hello world example of a Case for a generic ESP32 project.

Then I asked Claude to build component libraries before jumping into the main project:

- Icons:
  - WiFi symbols (cut-out & embossed)
  - Temperature indicators
  - Learned how OpenSCAD separates projects into multiple files
- Components:
  - Parametric boxes and mounting plates
  - Snap-fit joints and living hinges
  - Cable clips and ventilation grids
  - PCB standoffs

### Takeaways

My early prompts were too vague, like "Create a box with mounting holes" got me something, but not what is immediately useful.

Claude suggested way better prompts, like: "Create a parametric box module with width, depth, height, and wall thickness parameters. Include four corner posts with M3 screw holes positioned 5mm from each edge.". I could see the results are less surprising and more of what I asked.

## The Showcase Project

Since here at home christmas music was playing for a while now, I decided to add some festive mood into this project as well.
So I asked for an Advent calendar.

The requirements I came up with:

- 24 doors in a 6×4 grid
- Snap-fit hinges (no metal parts)
- Numbers 1-24 in randomized order
- Embossed numbers for contrasting colors
- Vertical orientation to fit 3d printing

{{< figure
    src="case_all_wireframe.png"
    caption="Advent Calendar"
    height="300px"
    align="center"
>}}

It took me a few iterations to get it right.

### Iteration 1: Too Complicated

In my first attempt I asked for too much. I wanted something like IKEA calendars with variable door sizes in a random layout. But the generated result looked terrible, not dynamic enough, overlapping boxes. In one word it was a mess.

Simpler is usually better.

### Iteration 2: Wrong Orientation

After simplification I faced a new challenge. I wanted to orient it to the ground plane so that it fits printing without much modification.

With my initial prompts the box came out horizontal instead of vertical. 
Numbers looked bad when they were excluded from the shape, so I reiterated to elevate them from the doors.

To be fair it was my fault. I never said to make it "vertical" which axis shall it align to.
I just assumed Claude would know what advent calendars look like.
Lesson learned: never trust LLMs' judgement.

### Iteration 3: Alignment Problems

Wireframe showed doors not aligned with openings. Hinge holes in wrong spots. And the overall orientations were bad.

I said "align the doors" but didn't specify exact coordinates for door thickness and clearances.
I still used vague prompts, and hoped for the best.

Coordinate systems matter.

### Iteration 4: Number Rotation

After I got the doors right, the numbers stayed horizontal instead of vertical.

Rookie mistake to assume that my code used local coordinates for these items without asking for it.

## Automation

I built scripts along the way to make my job simpler:

- `generate_previews.sh` - 6 standard views (perspective, top, front, left, wireframe, blueprint)
- `optimize_pngs.sh` - Compress images 50-70% for git
- Makefile to run common tasks

## Prompt Engineering Lessons Learned

- **Be specific**: State dimensions, coordinate systems, exact positions.
"Vertical box" isn't enough - specify "Z-axis vertical, 400mm wide (X), 510mm tall (Z)".
- **Technical details upfront**: M3 screw holes need 3.2mm diameter. Snap-fits need 0.2mm clearance.
- **Visual feedback**: Generate previews after every change. Caught alignment issues only from wireframe view.
- **Document everything**: Kept audit log in `prompts/claude.md`. Helped spot patterns.
- **Start simple**: First instinct was variable door sizes. Stripping that out made it better.
- **Always validate**: If you don't know what the LLM creates you don't control it, and you're depending on it to find the issues.

## Final Result

I used my revealjs-cli module to generate a presentation about my journey. It is [available here](https://github.com/budavariam/hackathon-3dmodels/blob/main/presentation/presentation.md).

{{< figure
    src="stl_box.png"
    caption="Box"
    height="300px"
    align="center"
>}}

{{< figure
    src="stl_door.png"
    caption="Doors"
    height="300px"
    align="center"
>}}

## What I Learned Today

- OpenSCAD code generation
- Export to 3D printing format
- Iterative refinement is better than a single 'big ask'
- Clear technical communication is necessary for LLMs to control their behaviour
- Working with LLMs really feel like a slot machine, I insert the tokens and hope that I win the working solution

The solo format worked well for me today. There was no coordination overhead with others. I was able to iterate until things worked.

The single Saturday timeframe kept me focused on shipping.

Looking forward to actually printing this and seeing if the snap-fits work in real life.

Happy coding!
