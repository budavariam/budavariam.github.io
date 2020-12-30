---
layout: post
title: External Function Calls From Snowflake
comments: true
---

A few months ago at work, I wrote a simple node.js snippet to calculate route distances in [Mapbox](https://docs.mapbox.com/api/navigation/#directions).
Now I'm proud, that it's used to demonstrate how to use Mapbox calculations from [Snowflake](https://www.snowflake.com/).

[Tamas Foldi](https://twitter.com/tfoldi) handled the infrastructure, and wrote a blog post to the official [Snowflake blog](https://www.snowflake.com/blog/extending-snowflakes-external-functions-with-serverless-adding-driving-times-from-mapbox-to-sql/) on how to call an external lambda from SQL.

The source code is available on [github](https://github.com/tfoldi/snowflake-mapbox-functions).

Happy coding!
