const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const yarn = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';

function yarnInstall(location) {
	console.log("Installing at ", location, "...");
	const result = cp.spawnSync(yarn, ['install', '--check-files'], {
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