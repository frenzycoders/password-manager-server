const mongoose = require('mongoose');
const FilesModelSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    filePath: {
        type: String,
    },
    fileType: {
        type: String
    },
    uploadedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PasswordManager",
    },
    uId: {
        type: String,
        required: true,
    },
    linkCode: {
        type: String,
    },
    fileSize: {
        type: String,
    }
}, {
    timestamps: true
});

const FileModel = mongoose.model("FileModel", FilesModelSchema);

module.exports = {
    FileModel
}