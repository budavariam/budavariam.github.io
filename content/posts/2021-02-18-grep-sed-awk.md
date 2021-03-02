---
layout: post
title: Grep Sed AWK Filters
tags: [ programming, developer-toolbox, grep, sed, AWK, cheatsheet ]
date: 2021-02-18

---

I usually work with \*nix systems, and I process text all the time.
This consists of CLI tool output, config file modifications and log files scanning.
These utilities make it easy to search and manipulate plaintext data.
I think they're an essential part of any developer's toolbox.
<!--more-->
These commands can read either from the standard input, a single file or multiple files.

## Grep

Grep's name comes from the `ed` command `g/re/p`, which roughly means, globally look for a regular expression and print.
Perfect for simple regex matches of single lines.

`grep [flags] [pattern] [filenames]`

### Notable grep flags

- `-E` extended regexp
- `-q` exit code marks the result (success is 0)
- `-v` lines that do not match
- `-n` matched line and line number
- `-l` only the names of files that contain a match
- `-c` count of the matching lines (not the number of matches)
- `-i` case insensitive match
- `-o` print only matching part (interesting with regex)
- `-e` define multiple patterns
- `--color` use colors **always**/**never**/**auto**

### Grep examples

```bash
example="\
For instance, on the planet Earth, man had always assumed
that he was more intelligent than dolphins because he had
achieved so much — the wheel, New York, wars and so on —
whilst all the dolphins had ever done was muck about in
the water having a good time. But conversely, the dolphins
had always believed that they were far more intelligent
than man — for precisely the same reasons."

# Match exact text
echo "$example" | grep 'man'
# Match exactly 'the', 'than' or 'for' words
#   case insensitive (\b is word boundary)
echo "$example" | grep -iE '\b(the|than|for)\b'
# Print only the matching part of the string
#   (can not print part of it, like groups)
echo "$example" | grep -Eo 'dolphins \w+'
# Do not print lines that contain "the"
echo "$example" | grep -Ev '\bthe\b'
# Count the lines that contain "good"
echo "$example" | grep -c 'good'
# Filter lines that contain a
#   punctuation mark OR start with a lowercase letter
echo "$example" | grep --color=never -E -e '[.,-]' -e '^[a-z]'

```

#### Similar utilities

