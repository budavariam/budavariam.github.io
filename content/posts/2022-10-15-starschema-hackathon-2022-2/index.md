---
layout: post
title: Starschema Hackathon 2022 (again!)
tags: [hackathon, challenge]
cover:
    alt: Cover
    hidden: false
resources:
  - name: cover
    src: cover.jpg
date: 2022-10-15
draft: true
---

Luckily this year had another transferred working day, and the tradition continues: our company gifted us with an opportunity to work on some fun projects in this Saturday working day.

<!--more-->

This time I decided to join an already existing idea and try to do my best over there.
I was hoping that I can just contribute follow the dream, and it'll be less stressful,
thus I can enjoy the endless pile of pizza more.

## Rough Start

It was not that simple. The idea holder had a clear goal on what shall be done,
and motivated a bunch of people with various skillsets to this team.
Earlier I also convinced 2 of my direct teammates to join.

Finally our team grew into 9 people. We not only faced difficulties with the technical challenges,
we needed to manage upcoming problems and keep track of how each part of the application is doing.

We only had around 6 hours. The time was ticking.

## The idea

In our internal toolset there's not a simple way to extract details from the only
Hungarian Train company's ticket format for our finance team.
It has to be extracted manually:

- pair the tickets with their invoices
- create a summary 
- pass forward in the pipeline
- save the documents for a few years

Our idea was to extend one of our internal portals with such functionality that
everyone can just upload their tickets they'd like to add for travel reimbursement.

Then the app would extract the necessary details by getting the text data from pdf,
pair the ticket and invoice pdf files together.
And in an admin page the finance team have a download option for the files and see the exact summaries.

## Team split

This is the first time I was in such a large technical team.
We decided early on what each member will be working on, and split into 1-2 person areas.

I took the admin page, and the 2 other web devs took the client UI and the portal API.

The others decided to create a data pipeline in AWS, written in python.

They split the pipeline into 2 teams:

- extract the uploaded files and parse the pdf invoice and ticket format for 2 different type of export sources
- join the pairs of the pdfs and send back the data in a single JSON matching the data

## How the hell rose

In the beginning things went smooth, then AWS permission issues started to take more time than expected.
Also the API did not want to start up due to recent version updates, and tricky coding bugs appeared as well.

We were able to contaminate these problems and every team knew their task,
we also knew that we could only succeed if every team fills their part.

The tension grew.

Some parts were ready sooner, some seemed to become unexpected bottlenecks.

UIWise we were lucky, we knew how to start app the app and what to expect.
We decided not to tie ourselves for the conventions of the original app,
we decided to use whatever we are familiar with that gets the job done.
We're not making production ready code, we're here for having fun and presenting an idea.

We dedicated a single person to pimp up the presentation, and prepared for a live demo at the end.

Sadly we could not connect every part of the application,
although the UI was functioning perfectly with my local server's mock data.

### How we avoided communication problems

- We weren't afraid to call for help if a problem persists for more than 20 minutes, more eyes can spot errors quicker
- Kept the communication flowing, get status updates in fixed periods of time
- Split up tasks for micro teams that could work on specific issues
- Everybody knew which team worked on what
- Sit close to each other
- Live chat channel for help requests and sharing snippets

## My key Hackathon takeaways

- Try to find the right balance between team size and tasks before signing up
- I should prepare for the most basic things to fail (misbehaviour from recent software updates, permission issues)
- It's important to make sure that everyone can feel useful and learns something by the end of the day
- Always be thankful for my teammates, they joined for a reason and it's a nice touch to thank them their efforts
- Remember to have some fun and don't take it too seriously
- Try to avoid unknowns as much as possible if you're in a hurry with your feature
- Spend more time creating engaging visuals for the presentation, not solving your application for the edge cases

## Presentation

The idea holder had a speech about the end goal, and how our large team tried to make it possible in a single day.
Then I took over with the demo and presented the short live demo with some technical details on what's going on in the background.

We could hear the crowd drop their jaws when they realised how we extract the data and
it's benefit of saving the finance team from a bunch of headache.

## Other teams

In total there were 12 teams, each team had around 8 minutes to present their ideas.
There were technical experiments, hardware programming, engaging mobile apps for sports, data visualizations, data analytics projects.

### Presentation takeaways

Upon looking at a bunch of presentations I saw patterns that we could take into our presentations and what should we avoid next time.

- Aim for memorability: Pick a descriptive punny team name, so that at the voting people will know which is your project
- Expect that the audience might be far away from the projector
  - Use large font size
  - Choose good visible fonts
  - Don't assume that they can read your presentation as clear as in their computer
  - Do not write huge walls of text, rather use images
  - Use distinct colors in diagrams, multiple presentations stick with the defaults that had for example orange and red. They looked the same.
- Explain the process, tell the story, don't expect the audience to understand a flowchart just by seeing it the first time
- No result is still result if you can present it well
- A working demo does wonders, if it has a clear goal on what you want to tell. Don't just click around aimlessly, prepare with mock data.
- Further ideas at the end can be interesting. One team teased it like 'if we had 30 more minutes we would implement this huge amount of tasks'
- One data analysis project team used [Kahoot](https://kahoot.it) to make it a fun engaging presentation. They didn't make it a test about their understanding, rather made it a fun guessing game

## Results

We got 3rd place with this idea. {{< emoji `:tada:` >}}

## Summary

I really enjoyed this day, it was a nice way to connect with people from different divisions.

I'm looking forward to the next one.

Happy coding!
