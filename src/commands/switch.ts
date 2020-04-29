#!/usr/bin/env node

import os from 'os'
import path from 'path'
import chalk from 'chalk'
import fs from 'fs'
import qoa from 'qoa'
import columnify from 'columnify'

import { switchAccount } from '../git'
import { loadConfig } from '../config'

interface Options {
  command: String
}

const { log } = console

export const command = 'add'
export const desc = 'Add user'
export const builder = {}
export async function handler(argv: Options) {
  const users = await loadConfig()
  const questions = [
    {
      type: 'interactive',
      handle: 'user',
      query: 'Select account:',
      symbol: '❍',
      menu: users.map((value) => ({
        name: `${value.name} <${value.email}>`,
        value,
      })),
    },
  ]
  const result = await qoa.prompt(questions)
  const user = await switchAccount(result.user)
  console.log(chalk.green('switched'))
  console.log(columnify(user))
}
