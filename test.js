const { run } = require(".");

const axios = require('axios');
const { listen_telegram_messages } = require('./telegram');

//run();
listen_telegram_messages();

