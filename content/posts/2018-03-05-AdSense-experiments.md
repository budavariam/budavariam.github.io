---
layout: post
title: AdSense Experiments
tags: [ ]
date: 2018-03-05
---

I just started to try out AdSense. Here's my playground to try out ads.

<!--more-->

## AdDisplay

{{< rawhtml >}}
    <!-- ad-display -->
    <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="{{- .Site.Params.adsense.clientID -}}"
        data-ad-slot="{{- .Site.Params.adsense.slotDisplay -}}"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
{{< /rawhtml >}}

## AdMultiplex

{{< rawhtml >}}
    <!-- ad-multiplex -->
    <ins class="adsbygoogle"
        style="display:block"
        data-ad-format="autorelaxed"
        data-ad-client="{{- .Site.Params.adsense.clientID -}}"
        data-ad-slot="{{- .Site.Params.adsense.slotMultiplex -}}"></ins>
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
{{< /rawhtml >}}

## AdInFeed

{{< rawhtml >}}
    <!-- ad-in-feed -->
    <ins class="adsbygoogle"
        style="display:block"
        data-ad-format="fluid"
        data-ad-layout-key="-gw-3+1f-3d+2z"
        data-ad-client="{{- .Site.Params.adsense.clientID -}}"
        data-ad-slot="{{- .Site.Params.adsense.slotInFeed -}}"></ins>
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
{{< /rawhtml >}}

## AdInArticle

{{< adsense >}}

