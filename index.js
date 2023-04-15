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
  // console.log(`Your cron function "${context.functionName}" ran at ${time}`);

  let latest_id = 0;
  let configs = await Config.find({});
  if (configs.length > 0) {
    latest_id = configs[0].last_stack_overflow_id;
  }

  const res = await get_stack_questions(latest_id);
  let questions = '';
  let counted_questions = 0;
  let last_id = 0;
  if (res.items.length == 0) {
    console.log("No new questions");
    return;
  }

  if (res.items.length) {
    const new_lastest_item = res.items[res.items.length - 1].question_id;
    await update_latest_id(new_lastest_item);
  }

  //Get all chats 
  const chats = await Chat.find({ status: "active" }).exec();
  chats.map(async chat => {
    console.log(`Sending to chat ${chat.tg_chat_name} (${chat.tg_chat_id})`)
    const chat_id = chat.tg_chat_id;
    if(chat_id == 2138899262 || chat_id == -994700852){
      console.log("It's eliel");
    }else{
      console.log("Not eliel");
      return;
    }
    for (let i = 0; i < res.items.length; i++) {
      const question_id = res.items[i].question_id;
      console.log(`Question id: ${question_id} (latest id: ${latest_id})`);
      if (res.items[i].question_id > latest_id) {
        const by = res.items[i].owner.display_name;
        const link = res.items[i].link;
        const title = res.items[i].title;
        const body = `\n\n${title}\n\nLink: ${link}\n\n#${question_id}\n\n`;
        send_telegram_message(chat_id, body);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

  });
};

const update_latest_id = async (last_id) => {
  let configs = await Config.find({});
  if (configs.length == 0) {
    const config = new Config({
      last_stack_overflow_id: last_id,
      last_telegram_message_id: 0,
    });
    await config.save();
  } else {
    let config = configs[0];
    // if (config.last_stack_overflow_id != last_id) {
    config.last_stack_overflow_id = last_id;
    const ress_ = await config.save();
    console.log("Updated ", ress_);
    // }
  }
}


