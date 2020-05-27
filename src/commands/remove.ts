#!/usr/bin/env node

import chalk from 'chalk';
import prompts from 'prompts';
import {loadConfig, removeUser} from '../config';

interface Options {
  command: String;
}

const {log} = console;

export const command = 'remove';
export const desc = 'Remove users';
export const builder = {};
export async function handler(argv: Options) {
  const users = await loadConfig();
  const questions = [
    {
      type: 'select',
      name: 'user',
      message: 'Select account to remove',
      choices: users.map((value) => ({
        title: `${value.name} <${value.email}>`,
        value,
      })),
    },
  ] as Array<prompts.PromptObject>;
  const result = await prompts(questions, {
    onCancel: () => {
      process.exit(0);
    },
  });
  if (!result.user) return;
  console.log(result);
  await removeUser(result.user.email);
  log(chalk.green('removed'));
}
