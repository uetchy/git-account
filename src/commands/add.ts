#!/usr/bin/env node

import chalk from 'chalk';
import columnify from 'columnify';
import fs from 'fs';
import os from 'os';
import path from 'path';
import validator from 'validator';

import {addUser, User} from '../config';
import {prompt} from '../interactive';

export const command = 'add';
export const desc = 'Add user';
export const builder = {};
export async function handler(argv: {}) {
  const sshDir = path.resolve(os.homedir(), '.ssh');
  const questions = [
    {
      type: 'text' as const,
      name: 'name',
      message: 'name',
      validate: (value: string) => value.length > 0,
    },
    {
      type: 'text' as const,
      name: 'email',
      message: 'email',
      validate: (value: string) => validator.isEmail(value),
    },
    {
      type: 'select' as const,
      name: 'privateKey',
      message: 'private key',
      choices: fs
        .readdirSync(sshDir)
        .filter((f) => !/^(config|known_hosts|.+\.pub)$/.test(f))
        .map((f) => ({title: f, value: path.join(sshDir, f)})),
    },
  ];

  const result = await prompt(questions);
  const user = await addUser(result as User);
  console.log(chalk.green('User added successfully.'));
  console.log(columnify(user, {showHeaders: false}));
}
