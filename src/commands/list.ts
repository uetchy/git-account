#!/usr/bin/env node

import os from 'os';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import qoa from 'qoa';
import columnify from 'columnify';
import {loadConfig} from '../config';

interface Options {
  command: String;
}

const {log} = console;

export const command = 'list';
export const desc = 'List users';
export const builder = {};
export async function handler(argv: Options) {
  const users = await loadConfig();
  if (users.length > 0) {
    log(columnify(users));
  } else {
    log('no users defined', chalk.green('$ git account add'));
  }
}
