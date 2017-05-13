const { homedir } = require('os')
const { resolve } = require('path')
const fs = require('fs')
const ini = require('ini')
const execa = require('execa')
const pify = require('pify')

const CONFIG_PATH = {
  global: resolve(homedir(), '.gitconfig'),
  local: resolve('.git', 'config')
}

function _merge(obj1, obj2) {
  Object.keys(obj2).forEach(key => {
    obj1[key] = obj2[key]
  })
  return obj1
}

function getConfig(scope) {
  return new Promise((resolve, reject) => {
    return pify(fs.readFile)(CONFIG_PATH[scope], 'utf-8')
      .then(data => resolve(ini.parse(data)))
      .catch(err => reject(err))
  })
}

function getGlobalConfig() {
  return getConfig('global')
}

function getLocalConfig() {
  return getConfig('local')
}

function getCombinedConfig() {
  return new Promise((resolve, reject) => {
    Promise.all([getGlobalConfig(), getLocalConfig()])
      .then(config => resolve(_merge(...config)))
      .catch(err => reject(err))
  })
}

function setConfig(entries, scope = 'local') {
  return new Promise((resolve, reject) => {
    Promise.all(
      Object.keys(entries).map(key =>
        execa.shell(`git config --${scope} '${key}' '${entries[key]}'`)
      )
    )
      .then(() => resolve())
      .catch(err => reject(err))
  })
}

function setGlobalConfig(entries) {
  return setConfig(entries, 'global')
}

function setLocalConfig(entries) {
  return setConfig(entries, 'local')
}

module.exports = {
  getGlobalConfig,
  getLocalConfig,
  getCombinedConfig,
  setGlobalConfig,
  setLocalConfig
}
