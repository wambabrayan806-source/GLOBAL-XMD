/*
	* Create By King Dylan
	* Project: KING-DYLAN-MD
	* Contact: +237674073940
*/

require('dotenv').config();
require('./settings');
const fs = require('fs');
const pino = require('pino');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const readline = require('readline');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const NodeCache = require('node-cache');
const { toBuffer, toDataURL } = require('qrcode');
const { exec, spawn, execSync } = require('child_process');
const { parsePhoneNumber } = require('awesome-phonenumber');
const { default: WAConnection, useMultiFileAuthState, Browsers, DisconnectReason, makeInMemoryStore, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, proto, getAggregateVotesInPollMessage } = require('baileys');

const { dataBase } = require('./src/database');
const { app, server, PORT } = require('./src/server');

// Configuration du couplage (Pairing Code)
const pairingCode = process.argv.includes('--qr') ? false : process.argv.includes('--pairing-code') || global.pairing_code;
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
let pairingStarted = false;
let phoneNumber;

global.fetchApi = async (path = '/', query = {}, options) => {
	const urlnya = (options?.name || options ? ((options?.name || options) in global.APIs ? global.APIs[(options?.name || options)] : (options?.name || options)) : global.APIs['hitori'] ? global.APIs['hitori'] : (options?.name || options)) + path + (query ? '?' + decodeURIComponent(new URLSearchParams(Object.entries({ ...query }))) : '')
	const { data } = await axios.get(urlnya, { ...((options?.name || options) ? {} : { headers: { 'accept': 'application/json', 'x-api-key': global.APIKeys[global.APIs['hitori']]}})})
	return data
}

const storeDB = dataBase(global.tempatStore);
const database = dataBase(global.tempatDB);
const msgRetryCounterCache = new NodeCache();
const groupCache = new NodeCache({ stdTTL: 5 * 60, useClones: false });

server.listen(PORT, () => {
	console.log(chalk.greenBright(`[KING-DYLAN-MD] Serveur lancé sur le port : ${PORT}`));
});

const { GroupParticipantsUpdate, MessagesUpsert, Solving } = require('./src/message');
const { isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, sleep } = require('./lib/function');

async function startKingDylanBot() {
	// Dossier de session personnalisé
	const { state, saveCreds } = await useMultiFileAuthState('dylan_session');
	const { version, isLatest } = await fetchLatestBaileysVersion();
	const level = pino({ level: 'silent' });
	
	try {
		const loadData = await database.read()
		const storeLoadData = await storeDB.read()
		if (!loadData || Object.keys(loadData).length === 0) {
			global.db = {
				hit: {}, set: {}, list: {}, store: {}, users: {}, game: {}, groups: {}, database: {},
				premium: [], sewa: [], ...(loadData || {}),
			}
			await database.write(global.db)
		} else {
			global.db = loadData
		}
		if (!storeLoadData || Object.keys(storeLoadData).length === 0) {
			global.store = {
				contacts: {}, presences: {}, messages: {}, groupMetadata: {}, ...(storeLoadData || {}),
			}
			await storeDB.write(global.store)
		} else {
			global.store = storeLoadData
		}
		
		setInterval(async () => {
			if (global.db) await database.write(global.db)
			if (global.store) await storeDB.write(global.store)
		}, 30 * 1000)
	} catch (e) {
		console.log(e)
		process.exit(1)
	}
	
	store.loadMessage = function (remoteJid, id) {
		const messages = store.messages?.[remoteJid]?.array;
		if (!messages) return null;
		return messages.find(msg => msg?.key?.id === id) || null;
	}
	
	const getMessage = async (key) => {
		if (store) {
			const msg = await store.loadMessage(key.remoteJid, key.id);
			return msg?.message || ''
		}
		return { conversation: 'KING-DYLAN-MD au service du Cameroun !' }
	}
	
	const kingDylan = WAConnection({
		logger: level,
		getMessage,
		syncFullHistory: true,
		maxMsgRetryCount: 15,
		msgRetryCounterCache,
		retryRequestDelayMs: 10,
		defaultQueryTimeoutMs: 0,
		connectTimeoutMs: 60000,
		browser: Browsers.windows('Chrome'),
		generateHighQualityLinkPreview: true,
		cachedGroupMetadata: async (jid) => groupCache.get(jid),
		shouldSyncHistoryMessage: msg => {
			console.log(chalk.cyan(`[Chargement] King Dylan récupère vos chats [${msg.progress || 0}%]`));
			return !!msg.syncType;
		},
		auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, level),
		},
	})
	
	if (pairingCode && !phoneNumber && !kingDylan.authState.creds.registered) {
		async function getPhoneNumber() {
			phoneNumber = global.number_bot ? global.number_bot : process.env.BOT_NUMBER || await question('Entrez votre numéro WhatsApp (ex: 237xxxx) : ');
			phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
			
			if (!parsePhoneNumber('+' + phoneNumber).valid && phoneNumber.length < 6) {
				console.log(chalk.redBright('Numéro invalide ! Exemple : 237674073940'));
				await getPhoneNumber()
			}
		}
		(async () => {
			await getPhoneNumber();
			await exec('rm -rf ./dylan_session/*');
			console.log(chalk.yellow('Numéro capturé. King Dylan se connecte...'))
		})()
	}
	
	await Solving(kingDylan, store)
	
	kingDylan.ev.on('creds.update', saveCreds)
	
	kingDylan.ev.on('connection.update', async (update) => {
		const { qr, connection, lastDisconnect, isNewLogin, receivedPendingNotifications } = update
		if (!kingDylan.authState.creds.registered) console.log(chalk.whiteBright('Statut Connexion: '), chalk.cyan(connection || false));
		
		if ((connection === 'connecting' || !!qr) && pairingCode && phoneNumber && !kingDylan.authState.creds.registered && !pairingStarted) {
			setTimeout(async () => {
				pairingStarted = true;
				console.log(chalk.magenta('Génération du code de jumelage King Dylan...'))
				let code = await kingDylan.requestPairingCode(phoneNumber);
				console.log(chalk.black.bgGreen(` VOTRE CODE : ${code} `));
			}, 3000)
		}

		if (connection === 'close') {
			const reason = new Boom(lastDisconnect?.error)?.output.statusCode
			if (reason !== DisconnectReason.loggedOut) {
				console.log(chalk.red('Connexion perdue. King Dylan redémarre...'));
				startKingDylanBot()
			} else {
				console.log(chalk.bgRed('Session expirée. Veuillez supprimer dylan_session et scanner à nouveau.'));
				exec('rm -rf ./dylan_session/*')
				process.exit(1)
			}
		}
		
		if (connection == 'open') {
			console.log(chalk.greenBright('✅ KING-DYLAN-MD est EN LIGNE !'));
		}

		if (qr && !pairingCode) {
			qrcode.generate(qr, { small: true })
		}
	});

	kingDylan.ev.on('messages.upsert', async (message) => {
		await MessagesUpsert(kingDylan, message, store, groupCache);
	});

	return kingDylan
}

startKingDylanBot()
