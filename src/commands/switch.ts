#!/usr/bin/env node

import chalk from 'chalk';
import columnify from 'columnify';

import {loadConfig, Config} from '../config';
import {switchAccount} from '../git';
import {askUser} from '../interactive';

interface Options {
  command: string;
  email?: string;
}

export const command = 'switch';
export const desc = 'Switch user';
export const builder = {email: {}};
export async function handler(argv: Options) {
  const users = await loadConfig();
  const selected =
    users.find((user) => user.email === argv.email) || (await askUser(users));
  if (!selected) return;

  const user = await switchAccount(selected);
  console.log(chalk.green('switched'));
  console.log(columnify(user));
}
