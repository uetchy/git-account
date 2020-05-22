#!/usr/bin/env node

import chalk from 'chalk';
import qoa from 'qoa';
import prompts from 'prompts';
import columnify from 'columnify';

import {switchAccount} from '../git';
import {loadConfig} from '../config';

interface Options {
  command: String;
}

export const command = 'switch';
export const desc = 'Switch user';
export const builder = {};
export async function handler(argv: Options) {
  const users = await loadConfig();
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
  if (!result.user) {
    return;
  }
  const user = await switchAccount(result.user);
  console.log(chalk.green('switched'));
  console.log(columnify(user));
}
