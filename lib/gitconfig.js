const {homedir} = require('os');
const {resolve} = require('path');
const fs = require('fs');
const ini = require('ini');
const execa = require('execa');

const GLOBAL_CONFIG_PATH = resolve(homedir(), '.gitconfig');
const LOCAL_CONFIG_PATH = resolve('.git', 'config');

function _merge(obj1, obj2) {
	Object.keys(obj2).forEach(key => {
		obj1[key] = obj2[key];
	});
	return obj1;
}

function getGlobalConfig() {
	return new Promise((resolve, reject) => {
		try {
			resolve(ini.parse(fs.readFileSync(GLOBAL_CONFIG_PATH, 'utf-8')));
		} catch (err) {
			reject(err);
		}
	});
}

function getLocalConfig() {
	return new Promise((resolve, reject) => {
		try {
			resolve(ini.parse(fs.readFileSync(LOCAL_CONFIG_PATH, 'utf-8')));
		} catch (err) {
			reject(err);
		}
	});
}

function getCombinedConfig() {
	return new Promise((resolve, reject) => {
		Promise.all([getLocalConfig(), getGlobalConfig()])
			.then(config => {
				resolve(_merge(...config));
			})
			.catch(err => {
				reject(err);
			});
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
