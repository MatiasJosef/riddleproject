const Discord = require('discord.js');
const {bot} = require('../main');

bot.on('guildMemberAdd', async member => {

    await member.setNickname('#new-user');
    await member.roles.add(config.addRoles);

});