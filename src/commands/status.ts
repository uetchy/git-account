#!/usr/bin/env node

import os from 'os';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import qoa from 'qoa';
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
    const user = getCurrentUser();
    log(columnify(user, {showHeaders: false}));
  } catch (err) {
    log(chalk.red('cannot find config file'), err.message);
    log('put config on', chalk.green('~/.git-account'));
  }
}
