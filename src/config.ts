import fs from 'fs';
import {homedir} from 'os';
import {join} from 'path';
import {promisify} from 'util';

export interface User {
  name: string;
  email: string;
  privateKey: string;
}

export type Config = User[];

const CONFIG_PATH = join(homedir(), '.git-account');

export async function addUser(user: User) {
  const config = await loadConfig();
  await writeConfig([...config, user]);
  return user;
}

export async function removeUser(email: string): Promise<string> {
  const config = await loadConfig();
  writeConfig(config.filter((user: User) => user.email !== email));
  return email;
}

export async function writeConfig(config: Config): Promise<Config> {
  const data = JSON.stringify(config, null, '  ');
  try {
    await promisify(fs.writeFile)(CONFIG_PATH, data, 'utf8');
    return config;
  } catch (err) {
    throw new Error(err);
  }
}

export async function loadConfig(): Promise<Config> {
  try {
    const data = await promisify(fs.readFile)(CONFIG_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await promisify(fs.writeFile)(CONFIG_PATH, '[]\n', 'utf-8');
      return [];
    } else {
      throw new Error(`unhandled load config err: ${err}`);
    }
  }
}
