const path = require('path');
const chalk = require('chalk');
const { spawn } = require('child_process');

/*
    * 👑 KING-DYLAN-MD 👑
    * Système de surveillance automatique
    * Propriété de King Dylan (+237674073940)
*/

function start() {
	console.log(chalk.cyan.bold('\n[KING-DYLAN-MD] Initialisation du système...'));
	
	let args = [path.join(__dirname, 'index.js'), ...process.argv.slice(2)]
	let p = spawn(process.argv[0], args, {
		stdio: ['inherit', 'inherit', 'inherit', 'ipc']
	}).on('message', data => {
		if (data === 'reset') {
			console.log(chalk.yellow.bold('[SYSTÈME] Redémarrage de King Dylan en cours...'))
			p.kill()
			start()
			delete p
		} else if (data === 'uptime') {
			p.send(process.uptime())
		}
	}).on('exit', code => {
		if (code !== 0) {
			console.error(chalk.red.bold(`[ERREUR] King Dylan s'est arrêté (Code: ${code}). Relance automatique...`))
			start()
		} else {
			console.log(chalk.green.bold('[SYSTÈME] King Dylan s\'est éteint proprement. À bientôt !'))
			process.exit(0)
		}
	})
}

start()
