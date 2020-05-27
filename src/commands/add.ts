#!/usr/bin/env node

import chalk from 'chalk';
import columnify from 'columnify';
import fs from 'fs';
import os from 'os';
import path from 'path';
import prompts from 'prompts';
import validator from 'validator';
import {addUser, User} from '../config';

export const command = 'add';
export const desc = 'Add user';
export const builder = {};
export async function handler(argv: {}) {
  const sshDir = path.resolve(os.homedir(), '.ssh');
  const questions = [
    {
      type: 'text',
      name: 'name',
      message: 'name',
      validate: (value) => value.length > 0,
    },
    {
      type: 'text',
      name: 'email',
      message: 'email',
      validate: (value) => validator.isEmail(value),
    },
    {
      type: 'select',
      name: 'privateKey',
      message: 'private key',
      choices: fs
        .readdirSync(sshDir)
        .filter((f) => !/^(config|known_hosts|.+\.pub)$/.test(f))
        .map((f) => ({title: f, value: path.join(sshDir, f)})),
    },
  ] as Array<prompts.PromptObject>;

  const result = await prompts(questions, {
    onCancel: () => {
      process.exit(0);
    },
  });
  const user = await addUser(result as User);
  console.log(chalk.green('User added successfully.'));
  console.log(columnify(user, {showHeaders: false}));
}
