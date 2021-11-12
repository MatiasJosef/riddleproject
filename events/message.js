const Discord = require('discord.js');
const {bot} = require('../main');

bot.on('message', async message => {

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    let cmd = bot.commands.get(command);
    if (cmd) cmd.run(bot, message, args);

});

bot.on('message', async message => {

        if (message.channel.id !== config.verificationChannel || message.author.id === bot.user.id || message.member.hasPermission('MANAGE_NICKNAMES')) return;

        await message.react('✅').then(message.react('❎'));

        const filter = (reaction, user) => {
            return ['✅', '❎'].includes(reaction.emoji.name) && message.channel.id === config.verificationChannel && user.id !== bot.user.id;
        };

        const collector = new Discord.ReactionCollector(message, filter);
        collector.on('collect', async (reaction, user) => {

            if (!message.guild.member(user).hasPermission('MANAGE_NICKNAMES')) {
                return reaction.users.remove(user);
            }

            switch (reaction.emoji.name) {
                case '✅': {
                    const embed = new Discord.MessageEmbed()
                        .setColor(0x43a047)
                        .setDescription(`Ваше [заявление](${message.url}) на изменение никнейма было одобрено модератором ${user}`);
                    try {
                        await message.member.send(embed);
                    } catch (err) {
                        await message.channel.send(message.author, embed);
                    }
                    let nickBuffer = reaction.message.content;
                    if (nickBuffer.indexOf('Ваш игровой ник:') !== -1) { // содержит формуляр
                        nickBuffer = nickBuffer.split('2')[0];
                        nickBuffer = nickBuffer.split(':')[1];
                        nickBuffer = nickBuffer.replace(/[_]/g, ' ');
                        await message.member.setNickname(`${nickBuffer}`);
                    } else if (nickBuffer.indexOf('Ваш игровой ник:') === -1) { // не содержит формуляр
                        nickBuffer = nickBuffer.split('2')[0];
                        nickBuffer = nickBuffer.split('1)')[1];
                        nickBuffer = nickBuffer.replace(/[_]/g, ' ');
                        await message.member.setNickname(`${nickBuffer}`);
                    }
                    break;
                }
                case '❎': {
                    const embed = new Discord.MessageEmbed()
                        .setColor(0xe53935)
                        .setDescription(`Ваше [заявление](${message.url}) на изменение никнейма было отклонено модератором ${user}`);
                    try {
                        await message.member.send(embed);
                    } catch (err) {
                        await message.channel.send(message.author, embed);
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        });
});