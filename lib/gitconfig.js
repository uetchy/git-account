const {homedir} = require('os');
const {resolve} = require('path');
const fs = require('fs');
const ini = require('ini');
const execa = require('execa');
const pify = require('pify');

const CONFIG_PATH = {
	global: resolve(homedir(), '.gitconfig'),
	local: resolve('.git', 'config')
};

function _merge(obj1, obj2) {
	Object.keys(obj2).forEach(key => {
		obj1[key] = obj2[key];
	});
	return obj1;
}

function getConfig(scope) {
	return new Promise((resolve, reject) => {
		return pify(fs.readFile)(CONFIG_PATH[scope], 'utf-8')
			.then(data => resolve(ini.parse(data)))
			.catch(err => reject(err));
	});
}

function getGlobalConfig() {
	return getConfig('global');
}

function getLocalConfig() {
	return getConfig('local');
}

function getCombinedConfig() {
	return new Promise((resolve, reject) => {
		Promise.all([getLocalConfig(), getGlobalConfig()])
			.then(config => resolve(_merge(...config)))
			.catch(err => reject(err));
	});
}

function setLocalConfig(entries) {
	return new Promise((resolve, reject) => {
		entries.forEach(entry => {
			execa.shell(`git config --local '${entry.key}' '${entry.value}'`)
				.then(result => resolve(result.stdout))
				.catch(err => reject(err));
		});
	});
}

function setGlobalConfig(entries) {
	return new Promise((resolve, reject) => {
		entries.forEach(entry => {
			execa.shell(`git config --global '${entry.key}' '${entry.value}'`)
				.then(result => resolve(result.stdout))
				.catch(err => reject(err));
		});
	});
}

module.exports = {
	getGlobalConfig,
	getLocalConfig,
	getCombinedConfig,
	setGlobalConfig,
	setLocalConfig
};
