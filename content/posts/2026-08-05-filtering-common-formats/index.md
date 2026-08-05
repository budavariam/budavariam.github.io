---
layout: post
title: Filtering Common Formats
tags: [terminal, jq, visidata, cli, developer-toolbox]
cover:
    alt: Cover
    hidden: true
resources:
  - name: cover
    src: cover.png
date: 2026-08-05
draft: false
---

During debugging sessions I live in the terminal. Logs are flying, API responses are piling up,
and I need to find the one field that tells me what went wrong.
I kept opening the same browser bookmarks for the same tools, copy-pasting the same one-liners I always forget.
At some point I decided to just write it down.

<!--more-->

These are my go-to tools for filtering data directly in the terminal.
Not a comprehensive reference — just the patterns I actually reach for, explained well enough that you can start modifying them.

## jq — JSON swiss army knife

[jq](https://jqlang.org/) is what awk is to text, but for JSON. You can pretty-print, extract, transform, and filter JSON documents with a compact query language.

To test queries live without any files, [jqplay.org](https://jqplay.org/) is invaluable.

### Pretty-printing

The simplest use case — just format JSON so it's readable:

```bash
jq . my.json
```

When you're piping from curl or another command:

```bash
curl http://example.com/api | jq .
```

### Extracting fields

Given this document:

```json
{
    "timestamp": 1234567890,
    "report": "Age Report",
    "results": [
        { "name": "John", "age": 43, "city": "TownA" },
        { "name": "Joe",  "age": 10, "city": "TownB" }
    ]
}
```

Extract a top-level field:

```bash
jq '.report'
```

Iterate over an array and pick fields:

```bash
jq '.results[] | {name, age}'
```

### Filtering

Select by exact match or substring:

```bash
jq '.results[] | select(.name == "John") | {age}'
jq '.results[] | select(.name | contains("Jo"))'
```

This pattern is the one I use most. When you have a large list and need one record:

```bash
cat data.json | jq '.[] | select(._id == 611)'
```

If your input is newline-delimited JSON (not a single array), drop the `[]`:

```bash
cat ndjson.log | jq 'select(._id == 611)'
```

### Coloured output with less

When the output is long, pipe with colours preserved:

```bash
jq -C . data.json | less -R
```

### Using jq in shell scripts

Extract a value into a variable:

```bash
NAME=$(jq -r '.name' data.json)
```

The `-r` flag strips the surrounding quotes, which is almost always what you want when assigning to a shell variable.

Create JSON from shell variables properly (this escapes everything correctly):

```bash
jq -n --arg foobaz "$FOOBAZ" '{"foobaz":$foobaz}'
```

Export JSON keys as environment variables:

```bash
export $(jq -r '@sh "FOO=\(.foo) BAZ=\(.baz)"' data.json)
```

### Real-world examples

Decode all Kubernetes secret values at once:

```bash
kubectl get secret $SECRET_NAME -o json | jq -r '.data | map_values(@base64d)'
```

Check if `package.json` dependencies changed since the last commit:

```bash
JQ_SCRIPT='.dependencies + .devDependencies + .optionalDependencies'
PREV=$(jq -S "$JQ_SCRIPT" <(git show HEAD~1:package.json) | md5)
CURR=$(jq -S "$JQ_SCRIPT" package.json | md5)
[[ "$PREV" != "$CURR" ]] && echo "Dependencies changed"
```

### Best practices

- Always use `-r` (raw output) when the result feeds into a shell variable or file
- Use `select()` to filter before transforming — it avoids errors on null values
- Wrap optional array access: `select(.my_array | length > 0)` prevents the dreaded `Cannot iterate over null`
- Use `jq -S` to sort keys before hashing or diffing JSON

## fx — interactive JSON explorer

[fx](https://fx.wtf/) is where I go when I want to _explore_ a JSON response I haven't seen before,
rather than extract something specific. It opens an interactive terminal UI where you can fold and unfold nodes,
search, and navigate with arrow keys.

```bash
fx data.json
```

You can also pass a JavaScript expression to transform before viewing:

```bash
fx data.json '.results'
fx data.json '.results.filter(x => x.age > 18)'
```

The key difference from jq: fx is for exploration, jq is for scripting.
When I get a new API response and have no idea what the shape is, I reach for fx.
When I know exactly what I want and need it in a pipeline, I use jq.

## mdq + glow — querying and rendering Markdown

[mdq](https://github.com/nicholasgasior/mdq) lets you query structured content out of Markdown files —
headings, code blocks, lists — without writing a parser yourself.
[glow](https://github.com/charmbracelet/glow) renders Markdown beautifully in your terminal.

Together they're a great combo when you have lots of documentation in Markdown and want to skim it without leaving the terminal.

Render a file with syntax highlighting and nice formatting:

```bash
glow README.md
```

Page through it interactively:

```bash
glow -p README.md
```

Render from stdin (handy after a curl):

```bash
curl https://raw.githubusercontent.com/.../README.md | glow -
```

### Best practices

- `glow -p` is your friend for longer files — it opens a pager rather than dumping everything
- Combine with `mdq` to extract just the section you need before rendering it

## visidata — CSV in the terminal

[visidata](https://www.visidata.org/) (`vd`) is an interactive terminal spreadsheet. It handles CSV, TSV, JSON, SQLite, and more.
I reach for it when someone sends me a CSV and I want to poke around without opening Excel or writing pandas.

```bash
vd data.csv
```

### Survival kit

Before anything else, know how to get out:

| Key | Action |
|-----|--------|
| `q` | Close current sheet |
| `gq` | Quit everything |
| `Ctrl-q` | Force quit |
| `Ctrl-c` | Abort current command |
| `Shift-U` / `Shift-R` | Undo / Redo |

### Navigation

Move around with arrow keys or vim-style `hjkl`. Jump to extremes with `gj` (last row), `gk` (first row), `gh` (leftmost), `gl` (rightmost).

Search within a column:

```
/ + regex    forward
? + regex    backward
n / N        next / previous match
```

### Sorting and filtering

Sort by the current column: `[` ascending, `]` descending.

To filter rows, select them first then create a new sheet from the selection:

1. `|` + regex — select rows matching regex in current column
2. `"` — open a new sheet with only the selected rows

### Column tricks

Set column type so sorting and aggregation work correctly:

| Key | Type |
|-----|------|
| `#` | Integer |
| `%` | Float |
| `@` | Date |
| `~` | Text |

Resize: `_` fits current column, `g_` fits all. Hide with `-`, unhide all with `gv`.

Set a column as a key (freezes it to the left): `!`

### Exploring data

Get a frequency table for the current column: `Shift-F`. This is great for spotting unexpected values or outliers quickly.

Summary stats for all columns: `Shift-I`

To delete a column: open the column sheet with `C`, navigate to the column, press `d`.

### Pandas loader for type inference

visidata won't always guess column types automatically. The pandas loader does a better job:

```bash
vd -f pandas data.csv
```

### Best practices

- Always set column types before sorting or aggregating — otherwise alphabetical sort on numbers will surprise you
- `Shift-F` before any analysis — it immediately shows you if a column has unexpected nulls or garbage values
- Use `!` to freeze your key column before reshaping data, so you always know which row you're looking at

## Wrapping up

These four tools cover the formats I deal with most often.
jq for JSON extraction in scripts, fx when I need to explore something new, glow for reading docs without leaving the terminal, and visidata when a CSV lands in my inbox.

The pattern that makes all of them click: start with exploration, then move to scripting once you know the shape of your data.
