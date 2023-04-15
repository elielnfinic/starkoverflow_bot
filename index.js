const TelegramBot = require('node-telegram-bot-api');
const { get_stack_questions } = require('./stack_overflow');
const mongoose = require("mongoose");
const Config = require('./models/Config');
const dotenv = require('dotenv');
// const { send_telegram_message } = require('./telegram');
const Chat = require('./models/Chat');
dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }).then(() => console.log("DB Connected"));

mongoose.connection.on("error", err => {
  console.log(`DB connection error: ${err.message}`);
});

module.exports.run = async (event, context, bot) => {
  const time = new Date();

  const res = await get_stack_questions();
  const chats = await Chat.find({ status: "active" }).exec();
  //console.log("The chats are ", chats);

  console.log(`The are ${chats.length} chats`);
  //chats.map(async chat => {
  for (let i = 0; i < chats.length; i++) {
    try {
      const chat = chats[i];
      console.log(`Chat ${i} is ${chat.tg_chat_name} (${chat.tg_chat_id})`);
      const chat_id = chat.tg_chat_id;
      const latest_question_id = chat.last_question_id ? chat.last_question_id : 0;

      if (process.env.ENV && process.env.ENV === "dev") {
        if (chat_id == process.env.MY_TESTING_TG_CONVERSATION || chat_id == process.env.MY_TESTING_TG_GROUP_CONVERSATION) {
          console.log("It's eliel");
        } else {
          console.log("Not eliel");
          continue;
        }
      }

      let new_latest_question_id = 0;
      console.log(`Number of questions ${res.items.length}`);
      for (let i = 0; i < res.items.length; i++) {
        console.log(`Looping at ${i} with question_id ${res.items[i].question_id}`);
        const question_id = res.items[i].question_id;
        if (question_id > latest_question_id) {
          console.log("To send " + question_id + " to " + chat_id);
          const by = res.items[i].owner.display_name;
          const link = res.items[i].link;
          const title = res.items[i].title;
          const body = `\n\n${title}\n\nLink: ${link}\n\n#${question_id}\n\n`;
          //send_telegram_message(chat_id, body);
          console.log("Using bot ");
          const tg_res = await bot.sendMessage(chat_id, body);
          console.log("Result", tg_res);
          if (tg_res && tg_res.message_id) {
            new_latest_question_id = question_id;
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      if (new_latest_question_id > 0) {
        chat.last_question_id = new_latest_question_id;
        const res_save = await chat.save();
        console.log(res_save);
      }
    } catch (err) {
      console.log("Error looping chats ", err);
    }
  }

  console.log("Ended looping");

};



