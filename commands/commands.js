const command_list = 
"Hi and welcome to Piwi's 69 Bot!\n\
Here are the currently available commands:\n\
!quote: randomly generates a Yiwei quote for your entertainment\n\
!gif: randomly generates a gif of whatever you specify\n"


module.exports = async function (msg) {
    if (msg.content.split(" ").length == 1) {
        msg.reply({
            content: command_list
        })
    } else {
        msg.reply({
            content: 'Incorrect command'
        })
    }
}