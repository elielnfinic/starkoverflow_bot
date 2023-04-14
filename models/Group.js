const mongoose = require("mongoose");

const {ObjectId} = mongoose.Schema;

const Group = new mongoose.Schema({
    tg_group_id : {
        type: Number,
    },
    tg_group_name : {
        type: String,
    },
    tg_group_link : {
        type: String,
    },
    tg_group_object : {
        type: Object,
    }
}, {timestamps: true});

module.exports = mongoose.model("Group", Group);