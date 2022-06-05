
const commands = require("./commands/commands.js");
const quote = require("./commands/quote.js");
const gif = require("./commands/gif.js");
const valorant = require("./commands/valorant.js");


const commands_set = {
    commands,
    quote,
    gif,
    valorant
};


module.exports = async function bot_message(msg) {
    if (msg.author.bot) return;
    // Only use bot in specific channel && using '!'
    if (msg.channelId == process.env.CHANNELID) {
        // Extracts the message and returns the command
        let tokens = msg.content.split(" ");
        let command = tokens.shift();
        if (command.startsWith('!')) {
            command = command.substring(1);
            try {
                commands_set[command](msg);
            }
            catch {
                const error_msg = 'Command does not exist'
                msg.reply({
                    content: error_msg
                })
            }
                
        } else if (msg.content === 'fuck you piwi') {
            msg.reply({
                content: 'piwi says fuck you too',
            })
        } else {
            const yiwei = Math.random();
            const yiweiThresh = 0.069;
            if (yiwei < yiweiThresh) {
                commands_set.quote(msg);
            }
        }
    }
}