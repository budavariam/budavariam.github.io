---
layout: post
title: ELK adventures
tags: [ programming, logs, devops, docker, elk-stack ]
date: 2020-01-18
---

I have an application that logs a lot, and during development I got tired of looking through the command line for the error logs, that were hidden by other logs (that were also necessary). So I looked around what is the preferred way of handling logs nowadays.

Some years ago I've worked on a project, where we used the ELK stack to provide configurable dashboards and realtime logs for monitoring. We used it, but I was not working with it directly. It seemed like a good idea to revisit how it actually works.

I already knew that I only want to play around with it so I did not need to run a production ready server for it.

For my usecase a local virtualized install would do. I searched for existing configured stacks, and I've found exactly what I was looking for. Huge thanks for [deviantony's docker-elk](https://github.com/deviantony/docker-elk) repository. I forked it and started to explore.

My github repo is available [here](https://github.com/budavariam/docker-elk).

## What is ELK

ELK is a stack that consists of 3 opensource tools Elasticsearch, Logstash and Kibana and lets you store logs and create visualizations based on those logs in realtime.

* Logstash collects the logs
* Elasticsearch stores them
* Kibana lets you visualize and explore them

Simple as that.

## Filebeat

What the starting stack was missing was a way to send logs to logstash. I read about different ways and decided to add a filebeat extension to read logs from the file system.

> Beats is the platform for single-purpose data shippers. They send data from hundreds or thousands of machines and systems to Logstash or Elasticsearch.

[source](https://www.elastic.co/products/beats)

Elasticsearch provides docker image for these beats, so the configuration was pretty straightforward.

```dockerfile
ARG ELK_VERSION
FROM docker.elastic.co/beats/filebeat:${ELK_VERSION}
```

I needed to provide a config, and a volume to `/var/log/apps`.

In my configuration I experimented with [multiline configuration](https://www.elastic.co/guide/en/beats/filebeat/current/multiline-examples.html), to avoid sending multiple entries for a single log message.

I check if the line matches with the `^(DEBUG|INFO|WARNING|ERROR|FATAL)` regexp, if it does, then starts a new line, otherwise the line gets appended to the previous line.

```conf
multiline.pattern: '^(DEBUG|INFO|WARNING|ERROR|FATAL)'
multiline.negate: true
multiline.match: after
```

## Logstash

I've played around with logstash configurations for a while, until I found a solution that I was happy with. I've found [GROK debugger](https://grokdebug.herokuapp.com/) a useful tool, and it helped me to [browse the basic types](https://github.com/logstash-plugins/logstash-patterns-core/blob/master/patterns/grok-patterns).

While I was playing around it made me realize how important it is to provide consistent and easily parsable logs to make monitoring and error research easier to track bugs.

### Split log message

My golang code logs with a [specific logger](https://github.com/palette-software/go-log-targets). Logstash gave me a hard time and docs/github issue browsing until I found that golang supports nanosecond precision while elasticsearch "only" uses microseconds precision, so I needed to trim the last 3 digits from the timestamp.

```conf
grok {
    match => {
        "source" => "%{GREEDYDATA}/%{GREEDYDATA:app}.log"
        "message" => "%{LOGLEVEL:loglevel}:\s+(?<timestamp>%{YEAR}/%{MONTHNUM}/%{MONTHDAY} %{TIME})\s+%{GREEDYDATA:logmsg}"
    }
}
## golang has nanosecond precision, elasticsearch has microseconds precision, trim last 3 numbers
mutate {
    gsub => ["timestamp","\d\d\d$",""]
}
```

### Use log date as @timestamp

The next challenge that I gave myself to use log date as the elasticsearch timestamp.
In logstash it is straightforward, I need to use the date filter to convert my data to date, it needs the source with the timestamp format and the target field.

```conf
date {
    match => [ "timestamp", "YYYY/MM/dd HH:mm:ss.SSS" ]
    target => "@timestamp"
}
```

## Putting it all together

I fired it all up with `docker-compose -f docker-compose.yml -f extensions/filebeat-compose/filebeat-compose.yml up`.

I needed to add an index pattern to match logstash, and wait for micarle.
When when the data finally started to flow and show up in kibana it was an amazing feeling, that was worth the few days of fiddling around.

I managed to separate the data from the logs that I needed, and now I am able to save queries and dashboards based on specific cases.

## Final thoughts

I felt lucky that one version number is necessary, and it just works. I can imagine that it can be painful to manage configuration errors.

I usually work in both frontend and backend side of the code, recently I got into managing CI/CD pipelines and deploying to different environments, but now I felt like I got a bit more taste of the devops world.
