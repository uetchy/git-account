import { homedir } from 'os'
import fs from 'fs'
import { join } from 'path'
import test from 'ava'
import mockery from 'mockery'

const gitconfigPath = '../dist/gitconfig'

const GLOBAL_CONFIG_SOURCE = fs.readFileSync(
  join(__dirname, 'fixture/global_config'),
  'utf-8'
)
const GLOBAL_CONFIG_EXPECTED = {
  user: {
    name: 'Globe Trotter',
    email: 'globe.trotter@example.com',
  },
}
const LOCAL_CONFIG_SOURCE = fs.readFileSync(
  join(__dirname, 'fixture/local_config'),
  'utf-8'
)
const LOCAL_CONFIG_EXPECTED = {
  // eslint-disable-line quote-props
  user: {
    name: 'Local Officer',
    email: 'local.officer@example.com',
  },
  'remote "origin"': {
    url: 'ssh://git@github.com/uetchy/git-account',
    fetch: '+refs/heads/*:refs/remotes/origin/*',
    gtPrivateKeyPath: '~/.ssh/id_rsa_local_officer',
  },
  'branch "master"': {
    remote: 'origin',
    merge: 'refs/heads/master',
  },
}

test.serial('get global gitconfig', async (t) => {
  const fsMock = {
    readFile: function(path, enc, cb) {
      t.is(path, `${homedir()}/.gitconfig`)
      cb(null, GLOBAL_CONFIG_SOURCE)
    },
  }

  mockery.registerAllowable(gitconfigPath)
  mockery.registerMock('fs', fsMock)
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false,
  })

  const gitconfig = require(gitconfigPath)
  const config = await gitconfig.getGlobalConfig()
  t.deepEqual(config, GLOBAL_CONFIG_EXPECTED)

  mockery.disable()
  mockery.deregisterAll()
})

test.serial('get local gitconfig', async (t) => {
  const fsMock = {
    readFile: function(path, enc, cb) {
      t.is(path, `${process.cwd()}/.git/config`)
      cb(null, LOCAL_CONFIG_SOURCE)
    },
  }

  mockery.registerAllowable(gitconfigPath)
  mockery.registerMock('fs', fsMock)
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false,
  })

  const gitconfig = require(gitconfigPath)
  const config = await gitconfig.getLocalConfig()

  t.deepEqual(config, LOCAL_CONFIG_EXPECTED)

  mockery.disable()
  mockery.deregisterAll()
})
