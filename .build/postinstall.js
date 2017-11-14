const fs = require('fs');
const fs_extra = require('fs-extra');
const path = require('path');
const cp = require('child_process');
const yarn = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';

function yarnInstall(location) {
	const result = cp.spawnSync(yarn, ['install'], {
		cwd: location,
		stdio: 'inherit'
	});

	if (result.error || result.status !== 0) {
		process.exit(1);
	}
}


const cwd = process.cwd();
for (const element of fs.readdirSync(cwd)) {
	const fullpath = path.join(cwd, element, 'package.json');
	if (fs.existsSync(fullpath)) {
		yarnInstall(path.join(cwd, element));
	}
}

const sourceSpyPath = path.join(cwd, 'node_modules', 'spyxcomponent');
const destinationSpypath = path.join(cwd, 'extension', 'spyxcomponent');
fs_extra.copy(sourceSpyPath, destinationSpypath, (err) => {
	if (err) {
		return console.error(err);
	}
});