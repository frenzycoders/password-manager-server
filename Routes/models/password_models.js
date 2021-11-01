const mongoose = require('mongoose');

const PasswordManagerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    key: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    },
    passwords: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "PasswordModel"
    }],
    files:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"FileModel"
    }]
})


const PasswordManager = mongoose.model('PasswordManager', PasswordManagerSchema);

module.exports = {
    PasswordManager
}