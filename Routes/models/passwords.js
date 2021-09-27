const mongoose = require('mongoose');
const PasswordSchema = new mongoose.Schema({
    id: {
        type: String
    },
    title: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    important: {
        type: Boolean
    },
    click: {
        type: String
    },
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    },
})

const PasswordModel = mongoose.model('PasswordModel',PasswordSchema);

module.exports = {
    PasswordModel
}