- `egrep` - extended regex pattern, like `grep -E`
- `fgrep` - faster, but works only for fixed patterns
- `zgrep`/`zegrep`/`zfgrep` - for compressed files
- `pgrep` - search processes and print the PID of matching ones
- [ack-grep](https://beyondgrep.com/) has the functionality of grep, but optimized for developers
- [silver seracher](https://github.com/ggreer/the_silver_searcher) is similar to ack, but faster

## Sed

Sed is a powerful stream editor.
For a more comprehensive guide check out this [awesome post](https://www.grymoire.com/Unix/Sed.html).

I'll show some commands that you can be productive with in no time.

`sed [flags] [pattern] [filenames]`

### Notable sed flags

- `-E` extended regexp
- `-n` show ony those lines, that we explicitly print
- `-e` chain multiple commands
- `-i` edit files in place

### Basic commands

- print: `p`
- delete: `d`
- substitute: `s/regexp pattern/replace to this string/modifiers`
  - fence characters after substitutiion that defines the fields can be any character,
    choose one that does not appear in your patterns. It has to be a single character.
  - in replace string you can matching regular expression:
    - `&` to reference the whole pattern
    - `\1`-`\9` to reference the groups by number
  - modifiers can be:
    - `g`: global flag, match all occurrances in each line
    - `p`: print result
    - NUMBER: the NUMBERth match in the line

#### Addresses

You can optionally specify **addresses** before the command in which the command acts upon:

- line number
- line range separated by comma, where the last line can be referenced with `$`
- a regular expression to define which lines do you want to run the script to fenced by forward slashes

Addresses can be negated if you put a `!` between the address and the command.

### Sed Examples

```bash
example="\
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Ut ut enim quis nisl ultrices molestie eu in nibh.
In sit amet odio et tellus sagittis semper sed at urna.
Pellentesque feugiat ipsum eget dignissim mattis.
Donec accumsan nibh sit amet mi ornare, a faucibus diam euismod.
"

# Print 2nd line
echo "$example" | sed -n '2 p'
echo "$example" | sed '2! d'
# Print 2-5th line only
echo "$example" | sed -n '2,5 p'
# Print from 3rd line until the end of the file
echo "$example" | sed -n '2,$ p'
# Delete lines thet contain 'Lorem'
echo "$example" | sed '/Lorem/ d'
# Replace all 'amet' with 'tema'
echo "$example" | sed 's/amet/tema/g'
# Replace second 'm' to 'M' in each line
echo "$example" | sed 's:m:M:2'
# Put 'ipsum' in square brackets
echo "$example" | sed -E 's/(ipsum)/[\1]/g'
# Chain multiple commands together
#   replace the 2nd and third lines to numbers, then
#   print even numbers twice
echo "$example" | sed \
    -e '2,3 s_^.*$_1234567890_' \
    -e 's/\([02468]\)/&&/g'
```

## AWK

AWK is a record-based pattern-directed text processing language.
It's name comes from the last names of its creators.

An AWK script builds up from [Pattern](#patterns)-[Action](#actions) pairs.

AWK splits the input into records. Splits the records into fields.

From start to end, match the defined patterns with the records,
to determine whether it needs to perform the action of that pattern.

It allows you to write complex programs with it,
I advise you to take some time to get familiar with the main functionality.

### Notable AWK flags

- `-F` define input field separator regexp
- `-f` load code from a file
- `-v var=value` set variables before staring up

### Patterns

Empty pattern matches for every line.

Special patterns `BEGIN`/`END` define action before the
first input line is read, and after the last input is read respectively

Patterns can be combined together:

- simple regular-expression
  - regular-expression is fenced by forward slashes
- boolean operators: AND: `&&`, OR: `||`, NOT: `!`
- expression `matchop` regular-expression
  - matchop is one of the following
  - `~` matches
  - `!~` does not match
- expression `relop` expression
  - relational operator is one of the following
    - `==` Equal to
    - `>` Greater than
    - `<` Less than
    - `!=` Not equal to
    - `>=` Greater than or equal to
    - `<=` Less than or equal to
- expression in array-name
  - [array-name](#arrays)
- (expr,expr,...) in array-name
- if 2 patterns are defined separated by a comma,
  then the action will be performed from the
  first occurrance of the fist pattern until the
  first occurrance of the second pattern

### Actions

- Missing action means to print the whole line.
- Actions are surrounded by curly brackets.
- Commands are terminated by semicolons/newlines/right braces.
- Fields can be accessed as `$NUMBER`, where number is the index of the field starting from 1. `$0` contains the whole line.
- AWK has associative arrays, meaning its indexes can be strings, or numbers
  - You can define them in the following format: `arrayname[index] = value`
  - AWK does not support multi-dimensional arrays, but you can emulate it by concatenating the dimension indixes as a string
- In expressions the variables need not use `$` signes in their names.
- Strings are concatenated together by spaces

We can write complex programs in our AWK actions to process the input fields.

The following lines come from the manual as-is.
The parts between `[]` are optional, except when it refers to array indexing.
Other characters are as-is.

- Statements
  - `if( expression ) statement [ else statement ]`
  - `while( expression ) statement`
  - `for( expression ; expression ; expression ) statement`
  - `for( var in array ) statement`
  - `do statement while( expression )`
  - `break`
  - `continue`
  - `{ [ statement ... ] }`
  - `expression` commonly var = expression
  - `print [ expression-list ] [ > expression ]`
  - `printf format [ , expression-list ] [ > expression ]`
  - `return [ expression ]`
  - `next` skip remaining patterns on this input line
  - `nextfile` skip rest of this file, open next, start at top
  - `delete array[ expression ]` delete an array element
  - `delete array` delete all elements of array
  - `exit [ expression ]` exit immediately; status is expression
- Other functions
  - mathematical functions: `atan2`, `cos`, `exp`, `log`, `sin`, and `sqrt`
  - `length` the length of its argument taken as a string, number of elements in
    an array for an array argument, or length of `$0` if no argument.
  - `rand` random number on `[0,1)`.
  - `srand` sets seed for rand and returns the previous seed.
  - `int` truncates to an integer value.
  - `substr(s, m [, n])`: the n-character substring of s that begins at position
    `m` counted from `1`. If no `n`, use the rest of the string.
  - `index(s, t)`: the position in `s` where the string `t` occurs, or `0` if it does not.
  - `match(s, r)`: the position in `s` where the regular expression `r` occurs, or
    `0` if it does not. The variables `RSTART` and `RLENGTH` are set to the position
    and length of the matched string.
  - `split(s, a [, fs])`: splits the string `s` into array elements
    `a[1], a[2], ..., a[n]`, and returns `n`. The separation is done with the regular expression
    `fs` or with the field separator `FS` if `fs` is not given.
    An empty string as field separator splits the string into one array element per character.
  - `sub(r, t [, s])`: substitutes `t` for the first occurrence of the regular expression `r`
    in the string `s`. If `s` is not given, `$0` is used.
  - `gsub(r, t [, s])`: same as `sub` except that all occurrences of the
    regular expression are replaced; `sub` and `gsub` return the number of replacements.
  - `sprintf(fmt, expr, ...)`: the string resulting from formatting `expr ...`
    according to the printf(3) format `fmt`.
  - `system(cmd)`: executes `cmd` and returns its exit status.
    This will be `-1` upon error, `cmd`'s exit status upon a normal exit,
    256 + sig upon death-by-signal, where sig is the
    number of the murdering signal, or 512 + sig if there was a core dump.
  - `tolower(str)`: returns a copy of `str` with all upper-case characters
    translated to their corresponding lower-case equivalents.
  - `toupper(str)`: returns a copy of `str` with all lower-case characters
    translated to their corresponding upper-case equivalents.

### Special variables

AWK provides information about the state of the processing and environment

| variable name | description                                                        |
| :------------ | :----------------------------------------------------------------- |
| `RS`          | Specifies the record separator.                                    |
| `FS`          | Specifies the field separator.                                     |
| `FIELDWIDTHS` | Specifies the field width.                                         |
| `OFS`         | Specifies the Output separator.                                    |
| `ORS`         | Specifies the Output separator.                                    |
| `NF`          | Fields count of the line being processed.                          |
| `NR`          | Retrieves total count of processed records.                        |
| `FNR`         | The record which is processed.                                     |
| `ARGC`        | Retrieves the number of passed parameters.                         |
| `ARGV`        | Retrieves the command line parameters.                             |
| `ENVIRON`     | Array of the shell environment variables and corresponding values. |

### AWK Examples

```awk
# AWK examples from man page
# Print lines longer than 72 characters.
length($0) > 72

# Print first two fields in opposite order.
{ print $2, $1 }

# Same, with input fields separated
#   by comma and/or spaces and tabs.
BEGIN { FS = ",[ \t]*|[ \t]+" }
      { print $2, $1 }

# Add up first column, print sum and average.
     { s += $1 }
END  { print "sum is", s, " average is", s/NR }

# Print all lines between start/stop pairs.
/start/, /stop/

# Simulate echo(1)
BEGIN {
  for (i = 1; i < ARGC; i++) printf "%s ", ARGV[i]
  printf "\n"
  exit
}
```

- Learn more [from this great tutorial](https://www.tutorialspoint.com/awk/index.htm)

## Disclaimer

I did not get anything from making this post,

My main goal was to host an evolving cheatsheet for myself
when I forget all this, and need to apply it quickly.

I hope you learned something from it as well.

Happy coding!
