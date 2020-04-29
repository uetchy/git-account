#!/usr/bin/env node

import os from 'os'
import path from 'path'
import chalk from 'chalk'
import fs from 'fs'
import qoa from 'qoa'
import columnify from 'columnify'
import { runCommand } from '../git'

interface Options {
  command: String
}

const { log } = console

export const command = 'add'
export const desc = 'Add user'
export const builder = {}
export async function handler(argv: Options) {
  const result = await runCommand(argv.command.split(' '))
  log(result)
}
