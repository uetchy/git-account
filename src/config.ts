import { homedir } from 'os'
import fs from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import fileExists from 'file-exists'

const CONFIG_PATH = join(homedir(), '.git-account')

export function writeConfig(config: Config) {
  return new Promise<Config>(async (resolve, reject) => {
    const data = JSON.stringify(config, null, '  ')
    try {
      await promisify(fs.writeFile)(CONFIG_PATH, data, 'utf8')
      resolve(config)
    } catch (err) {
      reject(err)
    }
  })
}

export function loadConfig() {
  return new Promise<Config>(async (resolve, reject) => {
    if (!fileExists(CONFIG_PATH)) {
      fs.writeFileSync(CONFIG_PATH, '[]', 'utf-8')
    }
    try {
      const data = await promisify(fs.readFile)(CONFIG_PATH, 'utf-8')
      resolve(JSON.parse(data))
    } catch (err) {
      reject(err)
    }
  })
}
