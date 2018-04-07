const { homedir } = require('os')
const path = require('path')
const fs = require('fs')
const ini = require('ini')
const execa = require('execa')
const pify = require('pify')
const { promisify } = require('util')

const CONFIG_PATH = {
  global: path.resolve(homedir(), '.gitconfig'),
  local: path.resolve('.git', 'config'),
}

function _merge(obj1, obj2) {
  Object.keys(obj2).forEach(key => {
    obj1[key] = obj2[key]
  })
  return obj1
}

function getConfig(scope) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await promisify(fs.readFile)(CONFIG_PATH[scope], 'utf-8')

      resolve(ini.parse(data))
    } catch (err) {
      reject(err)
    }
  })
}

function getGlobalConfig() {
  return getConfig('global')
}

function getLocalConfig() {
  return getConfig('local')
}

function getCombinedConfig() {
  return new Promise(async (resolve, reject) => {
    try {
      const configList = await Promise.all([getGlobalConfig(), getLocalConfig()])
      resolve(_merge(...configList))
    } catch (err) {
      reject(err)
    }
  })
}

function setConfig(entries, scope = 'local') {
  return new Promise(async (resolve, reject) => {
    try {
      await Promise.all(
        Object.keys(entries).map(key =>
          execa.shell(`git config --${scope} '${key}' '${entries[key]}'`)
        )
      )
      resolve()
    } catch (err) {
      reject(err)
    }
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
  setLocalConfig,
}
