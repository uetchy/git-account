#!/usr/bin/env node

import chalk from 'chalk';
import columnify from 'columnify';
import prompts from 'prompts';
import {loadConfig, Config} from '../config';
import {switchAccount} from '../git';

interface Options {
  command: string;
  email?: string;
}

async function askUser(users: Config) {
  const questions = [
    {
      type: 'select' as const,
      name: 'user',
      message: 'Select account:',
      choices: users.map((user) => ({
        title: `${user.name} <${user.email}>`,
        value: user,
      })),
    },
  ];
  const result = await prompts(questions);
  return result.user;
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
