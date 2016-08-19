# git-account

[![Build Status](https://travis-ci.org/uetchy/git-account.svg?branch=master)](https://travis-ci.org/uetchy/git-account) [![Coverage Status](https://coveralls.io/repos/github/uetchy/git-account/badge.svg?branch=master)](https://coveralls.io/github/uetchy/git-account?branch=master)

`git-account` adds user management feature to `git`. It makes you able to change __user.name__, __user.email__ and __private key__ at ease.

## tl;dr

```console
$ git account add
? ID uetchy
? Name Yasuaki Uechi
? Email uetchy@randompaper.co
? Private Key /Users/uetchy/.ssh/id_rsa
User created
KEY        VALUE
id         uetchy
name       Yasuaki Uechi
email      uetchy@randompaper.co
privateKey /Users/uetchy/.ssh/id_rsa

$ git account switch
? choose one Yasuaki Uechi <uetchy@randompaper.co>
Switched

$ git account status
KEY        VALUE
name       Yasuaki Uechi
email      uetchy@randompaper.co
privateKey /Users/uetchy/.ssh/id_rsa
```

All config will be saved to `~/.git-account`

## Installation

```
npm i -g git-account
```

## Usage

```
$ git account <command> [<args>]
```

## Commands

```console
status         Show current status
list           List users
switch [name]  Switch user
exec           Run command
add            Add user
remove         Remove user
help [cmd]     display help for [cmd]
```
