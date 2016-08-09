const {homedir} = require('os');
const {resolve} = require('path');
const fs = require('fs');
const ini = require('ini');
const gitconfig = require('gitconfig');

const GLOBAL_CONFIG_PATH = resolve(homedir(), '.gitconfig');
const LOCAL_CONFIG_PATH = resolve('.git', 'config');

function _merge(obj1, obj2) {
	Object.keys(obj2).forEach(key => {
		obj1[key] = obj2[key];
	});
	return obj1;
}

function getGlobalConfig() {
	return ini.parse(fs.readFileSync(GLOBAL_CONFIG_PATH, 'utf-8'));
}

function getLocalConfig() {
	return ini.parse(fs.readFileSync(LOCAL_CONFIG_PATH, 'utf-8'));
}

function getCombinedConfig() {
	return _merge(getGlobalConfig(), getLocalConfig());
}

function setLocalConfig(config) {
	return new Promise((resolve, reject) => {
		gitconfig.set({config}, {location: 'local'})
		.then(() => {
			resolve();
		}).catch(err => {
			reject(err);
		});
	});
}

function setGlobalConfig(config) {
	return new Promise((resolve, reject) => {
		gitconfig.set({config}, {location: 'global'})
		.then(() => {
			resolve();
		}).catch(err => {
			reject(err);
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
