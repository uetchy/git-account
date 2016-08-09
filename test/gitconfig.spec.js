import {homedir} from 'os';
import fs from 'fs';
import test from 'ava';
import mockery from 'mockery';

const gitconfigPath = '../lib/gitconfig';

const GLOBAL_CONFIG_SOURCE = fs.readFileSync('./fixture/global_config', 'utf-8');
const GLOBAL_CONFIG_EXPECTED = {
	user: {
		name: 'Globe Trotter',
		email: 'globe.trotter@example.com'
	}
};
const LOCAL_CONFIG_SOURCE = fs.readFileSync('./fixture/local_config', 'utf-8');
const LOCAL_CONFIG_EXPECTED = { // eslint-disable-line quote-props
	user: {
		name: 'Local Officer', email: 'local.officer@example.com'
	},
	'remote "origin"': {
		url: 'ssh://git@github.com/uetchy/git-account',
		fetch: '+refs/heads/*:refs/remotes/origin/*',
		gtPrivateKeyPath: '~/.ssh/id_rsa_local_officer'
	},
	'branch "master"': {
		remote: 'origin',
		merge: 'refs/heads/master'
	}
};

test('get global gitconfig', t => {
	const fsMock = {
		readFileSync: path => {
			t.is(path, `${homedir()}/.gitconfig`);
			return GLOBAL_CONFIG_SOURCE;
		}
	};

	mockery.registerAllowable(gitconfigPath);
	mockery.registerMock('fs', fsMock);
	mockery.enable({
		useCleanCache: true,
		warnOnReplace: false,
		warnOnUnregistered: false
	});

	const gitconfig = require(gitconfigPath);

	t.deepEqual(gitconfig.getGlobalConfig(), GLOBAL_CONFIG_EXPECTED);

	mockery.disable();
	mockery.deregisterAll();
});

test('get local gitconfig', t => {
	const fsMock = {
		readFileSync: path => {
			t.is(path, `${process.cwd()}/.git/config`);
			return LOCAL_CONFIG_SOURCE;
		}
	};

	mockery.registerAllowable(gitconfigPath);
	mockery.registerMock('fs', fsMock);
	mockery.enable({
		useCleanCache: true,
		warnOnReplace: false,
		warnOnUnregistered: false
	});

	const gitconfig = require(gitconfigPath);

	t.deepEqual(gitconfig.getLocalConfig(), LOCAL_CONFIG_EXPECTED);

	mockery.disable();
	mockery.deregisterAll();
});
