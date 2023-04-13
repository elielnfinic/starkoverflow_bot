const dotenv = require('dotenv');

const TelegramBot = require('node-telegram-bot-api');

dotenv.config();
const token = process.env.TELEGRAM_API_TOKEN;
const bot = new TelegramBot(token, { polling: true });

exports.send_telegram_message = async (chat_id, message) => {
    bot.sendMessage(chat_id, message);
}

const bot_user_name = "StarkOverflow_bot";

function getLinkNumberID(text) {
    const regex = /.*Link:.*\n\n#(\d*)$/;
    const match = text.match(regex);
    if (match) {
        return parseInt(match[1]);
    } else {
        return null;
    }
}


exports.listen_telegram_messages = async () => {
    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        //if mentionned
        if (msg.chat.type === 'group') {
            console.log('group');
            console.log(msg);
            const is_reply_to_me = msg.reply_to_message && msg.reply_to_message.from.username === bot_user_name;
            if (is_reply_to_me) {
                console.log('reply to me');
                const replying_to_message = msg.reply_to_message.text;
                console.log(replying_to_message);
                const question_id = getLinkNumberID(replying_to_message);
                console.log(`The question id is ${question_id}`);
                if (question_id) {
                    const answer = msg.text;
                    const resp = await this.post_answer_to_stackoverflow(question_id, answer);
                    if(resp && resp.error){
                        bot.sendMessage(chatId, 'Error posting to StackOverflow.\nPlease try again later.\n\n' + resp.message);
                        return;
                    }else if(resp && resp.success){
                        bot.sendMessage(chatId, 'Posted your answer to StackOverflow.');
                        return;
                    }
                    //bot.sendMessage(chatId, 'Received your answer to the question. I will post it to StackOverflow soon.\n\nYour message:\n\n' + answer);
                } else {
                    bot.sendMessage(chatId, 'Your response should be a reply to a question message');
                }
            }
        } else {
            let reply_msg = `Hi ${msg.from.first_name}!\nThanks for reaching out to me. I am a bot and I am customized for Starknet Core Group.\nIf you would like to use me in your the future, please let me know.`;
            bot.sendMessage(chatId, reply_msg);
        }
    });
}

exports.post_answer_to_stackoverflow = async (question_id, answer) => {
    try {
        const axios = require('axios');
        const FormData = require('form-data');
        var data = new FormData();
        data.append('site', 'stackoverflow');
        data.append('body', answer);
        data.append('access_token', process.env.STACKOVERFLOW_TOKEN);
        data.append('key', process.env.STACKOVERFLOW_KEY);

        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://api.stackexchange.com/2.3/questions/${question_id}/answers/add`,
            data: data
        };

        const resp = await axios(config);
        console.log(resp.data);
        return {
            error : false,
            success : true,
            message : 'success'
        };
    } catch (err) {
        console.log(err.response.data);
        return {
            error : true,
            success : false,
            message : err.response.data.error_message
        };
    }
}