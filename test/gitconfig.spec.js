const {homedir} = require('os');
const {resolve} = require('path');
const fs = require('fs');
const assert = require('assert');
const mockery = require('mockery');

const gitconfigPath = '../lib/gitconfig';

const GLOBAL_CONFIG_SOURCE = fs.readFileSync('./test/fixture/global_config', 'utf-8');
const GLOBAL_CONFIG_EXPECTED = {
	user: {
		name: 'Globe Trotter',
		email: 'globe.trotter@example.com'
	}
};
const LOCAL_CONFIG_SOURCE = fs.readFileSync('./test/fixture/local_config', 'utf-8');
const LOCAL_CONFIG_EXPECTED = { // eslint-disable-line quote-props
	user: {
		name: 'Local Officer', email: 'local.officer@example.com'
	},
	'remote "origin"': {
		url: 'ssh://git@github.com/uetchy/git-user',
		fetch: '+refs/heads/*:refs/remotes/origin/*',
		gtPrivateKeyPath: '~/.ssh/id_rsa_local_officer'
	},
	'branch "master"': {
		remote: 'origin',
		merge: 'refs/heads/master'
	}
};

describe('gitconfig', () => {
	describe('#getGlobalConfig()', () => {
		it('should return git global config', () => {
			const fsMock = {
				readFileSync: path => {
					assert.equal(path, resolve(homedir(), '.gitconfig'));
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

			assert.deepEqual(gitconfig.getGlobalConfig(), GLOBAL_CONFIG_EXPECTED);

			mockery.disable();
			mockery.deregisterAll();
		});
	});

	describe('#getLocalConfig()', () => {
		it('should return git local config', () => {
			const fsMock = {
				readFileSync: path => {
					assert.equal(path, resolve('.git', 'config'));
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

			assert.deepEqual(gitconfig.getLocalConfig(), LOCAL_CONFIG_EXPECTED);

			mockery.disable();
			mockery.deregisterAll();
		});
	});
});
