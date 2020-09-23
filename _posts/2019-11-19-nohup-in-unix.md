---
layout: post
title: nohup in Unix
date: 2019-11-19T00:00:00.000Z
description: Working with nohup command
summary: Working with nohup command
comments: true
tags:
  - nohup
  - unix
category: exobrain
published: true
---

`nohup` is a very simple command to run a process in the background. Usually when we log out from the system then all the running programs or processes are hungup or terminated. `nohup` literally stands for 'no hangup', and that's what it does, let's you run a command even after you log out from the system. Here, when I say system, it can also mean a linux shell. 

To understand this command, you need to know how processes are terminated. There is a POSIX `SIGHUP` interruption signal, which is sent to the process when the terminal which is associated with it is closed. This comes from the concept of notifification of serial line drop. In existing systems, this signal usually means that the controlling pseudo or virtual terminal has been closed.

The syntax of the `nohup` command is as follows.
```bash
$ nohup command arguments &
```

By default the `stdout` and `stderr` are redirected to `nohup.out` file, in the same directory as the command is run. We can use normal shell redirection operators like `>` or `>>` operators to redirect to any other file, as follows.
```bash
$ nohup command arguments > output &
```

`nohup` does not automatically put the command it runs in the background; to do this explicitly, end the command with an `&` symbol.

Nohup is very helpful when you have to execute a shell-script or command that take a long time to finish. In that case, you don’t want to be connected to the shell and waiting for the command to complete. Instead, execute it with nohup, exit the shell and continue with your other work. Some usecases are to run memory checks, server restarting, synchronization.
