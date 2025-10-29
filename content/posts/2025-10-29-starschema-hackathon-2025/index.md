---
layout: post
title: Starschema Hackathon 2025
tags: [hackathon, cnc, plotter, ai, ollama, comfyui]
cover:
    alt: Cover
    hidden: false
resources:
  - name: cover
    src: hackathon-3.jpg
date: 2025-10-29
draft: false
---

It's been a while since I wrote a post. Last weekend was a typical bridge
workday, when the company usually gives an option to work on something mind blowing and fun.

<!--more-->

## Previous Hackathon

The last such occasion was 17th of May, when I was working on setting up a digital twin of a robotic arm in Meta Quest.
While the others were building the robotic arm and making it function as intended.

Aaanyways when that hackathon was over, the organizers pitched, that the next hackathon will be in October,
and ideas that combine AI and Robotics are more than welcome. At that time I was really into drawing,
and my idea started to grow, that I want to make an AI driven CNC pen plotter.

## Idea for this Hackathon

My goal was to create a web application, that drives the whole process of creating art and putting it into the paper.

![steps](./steps.png)

I split the process into seemingly logical parts:

1. Select image Source
2. Adjust Raster image to a new Raster image
3. Transform Raster image to SVG
4. Run SVGo optimizer optionally
5. Convert SVG to GCode
6. Optionally Preview Gcode in the app before sending
7. Send GCode to the plotter

