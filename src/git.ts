import { homedir } from 'os'
import path from 'path'
import fs from 'fs'
import ini from 'ini'
import execa from 'execa'
import { promisify } from 'util'
import { User } from './config'

export type ConfigScope = 'global' | 'local'

export interface ConfigPath {
  global: string
  local: string
}

export interface GitConfigParams {
  'user.name': string
  'user.email': string
  'remote.origin.gtPrivateKeyPath': string
  'core.sshCommand': string
}

export interface Remote {
  url: string
  fetch: string
  gtPrivateKeyPath?: string
}

export interface GitConfig {
  'remote "origin"'?: Remote
  user: {
    name: string
    email: string
  }
}

const CONFIG_PATH: ConfigPath = {
  global: path.resolve(homedir(), '.gitconfig'),
  local: path.resolve('.git', 'config'),
}

export async function switchAccount(user: User): Promise<GitConfigParams> {
  const entries: GitConfigParams = {
    'user.name': user.name,
    'user.email': user.email,
    'remote.origin.gtPrivateKeyPath': user.privateKey,
    'core.sshCommand': `ssh -i ${user.privateKey} -oIdentitiesOnly=yes`,
  }
  try {
    await setLocalConfig(entries)
    return entries
  } catch (err) {
    throw new Error(err.message)
  }
}

export async function runCommand(command: Array<string>) {
  try {
    const config = await getCombinedConfig()
    const { gtPrivateKeyPath } = config[`remote "origin"`]!
    const { name, email } = config.user
    const env = {
      GIT_SSH_COMMAND: `ssh -i ${gtPrivateKeyPath} -oIdentitiesOnly=yes`,
      GIT_COMMITTER_NAME: name,
      GIT_COMMITTER_EMAIL: email,
      GIT_AUTHOR_NAME: name,
      GIT_AUTHOR_EMAIL: email,
    }
    const result = await execa(command.join(' '), { env })
    return result.stdout
  } catch (err) {
    throw new Error(err.message)
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    const config = await getCombinedConfig()
    const user: User = {
      name: config.user.name,
      email: config.user.email,
      privateKey: config[`remote "origin"`]!.gtPrivateKeyPath!,
    }
    return user
  } catch (err) {
    throw new Error(err.message)
  }
}

async function getConfig(scope: ConfigScope): Promise<GitConfig> {
  const data = await promisify(fs.readFile)(CONFIG_PATH[scope], 'utf-8')
  return ini.parse(data) as GitConfig
}

export async function getGlobalConfig(): Promise<GitConfig> {
  return getConfig('global')
}

export async function getLocalConfig(): Promise<GitConfig> {
  return getConfig('local')
}

export async function getCombinedConfig(): Promise<GitConfig> {
  const configList = await Promise.all([getGlobalConfig(), getLocalConfig()])
  return { ...configList[0], ...configList[1] }
}

function setConfig(entries: GitConfigParams, scope: ConfigScope = 'local') {
  return new Promise(async (resolve, reject) => {
    try {
      await Promise.all(
        (Object.keys(entries) as Array<keyof GitConfigParams>).map((key) =>
          execa(`git config --${scope} '${key}' '${entries[key]}'`)
        )
      )
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

export function setGlobalConfig(entries: GitConfigParams) {
  return setConfig(entries, 'global')
}

export function setLocalConfig(entries: GitConfigParams) {
  return setConfig(entries, 'local')
}
