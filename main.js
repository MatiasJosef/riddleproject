const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
let configuration = require('./config.json');

global.config = configuration.ELEGANT_SERVER;
global.prefix = configuration.prefix;

const express = require('express');
const keepalive = require('express-glitch-keepalive');
const app = express();
app.use(keepalive);
app.get('/', (req, res) => {
    res.json('[✓] Бот запущен');
});
app.get("/", (request, response) => {
    response.sendStatus(200);
});
app.listen(process.env.PORT);

require("./functions")(bot);

module.exports = {
    bot: bot
};

bot.login(config.token);