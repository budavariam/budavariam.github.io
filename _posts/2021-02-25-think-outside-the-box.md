---
layout: post
title: Think Outside The Box
tags:
comments: true
---

In the past few days I've been working in manual mode on multiple linux boxes simultaneously.
I have to folow logs, modify configurations and kill/start applications all at once.
I got confused pretty fast of what server am I connected to in a certain console pane, and where are my operations.
On top of that my ISP had a huge traffic hit these days, and my VPN connection dropped constantly.
I dusted off my knowledge about some tools that boosted my productivity.

I usually don't like to repeat myself, and supposedly I'll have to do these modifications for many more machines.
So as I see something is working, I take a note of the solution and create a script as I go.
I have to see that it works manually, in order to automatize it.

## SSH

SSH provides secure shell connection to a remote machine. You can work in it just like your local machine.
There are multiple authentication methods, I found ssh public key auth feasible in my use case.

- `ssh-copy-id` can put ssh keys into `authorized-keys` simply, if you already have access to the server
- `ssh-add -K ${key_location}` can remember the passphrases of the ssh keys
- `ssh -t byobu` can attach to the already existing byobu session (see [below](#byobu))

### Permissions

SSH is picky with the permission settings.

- The home folder that contains `.ssh` folder can not have group write permission.
- `.ssh` folder should have `700` octal permission
- `.ssh/authorized_keys` and public keys should have `644` octal permission
- private keys under `.ssh/` should have `600` octal permission

### SSH Config

I think it's amazing that you can collect ssh configurations under a custom name and you can connect into it.
`.ssh/config`

```bash
Host server-1
    User customuser
    HostName 192.168.42.123
    IdentityFile /var/opt/customdata/.ssh/id_ed25519
```

I used [rsync](https://en.wikipedia.org/wiki/Rsync) to keep some code up to date in my systems,
and it made the code significantly easier and less error prone to reference the ssh config already set, instead of typing it out.

Rsync does not proide automatic resync out of the box, but a little bash magic can do wonders.

```bash
projectpath="~/projects/thisproject"
machine="server-1" # this is the Host in .ssh/config
run_rsync() {
  rsync -azuv --no-o --no-g \
    --exclude "logs" \
    --exclude ".git" \
    "${projectpath}" \
    "$machine":/opt
}
run_rsync; fswatch -o "${projectpath}" | \
    while read f; do run_rsync; done
```

### Debug SSH connection problems

You can debug ssh issues with the verbose flag on the client side, e.g: `ssh -vvv server-1`.
If you need to debug your issues on the server side, you can view debug logs with: `LogLevel DEBUG` in `/etc/ssh/sshd_conf`.
View the logs with e.g: `journalctl -F -u sshd`.

In my case I needed to access a user that had his home folder outside `/home` AND had his password locked.
Also his home folder had group write permissions by default. Such a thrill.
Leave it here just in case someone might need it later.

```bash
sudo semanage fcontext -a -t ssh_home_t ~customuser/.ssh/authorized_keys
sudo semanage fcontext -a -t ssh_home_t ~customuser/.ssh
sudo restorecon -R -v ~customuser/.ssh/
chmod g-w ~customuser
```

## Welcome message

When I log in to a box, I found it beneficial to print a huge unique identifier of where I logged in exactly.
It made it easier to keep track of what's happening.

I found a great tool called [FIGlet](http://www.figlet.org/), that can generate ASCII art like text from ordinary text.
As a small practice project, in my free time I took the time and put together
a simple [webapp](https://budavariam.github.io/asciiart-text/) to showcase an already existing
[JS renderer](https://github.com/scottgonzalez/figlet-js).

```text
  ____   _____  ____ __     __ _____  ____            _
 / ___| | ____||  _ \\ \   / /| ____||  _ \          / |
 \___ \ |  _|  | |_) |\ \ / / |  _|  | |_) |  _____  | |
  ___) || |___ |  _ <  \ V /  | |___ |  _ <  |_____| | |
 |____/ |_____||_| \_\  \_/   |_____||_| \_\         |_|
```

But of course I could have just used [cowsay](https://en.wikipedia.org/wiki/Cowsay).

```text
 ________________________________
< Welcome to St. James Ballroom! >
 --------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

### Set SSH banner

I was interested in the ssh banner part, to print it when an ssh session connects, before the used logs in.

I aimed for a simple banner, centos have a [wiki page](https://wiki.centos.org/TipsAndTricks/BannerFiles)
that explains the simple steps to achieve it, but since it's ssh config it should work similarly in other distributions.

1. Create a `/etc/issue.net` file and fill it with the desired plaintext context
1. Edit `/etc/ssh/sshd_config`, to have this line: `Banner /etc/issue.net`
1. Restart sshd: `systemctl restart sshd`

In linux you can specify welcome messages, when you log in, it's called Message Of The Day or MOTD for short.
That opens up after the user has logged in, and before the shell started up.
It can be cpntrolled usually in `/etc/motd`.

## Terminal multiplexers

Terminal multiplexers make it easy to manage long running processes in remote machines.
They're especially useful if you have an unreliable network connection,
you can start up a session in the remote machine,
and when you log in to the machine the next time, you can connect to the same session.

They let you create multiple windows/panes, thus provide a better experience than forward/background jobs.

You can have multiple sessions in a machine at a given time, multiple users can log in to them.

You can use it in your local machine as well, and log in to it from multiple shell emulators if that's what you need.

### The old boys

[GNU screen](https://www.gnu.org/software/screen/) is there since 1987, widely available.

```bash
screen -S sessionName       # create session with a name
screen -r sessionName       # reconnect to named session
screen -ls                  # list current sessions
screen -XS sessionName quit # terminate session
screen -r -d                # reconnect to the last screen session
screen -xr                  # share screen
```

[tmux](https://github.com/tmux/tmux/wiki) is newer, created in 2007, has a huge community around it.
They operate with key chords, both have a meta character that marks the actions for the multiplexer.

```bash
tmux new -s session_name            # new session
tmux ls                             # list current sessions
tmux attach-session -t session_name # attach to the named session
tmux kill-session -t session_name
```

### Byobu

My facourite is [byobu](https://www.byobu.org/), it's a config layer over the other two above.
it provides a simple interface for their functionalities.
Byobu maps its functionality to the F1-F12 keys.

You can use the key chords that you're used to, even select the underlying backend on start.

```bash
byobu
byobu-screen # any tmux options can be given
byobu-tmux # any screen options can be given
```

### Basic Keybinding comparison

| Byobu    | Tmux       | Screen       | Description                                                        |
| :------- | :--------- | :----------- | :----------------------------------------------------------------- |
|          | CTRL+b     | CTRL-a       | default meta                                                       |
| shift+F1 | meta ?     | meta ?       | help                                                               |
| F6       | meta d     | meta d       | detach from session                                                |
|          |            |              |                                                                    |
| F2       | meta c     | meta CTRL-C  | create new tab                                                     |
|          | meta w     | meta "       | choose tab from a list                                             |
| F3       | meta n     | meta CTRL-N  | next tab                                                           |
| F4       | meta p     | meta CTRL-P  | prev tab                                                           |
|          | meta 0     | meta CTRL-0  | switch to tab (0 can be any number)                                |
|          |            |              |                                                                    |
| shift+F2 | meta "     | meta PIPE    | split horizontally                                                 |
| CTRL+F2  | meta %     | meta S       | split vertically                                                   |
|          | meta o     | meta TAB     | switch to pane                                                     |
|          | meta x     | meta SHIFT-x | close the pane that has focus                                      |
| F8       | meta ,     | meta SHIFT-a | rename tab                                                         |
|          | meta q     |              | show pane numbers if you press a number the cursor will jump to it |
|          | meta ;     |              | toggle between prev/current pane                                   |
|          | meta SPACE |              | toggle between layouts                                             |
|          | meta z     |              | toggle zoom to pane                                                |

> Note that Byobu can use the underlying backend's keybindings as well.

Happy coding!
