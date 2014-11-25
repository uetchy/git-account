# git-user

This script adds user management feature to `git`. It makes you able to change __user.name__, __user.email__ and __private key__ easily.

```console
$ git config user.name
John Doe
$ git user switch andy
User switched to <Andreas Iwata>
$ git config user.name
Andreas Iwata
```

```console
$ git clone git@github.com:uetchy/private-repo.git
Cloning into 'private-repo'...
ERROR: Repository not found.
$ git user switch uetchy
User switched to <Yasuaki Uechi>
$ git clone git@github.com:uetchy/private-repo.git
Cloning into 'private-repo'...
remote: Counting objects: 59, done.
```

## Installation

```console
$ git clone https://github.com/uetchy/git-user.git
$ cd git-user
$ cp git-user /path/to/git-user # e.g. /usr/local/bin
$ chmod +x /path/to/git-user
```

## Usage

```console
$ git user <command> [<args>]
```

### Commands

```console
$ git user # show the list of commands
$ git user list # show the list of choosable users
$ git user switch <user> # switch user of current repository
```

### .gituser

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

That configuration must be named __.gituser__ and placed in __HOME__ directory.

You can use __gituser.sample__ for making .gituser easily.

```console
$ cp gituser.sample ~/.gituser
$ vim ~/.gituser
```
