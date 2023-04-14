const { run } = require(".");

const axios = require('axios');
const { listen_telegram_messages } = require('./telegram');

run();
listen_telegram_messages();

/*
//Chat created 

{
  message_id: 255,
  from: {
    id: 2138899262,
    is_bot: false,
    first_name: 'El',
    username: 'elielmathe',
    language_code: 'en'
  },
  chat: {
    id: -918292882,
    title: 'Testing 2',
    type: 'group',
    all_members_are_administrators: true
  },
  date: 1681477066,
  group_chat_created: true
}


*/

// left group 
/*
{
  message_id: 256,
  from: {
    id: 2138899262,
    is_bot: false,
    first_name: 'El',
    username: 'elielmathe',
    language_code: 'en'
  },
  chat: {
    id: -918292882,
    title: 'Testing 2',
    type: 'group',
    all_members_are_administrators: true
  },
  date: 1681477207,
  left_chat_participant: {
    id: 5848952615,
    is_bot: true,
    first_name: 'Starkoverflow',
    username: 'StarkOverflow_bot'
  },
  left_chat_member: {
    id: 5848952615,
    is_bot: true,
    first_name: 'Starkoverflow',
    username: 'StarkOverflow_bot'
  }
}
*/

//add member
/*
{
    message_id: 257,
    from: {
      id: 2138899262,
      is_bot: false,
      first_name: 'El',
      username: 'elielmathe',
      language_code: 'en'
    },
    chat: {
      id: -918292882,
      title: 'Testing 2',
      type: 'group',
      all_members_are_administrators: true
    },
    date: 1681477277,
    new_chat_participant: {
      id: 5848952615,
      is_bot: true,
      first_name: 'Starkoverflow',
      username: 'StarkOverflow_bot'
    },
    new_chat_member: {
      id: 5848952615,
      is_bot: true,
      first_name: 'Starkoverflow',
      username: 'StarkOverflow_bot'
    },
    new_chat_members: [
      {
        id: 5848952615,
        is_bot: true,
        first_name: 'Starkoverflow',
        username: 'StarkOverflow_bot'
      }
    ]
  }

*/