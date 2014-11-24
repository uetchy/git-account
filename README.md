# git-user

This script adds user management feature to `git`. It makes you able to change __user.name__, __user.email__ and __private key__ easily.

```bash
$ git config user.name
John Doe
$ git user switch andy
User switched to <Andreas Iwata>
$ git config user.name
Andreas Iwata
```

## Installation

```bash
$ git clone https://github.com/uetchy/git-user.git
$ cd git-user
$ cp git-user /path/to/git-user # e.g. /usr/local/bin
$ chmod +x /path/to/git-user
```

## Usage

```bash
$ git user <command> [<args>]
```

### Commands

```bash
$ git user # show the list of commands
$ git user list # show the list of choosable users
$ git user switch <user> # switch user of current repository
```

### .gituser

Example configuration is here.

```
john:
  name: John Doe
  email: john@example.com
  private_key: id_rsa
superco:
  name: Super Corporation
  email: info@super.co
  private_key: github_superco_rsa
```

That configuration must be named __.gituser__ and placed in __HOME__ directory.

You can use __gituser.sample__ for making .gituser easily.

```
$ cp gituser.sample ~/.gituser
$ vim ~/.gituser
```
