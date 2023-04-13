const mongoose = require("mongoose");

const {ObjectId} = mongoose.Schema;

const Config = new mongoose.Schema({
    last_stack_overflow_id : {
        type: Number,
    },
    last_telegram_message_id : {
        type: Number,
    },
}, {timestamps: true});

module.exports = mongoose.model("Config", Config);