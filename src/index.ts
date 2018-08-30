import execa from 'execa'
import * as gitconfig from './gitconfig'
import { loadConfig, writeConfig } from './config'

export { loadConfig, writeConfig }

export function addUser(user: User) {
  return new Promise(async (resolve, reject) => {
    try {
      const config = await loadConfig()
      await writeConfig(Object.assign({}, config, user))
      resolve(user)
    } catch (err) {
      reject(err)
    }
  })
}

export function removeUser(id: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const config = await loadConfig()
      writeConfig(config.filter((user: User) => user.id !== id))
      resolve(id)
    } catch (err) {
      reject(err)
    }
  })
}

export function switchAccount(user: User) {
  return new Promise<IObject>(async (resolve, reject) => {
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

export function execCommand(command: Array<string>) {
  return new Promise<string>(async (resolve, reject) => {
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

export function getCurrentUser() {
  return new Promise<User>(async (resolve, reject) => {
    try {
      const config = await gitconfig.getCombinedConfig()
      const user = {
        name: config.user.name,
        email: config.user.email,
        privateKey: config[`remote "origin"`].gtPrivateKeyPath,
      }
      resolve(user)
    } catch (err) {
      reject(err)
    }
  })
}
