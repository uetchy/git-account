import { homedir } from 'os'
import fs from 'fs'
import { join } from 'path'
import { promisify } from 'util'

const CONFIG_PATH = join(homedir(), '.git-account')

export async function writeConfig(config: Config) {
  const data = JSON.stringify(config, null, '  ')
  try {
    await promisify(fs.writeFile)(CONFIG_PATH, data, 'utf8')
    return config
  } catch (err) {
    throw new Error(err)
  }
}

export async function loadConfig() {
  try {
    const data = await promisify(fs.readFile)(CONFIG_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    if (err.code === 'ENOENT') {
      await promisify(fs.writeFile)(CONFIG_PATH, '[]\n', 'utf-8')
      return []
    } else {
      throw new Error(`unhandled load config err: ${err}`)
    }
  }
}
