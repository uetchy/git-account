#!/usr/bin/env node

import path from 'path';
import updateNotifier from 'update-notifier';
import yargs from 'yargs';

const pkg = require('../package.json');
updateNotifier({pkg}).notify();

yargs
  .scriptName('git account')
  .commandDir(path.join(__dirname, 'commands'))
  .showHelpOnFail(true)
  .demandCommand(1, '').argv;
