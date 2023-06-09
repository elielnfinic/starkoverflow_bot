const dotenv = require('dotenv');

const Chat = require('./models/Chat');

dotenv.config();

const bot_user_name = "StarkOverflow_bot";

function getLinkNumberID(text) {
    const regex = /.*Link:.*\n\n.*#(\d*)$/;
    const match = text.match(regex);
    if (match) {
        return parseInt(match[1]);
    } else {
        return null;
    }
}


exports.listen_telegram_messages = async (bot) => {
    console.log("LISTENNING TO MESSAGES");
    bot.on('message', async (msg) => {
        console.log("Got message");
        const chat_id = msg.chat.id;
        const chats = await Chat.find({ tg_chat_id: chat_id }).exec();
        let was_first_time = 0;
        if (chats.length == 0) {
            was_first_time = 1;
            let first_name = "", last_name = "";
            let chat_name = "";
            if(msg.chat.type === "private") {
                first_name = msg.chat.first_name ? msg.chat.first_name : "";
                last_name = msg.chat.last_name ? msg.chat.last_name : "";
                chat_name = first_name + " " + last_name;
            }
            const chat = new Chat({
                tg_chat_id: chat_id,
                tg_chat_name: msg.chat.type === "group" ? msg.chat.title : chat_name,
                tg_chat_obj: msg.chat,
                tg_chat_type: msg.chat.type,
                status : "active"
            });

            await chat.save();
            if (msg.chat.type === "group") {
                bot.sendMessage(chat_id, "Thank you for adding me to the group.\n\nYou will be receiving questions from StackOverflow about \"starknet\" and \"cairo\".");
            } else if (msg.chat.type === "private") {
                bot.sendMessage(chat_id, "Thank you writing to me.\n\nYou will be receiving questions from StackOverflow about \"starknet\" and \"cairo\".");
            }
        }

        const chatId = msg.chat.id;
        console.log("The chat ID", chatId);

        const is_reply_to_me = msg.reply_to_message && msg.reply_to_message.from.username === bot_user_name;
        if (is_reply_to_me) {
            const replying_to_message = msg.reply_to_message.text;
            const question_id = getLinkNumberID(replying_to_message);
            if (question_id) {
                if (chatId != process.env.TELEGRAM_GROUP_ID) {
                    bot.sendMessage(chatId, 'Sorry, I can only accept incoming messages from Starknet Cairo Core group.');
                    return;
                }
                const answer = msg.text;
                const resp = await this.post_answer_to_stackoverflow(question_id, answer);
                if (resp && resp.error) {
                    bot.sendMessage(chatId, 'Error posting to StackOverflow.\n\n' + resp.message);
                    return;
                } else if (resp && resp.success) {
                    bot.sendMessage(chatId, 'Posted your answer to StackOverflow.');
                    return;
                }
            } else {
                bot.sendMessage(chatId, 'Your response should be a reply to a Starkoverflow question message.');
            }
        } else {
            console.log("Not a reply to me");
            //if (!was_first_time) bot.sendMessage(chatId, "Sorry, I can only accept incoming messages that are replies to Stackoverflow questions that I sent to you.");
            return;
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
            error: false,
            success: true,
            message: 'success'
        };
    } catch (err) {
        console.log(err.response.data);
        return {
            error: true,
            success: false,
            message: err.response.data.error_message
        };
    }
}