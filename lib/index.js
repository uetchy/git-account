const { homedir } = require('os')
const fs = require('fs')
const { join } = require('path')
const pify = require('pify')
const execa = require('execa')
const fileExists = require('file-exists')
const gitconfig = require('./gitconfig')

const CONFIG_PATH = join(homedir(), '.git-account')

function addUser(user) {
  return new Promise(async (resolve, reject) => {
    try {
      const config = await loadConfig()
      await writeConfig([].concat(config, user))
      resolve(user)
    } catch (err) {
      reject(err)
    }
  })
}

function removeUser(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const config = await loadConfig()
      writeConfig(config.filter(user => user.id !== id))
      resolve(id)
    } catch (err) {
      reject(err)
    }
  })
}

function writeConfig(config) {
  return new Promise(async (resolve, reject) => {
    const data = JSON.stringify(config, null, '  ')
    try {
      await pify(fs.writeFile)(CONFIG_PATH, data, 'utf8')
      resolve(config)
    } catch (err) {
      reject(err)
    }
  })
}

function loadConfig() {
  return new Promise(async (resolve, reject) => {
    if (!fileExists(CONFIG_PATH)) {
      fs.writeFileSync(CONFIG_PATH, '[]', 'utf-8')
    }
    try {
      const data = await pify(fs.readFile)(CONFIG_PATH, 'utf-8')
      resolve(JSON.parse(data))
    } catch (err) {
      reject(err)
    }
  })
}

function switchAccount(user) {
  return new Promise(async (resolve, reject) => {
    const entries = {
      'user.name': user.name,
      'user.email': user.email,
      'remote.origin.gtPrivateKeyPath': user.privateKey,
    }
    try {
      await gitconfig.setLocalConfig(entries)
      resolve(entries)
    } catch (err) {
      reject(err)
    }
  })
}

function execCommand(command) {
  return new Promise(async (resolve, reject) => {
    try {
      const config = await gitconfig.getCombinedConfig()
      const { gtPrivateKeyPath } = config[`remote "origin"`]
      const { name, email } = config.user
      const env = {
        GIT_SSH_COMMAND: `ssh -i ${gtPrivateKeyPath} -oIdentitiesOnly=yes`,
        GIT_COMMITTER_NAME: name,
        GIT_COMMITTER_EMAIL: email,
        GIT_AUTHOR_NAME: name,
        GIT_AUTHOR_EMAIL: email,
      }
      const result = await execa.shell(command.join(' '), { env })
      resolve(result.stdout)
    } catch (err) {
      reject(err)
    }
  })
}

function getCurrentUser() {
  return new Promise(async (resolve, reject) => {
    try {
      const config = await gitconfig.getCombinedConfig()
    } catch (err) {
      reject(err)
    }
    const user = {
      name: config.user.name,
      email: config.user.email,
      privateKey: config[`remote "origin"`].gtPrivateKeyPath,
    }
    resolve(user)
  })
}

module.exports = {
  addUser,
  removeUser,
  loadConfig,
  writeConfig,
  switchAccount,
  execCommand,
  getCurrentUser,
}
