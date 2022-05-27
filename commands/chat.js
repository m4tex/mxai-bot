const { MessageEmbed } = require('discord.js');
const { Chats } = require('../modules/databaseModule');

module.exports = {
    name: 'chat',
    description: 'Toggles chat mode on or off.',
    usage:'prefix chat tokenLimit (max 1000). Example: mxa chat 200',
    execute: async function(msg, tokens){
        let session = await Chats.findOne({ userId: msg.author.id }).lean();
        if (session){
            await Chats.deleteOne({ userId: msg.author.id });
        } else {
            await Chats.create({ userId: msg.author.id, tokenLimit: parseInt(tokens[0]) | 200 });
        }
        const embed = new MessageEmbed().setTitle('Chat Mode ⭐').setDescription(`Chat mode with ${msg.author.username} is now ${session ? 'off.' : `on. (${parseInt(tokens[0]) | 200 } tokens)` }`);
        msg.channel.send({ embeds: [embed] });
    }
}