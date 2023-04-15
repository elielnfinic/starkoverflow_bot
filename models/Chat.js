const mongoose = require("mongoose");

const {ObjectId} = mongoose.Schema;

const Chat = new mongoose.Schema({
    tg_chat_id : {
        type: Number,
    },
    tg_chat_name : {
        type: String,
    },
    tg_chat_type : {
        type: String,
    },
    tg_chat_obj : {
        type: Object,
    },
    status : {
        type: String,
        default: "active"
    },
    last_question_id : {
        type: Number,
        default: 0
    },
}, {timestamps: true});

module.exports = mongoose.model("Chat", Chat);