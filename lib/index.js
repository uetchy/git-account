const {homedir} = require('os');
const {join} = require('path');
const cp = require('child_process');
const Promise = require('bluebird');
const gitconfig = require('./gitconfig');

const {execAsync} = Promise.promisifyAll(cp);

function listUsers() {
	const configPath = process.env.GIT_USER_CONFIG_PATH || join(homedir(), '.git-user');
	try {
		const users = require(configPath);
		return users;
	} catch (err) {
		return err;
	}
}

function switchUser(user) {
	return new Promise((resolve, reject) => {
		gitconfig.setLocal({
			'user.name': user.name,
			'user.email': user.email,
			'remote.origin.gtPrivateKeyPath': user.privateKey
		})
		.then(() => {
			resolve();
		})
		.catch(err => {
			reject(err);
		});
	});
}

function execCommand(command) {
	return new Promise((resolve, reject) => {
		const config = gitconfig.getCombinedConfig();
		const {gtPrivateKeyPath} = config[`remote "origin"`];
		const {name, email} = config.user;
		const env = {
			GIT_SSH_COMMAND: `ssh -i ${gtPrivateKeyPath} -oIdentitiesOnly=yes`,
			GIT_COMMITTER_NAME: name,
			GIT_COMMITTER_EMAIL: email,
			GIT_AUTHOR_NAME: name,
			GIT_AUTHOR_EMAIL: email
		};

		execAsync(command, {env})
		.then(result => resolve(result))
		.catch(err => reject(err));
	});
}

module.exports = {
	listUsers,
	switchUser,
	execCommand
};
