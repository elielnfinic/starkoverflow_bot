const TelegramBot = require('node-telegram-bot-api');
const { get_stack_questions } = require('./stack_overflow');
const mongoose = require("mongoose");
const Config = require('./models/Config');
const dotenv = require('dotenv');
const { send_telegram_message } = require('./telegram');
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser : true}).then(() => console.log("DB Connected"));

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

  console.log(`Latest id: ${latest_id}`);

  const res = await get_stack_questions(latest_id);
  let questions = '';
  let counted_questions = 0;
  let last_id = 0;
  if(res.items.length == 0) {
    console.log("No new questions");
    return;
  }

  // for (let i = 0; i < res.items.length && questions.length < 4000 && i < 5; i++) {
  //   const by = res.items[i].owner.display_name;
  //   const question_id = res.items[i].question_id;
  //   const link = res.items[i].link;
  //   const title = res.items[i].title;
    
  //   if(question_id <= latest_id) {
  //     continue;
  //   }else{
  //     console.log(`Question id: ${question_id} <= ${latest_id}`);
  //     // 72239816 < 72321871 < 72512724
  //   }

  //   questions += `${i + 1}. ${res.items[i].title}\nLink: ${res.items[i].link}\n\n`;
  //   counted_questions++;
  //   last_id = question_id;// > last_id ? question_id : last_id; 
  // }

  for(let i = 0; i < res.items.length; i++) {
    const by = res.items[i].owner.display_name;
    const question_id = res.items[i].question_id;
    const link = res.items[i].link;
    const title = res.items[i].title;
    const body = `\n\n${res.items[i].title}\n\nLink: ${res.items[i].link}\n\n#${question_id}\n\n`;
    send_telegram_message(process.env.TELEGRAM_GROUP_ID, body);
  }



  //let configs = await Config.find({});
  // console.log(questions);
  // if (configs.length == 0) {
  //   const config = new Config({
  //     last_stack_overflow_id: last_id,
  //     last_telegram_message_id: 0,
  //   });
  //   await config.save();
  // } else {
  //   let config = configs[0];
  //   // if (config.last_stack_overflow_id != last_id) {
  //     config.last_stack_overflow_id = last_id;
  //     const ress_ = await config.save();
  //     console.log("Updated ",ress_);
  //   // }
  // }  

  // if(questions){
  //   questions = `${counted_questions} new questions on Stack Overflow \n\n${questions}`;
  //   send_telegram_message(process.env.TELEGRAM_GROUP_ID, questions);
  // }
  
  //console.log(questions);
};



