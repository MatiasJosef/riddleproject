const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json');

const express = require("express");
const app = express();

app.get('/', (req, res) => {
    res.json('[✓] Бот запущен');
});

app.get("/", (request, response) => {
    response.sendStatus(200);
});

app.listen(process.env.PORT);

function checkUserApplication(message) {
    let accepted = true;

    const form = ["1) Ваш игровой ник:", "2) Ваша фракция:", "3) Если вы занимаете руководящую должность укажите:"];

    if (!form.every(e => message.content.includes(e))) {
        responseMessage(message, new Discord.MessageEmbed()
            .setColor(0xe53935)
            .setDescription(`[Заявление](${message.url}) строго должно соответствовать формуляру:
                    \`\`\`${form.join("\n")}\`\`\`
                        Пожалуйста, подайте заявление на верификацию повторно.`));

        accepted = false;
    }

    return accepted;
}

function responseMessage(message, embed) {
    try {
        message.author.send(embed);
    } catch {
        message.channel.send(message.author, embed);
    }
}

bot.on("message", async (message) => {
    if (!message) return;

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    if (message.channel.id === config.verificationChannel) {
        if (!checkUserApplication(message)) return message.delete();

        await message.react("✅");
        await message.react("❎");
    }
});

bot.on("guildMemberAdd", async (member) => {
    if (!member) return;

    await member.setNickname("#new-user");
    await member.roles.add(config.addRoles);
});

bot.on("ready", () => {
    bot.user.setStatus("idle");
    bot.user.setActivity("за ElegantProject", { type: "WATCHING" });

    bot.generateInvite(["ADMINISTRATOR"]).then(link => {
        console.log(link);
    });

    console.log(`[✓] ${bot.user.username} авторизован`);
});

bot.on("messageReactionAdd", async (messageReaction, user) => {
    if (!messageReaction || !user) return;
    if (user.id === bot.user.id) return;

    if (messageReaction.message.guild.member(user).hasPermission("MANAGE_NICKNAMES")) {
        switch (messageReaction.emoji.name) {
            case "✅": {
                const messageContent = messageReaction.message.content;

                if (!checkUserApplication(messageReaction.message)) return;

                const nickname = messageContent
                    .split(":")[1]
                    .split("2")[0]
                    .replace(/[_]/g, " ")
                    .trim();

                if (!nickname || nickname.length === 0) return messageReaction.message.channel.send(user, new Discord.MessageEmbed()
                    .setColor(0xe53935)
                    .setDescription(`Пользователю ${messageReaction.message.author} не удалось изменить никнейм (скорее всего, неправильно заполнен формуляр)`));

                try {
                    await messageReaction.message.member.setNickname(nickname);
                } catch (error) {
                    if (error.message === "Missing Permissions") {
                        return messageReaction.message.channel.send(user, new Discord.MessageEmbed()
                            .setColor(0xe53935)
                            .setDescription(`У бота недостаточно прав для изменения никнейма пользователя ${messageReaction.message.author}`));
                    }
                }

                await responseMessage(messageReaction.message, new Discord.MessageEmbed()
                    .setColor(0x43a047)
                    .setDescription(`Ваше [заявление](${messageReaction.message.url}) на изменение никнейма было одобрено модератором ${user}`));
                break;
            }
            case "❎": {
                await responseMessage(messageReaction.message, new Discord.MessageEmbed()
                    .setColor(0xe53935)
                    .setDescription(`Ваше [заявление](${messageReaction.message.url}) на изменение никнейма было отклонено модератором ${user}`));

                await checkUserApplication(messageReaction.message);
                break;
            }
            default: {
                break;
            };
        }
    }
});

bot.login(config.token);