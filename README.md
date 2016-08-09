# git-account

[![Build Status](https://travis-ci.org/uetchy/git-account.svg?branch=master)](https://travis-ci.org/uetchy/git-account) [![Coverage Status](https://coveralls.io/repos/github/uetchy/git-account/badge.svg?branch=master)](https://coveralls.io/github/uetchy/git-account?branch=master)

`git-account` adds user management feature to `git`. It makes you able to change __user.name__, __user.email__ and __private key__ at ease.

```console
$ git config user.name
John Doe
$ git account switch andy
User switched to <Andreas Iwata>
$ git config user.name
Andreas Iwata
```

```console
$ git clone git@github.com:uetchy/private-repo.git
Cloning into 'private-repo'...
ERROR: Repository not found.
$ git account switch uetchy
User switched to <Yasuaki Uechi>
$ git clone git@github.com:uetchy/private-repo.git
Cloning into 'private-repo'...
remote: Counting objects: 59, done.
```

## Installation

```console
$ git clone https://github.com/uetchy/git-account.git
$ cd git-account
$ cp git-account /path/to/git-account # e.g. /usr/local/bin
$ chmod +x /path/to/git-account
```

## Usage

```console
$ git account <command> [<args>]
```

### Commands

```console
$ git account # show the list of commands
$ git account list # show the list of choosable users
$ git account switch <user> # switch user of current repository
```

### .git-account

Example configuration is here.

```yaml
john:
  name: John Doe
  email: john@example.com
  private_key: id_rsa
  github:
    user: john
    token: sEcrEtToKEn
superco:
  name: Super Corporation
  email: info@super.co
  private_key: github_superco_rsa
```

That configuration must be named __.git-account__ and placed in __HOME__ directory.

You can use __git-account.sample__ for making .gituser easily.

```console
$ cp git-account.sample ~/.git-account
$ vim ~/.git-account
```
