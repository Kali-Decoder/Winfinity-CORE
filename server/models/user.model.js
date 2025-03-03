const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    wallet_address: {
        type: String,
        required: true,
    },
    total_deposit: {
        type: Number,
        default: 0,
    },
    total_staked: {
        type: Number,
        default: 0,
    },
    total_rewards_earned: {
        type: Number,
        default: 0,
    },
});

const User = mongoose.model('USER', userSchema);
module.exports=User
