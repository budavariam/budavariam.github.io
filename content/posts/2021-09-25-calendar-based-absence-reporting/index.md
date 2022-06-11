---
layout: post
title: Calendar Based Absence Reporting
tags: [my-solution, javascript, google, calendar, apps-script]
cover:
  alt: Cover
  hidden: false
resources:
  - name: cover
    src: cover.jpg
date: 2021-09-25
draft: false
---

I have access to a Google Calendar, that contains the absence of all my colleagues as full day events.
I work with a mostly remote team, and sometimes it's useful to know when will my teammates leave for vacation,
even if they don't tell me many days in advance.

I wrote a simple script, to look through the events every monday and filter the ones I'm interested in,
then send me an email report.

<!--more-->

## How it works

It is avaliable on [github](https://github.com/budavariam/absence-report).
It needs to be configured for your needs before you run it.

The script runs in Google Apps Script.
It fetches the events of a given external calendar that contains the abscence information.
It queries the calendar for a given timeframe, and looks through the events in them,
matching each of them with a predefined list of colleagues.
In my case it runs every monday morning for the week.

On the second stage it puts the found users into an HTML table for each separate teams.
One user per row, one day per column.
The available times will be shown as green, the absence days will appear as yellow with a dot in them.
The tables only show up for teams that have absences.
If there are no absences a short message indicates, that we operate on full load.

Finally an email is sent to all recipients separately who wanted access for this report.
If there are no absences an email is still going to be sent, to show that the service works.

## What's Google Apps Script

[Google Apps Script](https://script.google.com/) is a developer SaaS tool, that can be used to automate simple tasks.
You can extend your Google Apps with simple scripts.
It can use the API-s of Google services like calendar or gmail.

- You can run the scripts as many times you'd like.
- You can step through code with a debugger.
- You can automate your tasks with time based triggers, or even on calendar modifications.

### Usage Limits

You can find more details on the quotas at [Google Developers site](https://developers.google.com/apps-script/guides/services/quotas).

Currently it's a free to use, if a script reaches a quota or limitation,
it throws an exception with a message that gives more detailed information of the problem.

### Service Status

In case you face an error that really should not happen, there's a chance that the service has some temporary issues.
You can check the [outage logs](https://developers.google.com/apps-script/guides/support/outage-log) for detailed information on incidents.

### My former experience

This is my second project in this platform.
I struggled with finding a solution to keep multiple google calendars in sync, I've decided to keep it closer to the fire and use Apps Scripts for it.
I've a solution that had the basis of what I needed so I tweaked to fit my use-case exactly.
My fork is available on [github](https://github.com/budavariam/sync-multiple-google-calendars).

I loved its simplicity and clear interface, so I decided to use it for this project as well.

## Getting Started

1. Subscribe to the calendar that has the Absence information in Google Calendar.
1. Open Google Apps Scripts [home page](https://script.google.com/u/1/home).
1. Click on `New project` on the top left corner
1. Update the contents of `Code.gs` from the git repo.
1. In the `Project Settings` menu, tick in `Show "appsscript.json" manifest file in editor` and update its contents from the repository
1. Set up the config values with proper data:

   - `SOURCE_CALENDARS`: the Absence report
   - `PEOPLE`: the people you'd like to track, the names MUST match with the names used in the calendar
   - `NOTIFICATION_MAIL_ADDRESSES`: the people you'd like to notify

   ```js
   const SOURCE_CALENDARS = {
     "[Absence]": "starwarsteam.calendarid@group.calendar.google.com",
   };

   // Team members whose abscence we want to get notified of
   const PEOPLE = [
     { name: "Budavári Mátyás", nick: "Matyi", team: "Earth" },
     { name: "Luke Skywalker", nick: "Luke", team: "Jedi" },
     { name: "Anakin Skywalker", nick: "Darth Vader", team: "Sith" },
     { name: "R2-D2", nick: "Artu", team: "Droid" },
     { name: "C3PO", nick: "Golden Guy", team: "Droid" },
   ];

   // Who should get these emails
   const NOTIFICATION_MAIL_ADDRESSES = ["budavariam@gmail.com"];
   ```

1. In the Code view select the `SendAbsenceReport` function, and click the Play button, to run the script, and make it ask for the proper authentication
1. Click on `Triggers` menu, and on the bottom right corner click: `Add Trigger`
   - function: `SendAbsenceReport`
   - deployment: `HEAD`
   - event source: `Time driven`
   - time based trigger: `Week timer`
   - day of the week: `Every Monday`
   - time of the day: `7am to 8am`
   - failure notification: `weekly`
1. Enjoy your weekly report.

## Further Development Ideas

- Look into if it's possible to send a single email and use bcc for the same reports
- Set up different reports for different people
- Send notification if a new event appears during the week

## Disclaimer

I'm not affiliated with Google in any way, I just wanted to share my custom solution on their cool platform.

Cover Photo by [Julius Silver](https://www.pexels.com/@julius-silver-240301) from [Pexels](https://www.pexels.com/photo/cottages-in-the-middle-of-beach-753626/)

Happy coding!
