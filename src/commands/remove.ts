#!/usr/bin/env node

import os from 'os';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import qoa from 'qoa';
import columnify from 'columnify';

import {removeUser} from '../config';
import {loadConfig} from '../config';

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
      type: 'interactive',
      handle: 'user',
      query: 'Select account to remove:',
      symbol: '❍',
      menu: users.map((value) => ({
        name: `${value.name} <${value.email}>`,
        value,
      })),
    },
  ];
  const result = await qoa.prompt(questions);
  await removeUser(result.user.name);
  log(chalk.green('removed'));
}
