#! /usr/bin/node
/* jslint esversion: 6 */

const commandLineArgs = process.argv.slice(2);
if (commandLineArgs.length !== 1) {
    console.error(`
Title is malformed. Add it as first parameter 
there should not be any other parameters added.
The title should not contain whitespace, the words should be separated by dashes.
`)
    process.exit(1)
}

const pad = (n) => (n < 10) ? `0${n}` : n
const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1)
const getFileName = (title) => {
    const today = new Date()
    const year = today.getFullYear()
    const month = pad(today.getMonth() + 1)
    const day = pad(today.getDate())
    return `${year}-${month}-${day}-${title}.md`
}
const getDefaultContent = (title) => `---
layout: post
title: ${title.split("-").map(capitalize).join(" ")}
tags:
comments: true
---


`

const fs = require('fs')
const path = require('path')

const postLocation = "_posts"
const newPostTitle = commandLineArgs[0]
const newFilePath = path.join(postLocation, getFileName(newPostTitle))

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