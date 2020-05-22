#!/usr/bin/env node

import os from 'os';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import qoa from 'qoa';
import columnify from 'columnify';

import {addUser} from '../config';

export const command = 'add';
export const desc = 'Add user';
export const builder = {};
export async function handler(argv: {}) {
  const sshDir = path.resolve(os.homedir(), '.ssh');
  const questions = [
    {
      type: 'input',
      query: 'Type your name:',
      handle: 'name',
    },
    {
      type: 'input',
      query: 'Type email:',
      handle: 'email',
    },
    {
      type: 'interactive',
      query: 'Choose your private key:',
      handle: 'privatekey',
      symbol: '❍',
      menu: fs
        .readdirSync(sshDir)
        .filter((f) => !/^(config|known_hosts|.+\.pub)$/.test(f))
        .map((f) => path.join(sshDir, f)),
    },
  ];

  const result = await qoa.prompt(questions);
  const user = await addUser(result);
  console.log(chalk.green('User added successfully.'));
  console.log(columnify(user, {showHeaders: false}));
}
