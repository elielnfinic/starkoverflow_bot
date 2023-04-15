const { run } = require(".");
const dotenv = require('dotenv');
const axios = require('axios');
const { listen_telegram_messages } = require('./telegram');
const TelegramBot = require("node-telegram-bot-api");

dotenv.config();

const token = process.env.TELEGRAM_API_TOKEN;
let bot = new TelegramBot(token,{polling: true});

const LOOPING_INTERVAL = parseInt(process.env.LOOPING_INTERVAL) || 300000;

setInterval(async () => {
    run(null, null, bot);
}, LOOPING_INTERVAL);
run(null, null, bot);

listen_telegram_messages(bot);

