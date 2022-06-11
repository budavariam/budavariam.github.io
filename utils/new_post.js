#! /usr/bin/node
/* jslint esversion: 6 */
"use strict"

const commandLineArgs = process.argv.slice(2);
if (commandLineArgs.length !== 1) {
    console.error(`
Title is malformed. Add it as first parameter 
there should not be any other parameters added.
The title should not contain whitespace, the words should be separated by dashes.
`)
    process.exit(1)
}

const fs = require('fs')
const path = require('path')

const pad = (n) => (n < 10) ? `0${n}` : n
const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1)
const getDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = pad(today.getMonth() + 1)
    const day = pad(today.getDate())
    return `${year}-${month}-${day}`
}
// const getFileName = (title, date) => {
//     return `${date}-${title}.md`
// }
const getPostFolderName = (title, date) => {
    return `${date}-${title}`
}

const getDefaultContent = (title) => `---
layout: post
title: ${title.split("-").map(capitalize).join(" ")}
tags: []
cover:
    alt: Cover
    hidden: true
resources:
  - name: cover
    src: cover.png
date: ${formattedCurrentDate}
draft: true
---

<!--more-->
`

const newPostTitle = commandLineArgs[0]
const formattedCurrentDate = getDate()
const postLocation = ["content", "posts", getPostFolderName(newPostTitle, formattedCurrentDate)]
const newFilePath = path.join(...postLocation, "index.md")
const postParentPath = path.join(...postLocation)

fs.mkdir(postParentPath, {}, () => {
    fs.appendFile(
        newFilePath,
        getDefaultContent(newPostTitle),
        (err) => {
            if (err) {
                throw err
            }
            console.log(`New post created @ '%s'`, newFilePath);
        }
    );

    console.log("DONE")
})
