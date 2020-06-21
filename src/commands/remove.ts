#!/usr/bin/env node

import chalk from 'chalk';
import {loadConfig, removeUser} from '../config';
import {askUser} from '../interactive';

interface Options {
  command: String;
  email?: string;
}

export const command = 'remove';
export const desc = 'Remove users';
export const builder = {};
export async function handler(argv: Options) {
  const users = await loadConfig();
  const selected =
    users.find((user) => user.email === argv.email) || (await askUser(users));
  if (!selected) return;

  console.log(selected);

  await removeUser(selected.email);
  console.log(chalk.green('removed'));
}
