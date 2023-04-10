const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const { get_stack_questions } = require('./stack_overflow');

dotenv.config();

const token = process.env.TELEGRAM_API_TOKEN;

const bot = new TelegramBot(token, { polling: true });

// listen to incoming messages
bot.on('message', async (msg) => {
    console.log(msg);
    const chatId = msg.chat.id;
    console.log(chatId);
    const res = await get_stack_questions();
    let questions = '';
    for(let i = 0; i < res.items.length && questions.length < 3500; i++) {
        questions += `${i + 1}. ${res.items[i].title}\nLink: ${res.items[i].link}\n\n`;
    }
    bot.sendMessage(chatId, questions);
});

const send_message = async (chat_id, message) => {
    const res = await get_stack_questions();
    let questions = '';
    for(let i = 0; i < res.items.length && questions.length < 3500; i++) {
        questions += `${i + 1}. ${res.items[i].title}\nLink: ${res.items[i].link}\n\n`;
    }
    // console.log(res);
    if(questions)
        bot.sendMessage(-994700852, questions);
}

send_message();


//bot.sendMessage(-994700852, "We learn from mistakes https://www.pubcm.com");



