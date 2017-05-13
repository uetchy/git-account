const { homedir } = require('os')
const fs = require('fs')
const { join } = require('path')
const pify = require('pify')
const execa = require('execa')
const fileExists = require('file-exists')
const gitconfig = require('./gitconfig')

const CONFIG_PATH = join(homedir(), '.git-account')

function addUser(user) {
  return new Promise((resolve, reject) => {
    loadConfig()
      .then(config => writeConfig([].concat(config, user)))
      .then(() => resolve(user))
      .catch(err => reject(err))
  })
}

function removeUser(id) {
  return new Promise((resolve, reject) => {
    loadConfig()
      .then(config => writeConfig(config.filter(user => user.id !== id)))
      .then(() => resolve(id))
      .catch(err => reject(err))
  })
}

function writeConfig(config) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(config, null, '  ')
    return pify(fs.writeFile)(CONFIG_PATH, data, 'utf8')
      .then(() => resolve(config))
      .catch(err => reject(err))
  })
}

function loadConfig() {
  return new Promise((resolve, reject) => {
    if (!fileExists(CONFIG_PATH)) {
      fs.writeFileSync(CONFIG_PATH, '[]', 'utf-8')
    }
    return pify(fs.readFile)(CONFIG_PATH, 'utf-8')
      .then(data => resolve(JSON.parse(data)))
      .catch(err => reject(err))
  })
}

function switchAccount(user) {
  return new Promise((resolve, reject) => {
    const entries = {
      'user.name': user.name,
      'user.email': user.email,
      'remote.origin.gtPrivateKeyPath': user.privateKey
    }
    return gitconfig
      .setLocalConfig(entries)
      .then(() => resolve(entries))
      .catch(err => reject(err))
  })
}

function execCommand(command) {
  return new Promise((resolve, reject) => {
    gitconfig
      .getCombinedConfig()
      .then(config => {
        const { gtPrivateKeyPath } = config[`remote "origin"`]
        const { name, email } = config.user
        const env = {
          GIT_SSH_COMMAND: `ssh -i ${gtPrivateKeyPath} -oIdentitiesOnly=yes`,
          GIT_COMMITTER_NAME: name,
          GIT_COMMITTER_EMAIL: email,
          GIT_AUTHOR_NAME: name,
          GIT_AUTHOR_EMAIL: email
        }

        return execa.shell(command.join(' '), { env })
      })
      .then(result => resolve(result.stdout))
      .catch(err => reject(err))
  })
}

function getCurrentUser() {
  return new Promise((resolve, reject) => {
    gitconfig
      .getCombinedConfig()
      .then(config => {
        const user = {
          name: config.user.name,
          email: config.user.email,
          privateKey: config[`remote "origin"`].gtPrivateKeyPath
        }
        resolve(user)
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = {
  addUser,
  removeUser,
  loadConfig,
  writeConfig,
  switchAccount,
  execCommand,
  getCurrentUser
}
