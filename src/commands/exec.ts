#!/usr/bin/env node

import {runCommand} from '../git';

interface Options {
  command: string;
}

export const command = 'exec <command>';
export const desc = 'Exec command behalf of the specified user';
export const builder = {};
export async function handler(argv: Options) {
  try {
    await runCommand(argv.command.split(' '), {stdio: 'inherit', shell: true});
  } catch (err) {}
}
