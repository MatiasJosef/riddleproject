const Discord = require('discord.js');
const { bot } = require('../main');

bot.on('ready', () => {

    console.log(`[✓] ${bot.user.username} авторизован`);
    bot.user.setStatus('idle');
    bot.user.setActivity('за сервером Sandare RP', { type: 'WATCHING' });
    bot.generateInvite(["ADMINISTRATOR"]).then(link => {
        console.log(link);
    });

});