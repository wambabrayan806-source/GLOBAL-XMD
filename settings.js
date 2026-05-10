const fs = require('fs');
const chalk = require('chalk');

/*
	* 👑 KING-DYLAN-MD 👑
	* Propriété de : King Dylan
	* Contact : +237674073940
*/

//~~~~~~~~~~~~< GLOBAL SETTINGS >~~~~~~~~~~~~\\

// Ton numéro en tant que propriétaire principal
global.owner = process.env.OWNER_NUMBER ? process.env.OWNER_NUMBER.split(',').map(v => v.trim()) : ['237674073940'];

global.packname = process.env.PACKNAME || 'KING-DYLAN-MD';
global.author = process.env.AUTHOR || 'King Dylan';
global.botname = process.env.BOT_NAME || 'KING-DYLAN-MD';
global.listprefix = process.env.PREFIX ? process.env.PREFIX.split(',') : ['.','!','/'];
global.listv = ['•','●','■','✿','▲','➩','➢','➣','➤','✦','✧','△','❀','○','□','♤','♡','◇','♧','々','〆'];

global.tempatDB = process.env.MONGODB_URI || 'database.json';
global.tempatStore = process.env.MONGODB_URI || 'baileys_store.json';
global.timezone = process.env.TIME_ZONE || 'Africa/Douala'; // Fuseau horaire du Cameroun
global.pairing_code = process.env.PAIRING_CODE !== 'false';
global.number_bot = process.env.BOT_NUMBER || '237674073940';

global.my = {
	yt: process.env.MY_YOUTUBE || '#',
	gh: process.env.MY_GITHUB || 'https://github.com/wambabrayan806-source',
	gc: process.env.MY_GROUP || 'https://chat.whatsapp.com/votre-lien-ici',
	ch: process.env.MY_CHANNEL || '120363319098372999@newsletter'
}
global.limit = {
	free: 100,
	premium: 999,
	vip: 9999
}
global.money = {
	free: 10000,
	premium: 1000000,
	vip: 10000000
}
global.fake = {
	anonim: 'https://telegra.ph/file/95670d63378f7f4210f03.png',
	thumbnailUrl: 'https://telegra.ph/file/fe4843a1261fc414542c4.jpg',
	thumbnail: fs.existsSync('./src/media/global.png') ? fs.readFileSync('./src/media/global.png') : '',
	docs: fs.existsSync('./src/media/fake.pdf') ? fs.readFileSync('./src/media/fake.pdf') : '',
	listfakedocs: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/pdf'],
}
global.mess = {
    key: 'Clé API expirée.',
    owner: '*Cette commande est réservée à King Dylan !*',
    admin: '*Cette commande est pour les admins du groupe !*',
    botAdmin: '*Le bot doit être admin pour faire ça !*',
    group: '*Utilise ça dans un groupe !*',
    private: '*Utilise ça en chat privé !*',
    limit: '*Tu as épuisé tes limites quotidiennes !*',
    prem: '*Utilisateurs Premium uniquement !*',
    wait: '*King Dylan traite votre demande...*',
    error: '*Une erreur est survenue !*',
    done: '*Terminé ✅*'
}
global.APIs = {
	hitori: 'https://api.hitori.pw',
}
global.APIKeys = {
	'https://api.hitori.pw': 'htrkey-77eb83c0eeb39d40',
	geminiApikey: ['AIzaSyD0lkGz6ZhKi_MHSSmJcCX3wXoDZhELPaQ']
}
global.badWords = ['insulte1','insulte2'] // À remplir selon tes envies
global.chatLength = 1000

//~~~~~~~~~~~~~~~< PROCESS >~~~~~~~~~~~~~~~\\

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Mise à jour de ${__filename}`))
	delete require.cache[file]
	require(file)
});
