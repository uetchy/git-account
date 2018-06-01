import { homedir } from 'os'
import path from 'path'
import fs from 'fs'
import ini from 'ini'
import execa from 'execa'
import { promisify } from 'util'

const CONFIG_PATH: IObject = {
  global: path.resolve(homedir(), '.gitconfig'),
  local: path.resolve('.git', 'config'),
}

function _merge(obj1: IObject, obj2: IObject) {
  Object.keys(obj2).forEach(key => {
    obj1[key] = obj2[key]
  })
  return obj1
}

function getConfig(scope: string) {
  return new Promise<Config>(async (resolve, reject) => {
    try {
      const data = await promisify(fs.readFile)(CONFIG_PATH[scope], 'utf-8')
      resolve(ini.parse(data))
    } catch (err) {
      reject(err)
    }
  })
}

export function getGlobalConfig() {
  return getConfig('global')
}

export function getLocalConfig() {
  return getConfig('local')
}

export function getCombinedConfig() {
  return new Promise<Config>(async (resolve, reject) => {
    try {
      const configList = await Promise.all([
        getGlobalConfig(),
        getLocalConfig(),
      ])
      resolve(_merge(configList[0], configList[1]))
    } catch (err) {
      reject(err)
    }
  })
}

function setConfig(entries: IObject, scope = 'local') {
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

export function setGlobalConfig(entries: IObject) {
  return setConfig(entries, 'global')
}

export function setLocalConfig(entries: IObject) {
  return setConfig(entries, 'local')
}
