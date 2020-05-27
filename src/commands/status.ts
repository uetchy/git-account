#!/usr/bin/env node

import chalk from 'chalk';
import columnify from 'columnify';
import {getCurrentUser} from '../git';

interface Options {
  command: String;
}

const {log} = console;

export const command = 'status';
export const desc = 'Show status';
export const builder = {};
export async function handler(argv: Options) {
  try {
    const user = await getCurrentUser();
    log(columnify(user, {showHeaders: false}));
  } catch (err) {
    log(chalk.red('cannot find config file'), err.message);
    log('put config on', chalk.green('~/.git-account'));
  }
}