I chose [CNC.js](https://cnc.js.org/) as my GCode sender, and wrote my UI code as a custom typescript widget.

I bought an entry level CNC so that I don't have to go deep too soon and drown in the
possibilities of designing my own structure, and fine tune it to perfection.

### Original plan

My orignal plan for this hackathon was a workflow to:

1. Take a picture of a person in front of the camera
2. Enhance the image with AI to add silly face expressions
3. Generate line drawing sketches with recognizable face
4. Draw them to the person as if they're at a photobooth.

Technically my app is capable of doing it, but I had lower level problems before I could achieve this workflow.

![photobooth_0](./photobooth_0.png)

![photobooth_1](./photobooth_1.png)

![photobooth_2](./photobooth_2.png)

![photobooth_3](./photobooth_3.png)

### Technical Challenges with the Photobooth

While I was developing I found some issues that made this challenging.

#### AI Image enhancements

First of all I did not want to pay for hobby development to an AI image enhancement service,
so I needed to find a local engine. Luckily I found [ComfyUI](https://www.comfy.org/) fairly quickly, and fell in love with its ease of use.

After that I needed to find pretrained models, that work well. I found models for drawing realistic faces,
and models to actually do the sketches from the face.

#### Model Biases

When I got to the point of testing out the facial expression modifications I was a bit shocked,
 when the test image of a man smiled back at me as a woman.
 Apparently these models were a bit biased, and the terms I used to ask for some facial expressions did a gender swap as well.
 Prompt engineering to the rescue, when I added gender specific expressions to the mix these biases went away.
 To prevent malfunction, and surprises I added an explicit selector if I shall add masculine or feminine terms to the prompt.

![Bias 0](./bias_0.jpg)

![Bias 1](./bias_1.png)

#### Line sketch

I figured out ways to create a sketch from the image. I found edge detection working really well,
I also found a model that I could use through comfyUI to do the heavylifting for me.
The most challenging part was to clean up the rubbish, that shall not be in the image, and preferably do it automatically.

![Sketch](./line_sketch_0.png)

#### Recognizable face

The most challenging part was to actually make it look like a face.

I haven't yet solved this issue, I have some heuristics to detect the background and remove it,
try to detect the face and make its features stronger. But it can not handle light differences and accessories well.
So I parked this for a while.

![Face](./recognizable_face.png)

### Moving on

Due to these problmeatic parts, I figured if I was not able to fix it in my limited free time over weeks,
I won't be able to solved them in a single day, so I tried to limit the scope, while still adding new and new features that seemed fun before the big day arrives.

While I was developing the app my order arrived with the parts, so I spent a day assembling it, and trying it out.
To my surprise this particular device only worked with its proprietary software.

As I learned, the internet is filled with generative art and CNC enthusiasts, so I found ideas on how to circumvent this problem.
I ordered new parts, and decided, that I'll spend the hackathon day to assemble the new controller.

## Hackathon day

![Our desk](./hackathon-1.jpg)

Before the event, during registration I pitched my idea, and marked that I don't have a team, so some colleagues joined to my efforts.
One of them helped me with a 3D printed case (thank you Zoli!) and another brought in his actual working plotter (thanks Dénes!).

### Hardware dev

Things started out slowly, I spent the morning wrapping my head around the different options I had.

My goal was to use my software instead of a windows-only app, and make the basic functionality
live as in move the X and Y axis motors, and lift the pen with a servo.

I bought an MKS DLC32 v2 with a TFT screen. I realized that I can not simply make the pen lift function work with the
stock firmware, so I decided to switch to [fluidnc](http://wiki.fluidnc.com/en/home).
And shed a tear of why I did not chose [Arduino with a CNC shield](https://www.instructables.com/3020-CNC-Arduino-GRBL-CNC-Shield-V3/).
Since fluidnc does not support displays, and this display was designed specifically for this board I put it away as well.

I started by connecting the motors, and the stepper drivers. Another reason I regretted my choice retrospectively is
that it's not UART capable, so I need to set up the stepper motors manually.
I collected all my strength and grabbed a multimeter to set up the
[Vref](https://www.circuitist.com/how-to-set-driver-current-a4988-drv8825-tmc2208-tmc2209/) for my TMC2208.
After I set it to a seemingly safe value I was extremely satisfied when the motors started to move smooth.

![My first line](./hackathon-2.jpg)

### Digital Fingerprint

Then I moved on to the next step to make the pen lift functionality work. That's where I hit a wall for the day.
I did not found clear reference on how to make it work, and I did not bring dupont cables to play with the pins.
(Sidenote: yesterday night I figured out that I can use pin 25 as PWM to control the Z axis :tada: ).

Dénes had an idea to make a wordplay on digital fingerprints and someone's identifiabilty by their commits in a github repository.
So he was working on an algorithm to fetch github commits and merge them into a seed for a random noise generator
to make a [curl noise](https://en.wikipedia.org/wiki/Simulation_noise#Curl_noise), that can be transformed into an oval fingerprint like structure.

After my failure I joined in to add his implementation to my site. The challenge in it was that my site only
support image processing methods written in python, but he did it in p5.js, so I needed to add a new image
generator method that takes a p5.js code, runs it and take the image, and works with it to generate the image and the drawing.

![fingerprint 0](./fingerprint-0.png)

![fingerprint 1](./fingerprint-1.png)

![fingerprint 2](./fingerprint-2.png)

![fingerprint 3](./fingerprint-3.jpg)

### Day closure

I presented my app, and the digital fingerprint idea with the drawing that we made. People really liked it,
they come to me afterwards to ask about specific parts, and they really liked that we had an actual machine that they could touch.

I did a quick demo to generate GCode and made it into preview stage, but we could not set the plotter up
for a live demo this time as the mechanical switches started to malfunction by the end of the day.

## Fun features

As I mentioned I spent months on this project, so I added a bunch of things that I wanted to try for a long time,
also when I developed a new method I figured other things that would be fun to do. I managed to do these:

- Embed Monaco editor to a website for a long time
- Host a jupyter server to run jobs
- Try out agents that use MCP server
- Send jobs to celery workers
- Write a log-collector service and inspect logs in kibana
- write a server in rust that handles image processing
- try protobuf for backend to backend communication
- read from MacOS camera stream to python via docker
- generate QR codes
- have my own gcode preview instance
- GRBL simulator
- use httpd to share files to have a retro feeling with apache FTP servers
- try out streamlit
- Run user written python scripts in the backend with safety measures embedded, with some templates like:
  - zentangle drawer
  - postcard writer according to Hungarian letter format
  - weather info through API
- generate text that looks like handwriting using single line fonts from TTF and Herhey vector fonts, adding jitter and making sure the SVG is not too complex
- config encoder and decoder to svg and gcode files to ease reproducibility
- GCode sender via websocket to fluidnc in case I cannot make it work with cncjs
- handle GCode tool change with multiple colors and stroke width

I practiced AI Driven Development a bit when a function seemed fun to have to showcase,
but I did not have the mental capacity to dive deeper into it.
There were features that was developed by AI and then I sat down and fine tuned when I had better idea.

### SVG to Gcode Generation

Initially I thought it's a solved problem to convert SVG to machine code.
I found tools that aim to do this, but they did not fit my extensibility needs. So I ended up coding it from scratch.
I do not plan to support every css feature of SVGs, but I support the svg elements like `circle`, `ellipse`, `rect`, `line`, `path`, `polyline`, `polygon`.

#### Tool change

I added support for handling color and stroke widths by grouping them into tools that are supported by GCode,
so basically if a user wants to use 2 colors CNCjs will stop halfway and ask the user to change the tool manually,
and then confirm that the tool change happened, and when they click the button the drawing continues.

#### NP-complete

The trickiest part is to add more and more optimizations to the mix. Since the optimal path calculation is NP-complete,
like the Travelling Salesman problem, I decided I let others do it for my code and chose [ORTools](https://developers.google.com/optimization)
by google to handle the path order. I added heuristical points to each path segment to optimize on.

#### Approaching the Shapes

Another challenging pieace was to determine which direction shall the plotter appriach my shape.
At first each of my shapes were drawn from the bottom left corner. Imagine you have 4 rectangles in a 2 by 2 grid.
The optimal drawing order is definitely not the one where you travel through the whole shape just to arrive to that specific corner on the bottom left.

So I added dynamic code generation after the optimization. When I assemble the final machine code,
my module tracks the current location of the pen, takes the next segment, and chooses the entry point closest to the pen,
and draws the shape as if it was originally started from that point. For circles I find the closest path and draw 2 semicircles.
For paths, polylines I need to check whether it's a closed shape, or I only have 2 entrypoints.

### AI MCP server

The internet is full of AI, MCP servers and Agents. I haven't jumped on the hype train yet,
because I do not have a personal subscription for any of the big model providers, and any time
I tried to run agentic code editing locally my machine basically froze.

I really liked the idea to have a chat app where I can ask an LLM to generate some text for me,
and have it use an MCP server to actually ask another service to do the work.

![ai handwriting 1](./ai_handwriting-1.png)

I found a local model for [ollama](https://ollama.com/), that supports agentic behaviour and I was able to set it up: `qwen3:8b`.
I chose [FastMCP](https://gofastmcp.com/) to spare many hours of headaches of low-level MCP implementation and focus on the fun parts to wire things together.

I added 2 tools:

1. One that generates the SVG using the handwriting image generator.
2. Another one that generates machine code from the last SVG and lets the user download or preview the image


![ai handwriting 2](./ai_handwriting-2.png)

### Docker Serial connection

As I learned in Mac docker can not make serial connections with the USB devices that are connected to the machine,
so I needed to figure out a way how to sneak this info through.

My solution is to have a taask running alongside my docker-compose script that runs [ser2net](https://github.com/cminyard/ser2net),
and forward it to a TCP port. Then have a service inside docker, that runs a [socat](https://linux.die.net/man/1/socat)
command that maps it into a virtual /dev device. To all my surprise it works pretty well.

I haven't yet found how CNCjs support streaming gcode over the network, but in theory this way could work,
I just need to rewire `socat` to the network address of the CNC instead of `ser2net`.

### Improvement possibilities

As I mentioned I have a bunch of ideas how to enhance this project.

One of them is to have a scheduled task runner. So that I can spice up my life with a morning note that is read from my calendar,
and has my schedule for the day in a paper along with the expected weather, and the quote of the day.
It would promote being analog and get away from my phone in the mornings.

## Closing words

I really enjoyed this hackaton, it was challenging, action packed, and full of surprises.
My adrenaline level was peaking due to the time pressure, the last minute presentation hacking is always fun.

![Plotter](./hackathon-0.jpg)

After my presentation I got a feedback, that this project was almmost like more than one hackathon project.

I think now I know what they meant.

Happy coding!