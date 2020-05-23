#!/usr/bin/env node

import yargs from 'yargs';
import path from 'path';

// update notifier
import updateNotifier from 'update-notifier';
const pkg = require('../package.json');
updateNotifier({pkg}).notify();

yargs
  .commandDir(path.join(__dirname, 'commands'))
  .fail((msg, err) => {
    console.log(msg || err.message);
  })
  .demandCommand()
  .help().argv;
