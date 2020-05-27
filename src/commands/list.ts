#!/usr/bin/env node

import chalk from 'chalk';
import columnify from 'columnify';
import {loadConfig} from '../config';

interface Options {
  command: String;
}

export const command = 'list';
export const desc = 'List users';
export const builder = {};
export async function handler(argv: Options) {
  const users = await loadConfig();
  if (users.length > 0) {
    console.log(columnify(users));
  } else {
    console.log('no users defined', chalk.green('$ git account add'));
  }
}
