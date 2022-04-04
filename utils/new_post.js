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
const getFileName = (title, date) => {
    return `${date}-${title}.md`
}
const getImageFolderName = (title, date) => {
    return `${date}-${title}`
}

const getDefaultContent = (title) => `---
layout: post
title: ${title.split("-").map(capitalize).join(" ")}
tags: []
cover: 
    image: /${postImageFolderPath}/cover.png
    alt: Cover
    hidden: true
date: ${formattedCurrentDate}
draft: true
---

<!--more-->
`

const postLocation = ["content", "posts"]
const newPostTitle = commandLineArgs[0]
const formattedCurrentDate = getDate()
const newFilePath = path.join(...postLocation, getFileName(newPostTitle, formattedCurrentDate))
const postImageFolderPath = path.join("images", getImageFolderName(newPostTitle, formattedCurrentDate))

fs.appendFile(
    newFilePath,
    getDefaultContent(newPostTitle, postImageFolderPath),
    (err) => {
        if (err) {
            throw err
        }
        console.log(`New post created @ '%s'`, newFilePath);
    }
);

fs.mkdir(path.join("static", postImageFolderPath), {}, () => {
    fs.closeSync(fs.openSync(path.join("static", postImageFolderPath, ".gitkeep"), 'w'));
    console.log("DONE")
})
