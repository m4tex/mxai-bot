const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mxai-bot');

const chatSessionSchema = new mongoose.Schema({ userId: String, tokenLimit: Number });
const Chats = new mongoose.model('Chats', chatSessionSchema);

module.exports = {
    Chats: Chats
}