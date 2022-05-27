//#region Imports and Node modules implementation
const config = require('./config.json');

//Discord module implementation
const discordBot = require('./modules/discordClient');
//Database module implementation
const {Chats} = require('./modules/databaseModule');
//OpenAI API implementation
const {Configuration, OpenAIApi} = require('openai');
const configuration = new Configuration({
    apiKey: config.openAIApiKey,
});
const openai = new OpenAIApi(configuration);

//#endregion

//Here begins the actual code
discordBot.on('messageCreate', async function (msg) {
    //Checks for command
    let tokens = msg.content.toLowerCase().split(/ +/);
    if (tokens.shift() === 'mxa') {
        let command = tokens.shift();
        let dcCommand = discordBot.commands.get(command);
        if (dcCommand !== undefined) {
            //This abomination takes care of permission restrictions for admin or dev commands. undefined = no permission requirements, 1 = for admins or above, 2 = for devs
            if (!dcCommand.hasOwnProperty('permLevel') || (dcCommand.permLevel === 1 && msg.member.permissions.has('ADMINISTRATOR') ||
                (dcCommand.permLevel === 1 && msg.author.id === config.devDiscordId) || (dcCommand.permLevel === 2 && msg.author.id === config.devDiscordId))) {
                dcCommand.execute(msg, tokens);
            } else {
                msg.channel.send('You don\'t have permissions to execute that command.');
            }
        } else {
            msg.channel.send("This command doesn't exist. Check out `mxa help` to see a full list of the commands.")
        }
    } else {
        let session = await Chats.findOne({userId: msg.author.id}).lean();
        if (session) {
            const completion = await openai.createCompletion('text-davinci-002', {
                prompt: msg.content,
                max_tokens: session.tokenLimit,
            }).catch(err => console.log(err));
            msg.channel.send(completion.data.choices[0].text.substring(0, 2000));
        }
    }
})