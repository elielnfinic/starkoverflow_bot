const TelegramBot = require('node-telegram-bot-api');
const { get_stack_questions } = require('./stack_overflow');
const mongoose = require("mongoose");
const Config = require('./models/Config');
const dotenv = require('dotenv');
const { send_telegram_message } = require('./telegram');
const Chat = require('./models/Chat');
dotenv.config();



mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }).then(() => console.log("DB Connected"));

mongoose.connection.on("error", err => {
  console.log(`DB connection error: ${err.message}`);
});

module.exports.run = async (event, context) => {
  const time = new Date();
  const token = process.env.TELEGRAM_API_TOKEN;
  const bot = new TelegramBot(token, { polling: true });

  const res = await get_stack_questions();
  const chats = await Chat.find({ status: "active" }).exec();

  chats.map(async chat => {
    const chat_id = chat.tg_chat_id;
    const latest_question_id = chat.last_question_id ? chat.last_question_id : 0;

    // if(process.env.ENV && process.env.ENV === "dev"){
    //   if(chat_id == 2138899262 || chat_id == -879096220){
    //     console.log("It's eliel");
    //   }else{
    //     console.log("Not eliel");
    //     return;
    //   }
    // }

    let new_latest_question_id = 0;
    for (let i = 0; i < res.items.length; i++) {
      const question_id = res.items[i].question_id;
      if (question_id > latest_question_id) {
        const by = res.items[i].owner.display_name;
        const link = res.items[i].link;
        const title = res.items[i].title;
        const body = `\n\n${title}\n\nLink: ${link}\n\n#${question_id}\n\n`;
        //send_telegram_message(chat_id, body);
        const tg_res = await bot.sendMessage(chat_id, body);
        console.log("Result",tg_res);
        if(tg_res && tg_res.message_id){
          new_latest_question_id = question_id;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    if (new_latest_question_id > 0) {
      chat.last_question_id = new_latest_question_id;
      await chat.save();
    }
  });
};



