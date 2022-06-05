const yiweiQuotes = [
    ' "Why is he playing phoenix if his balls are so tiny?" -Yiwei Shao, 15/08/21', 
    ' "You wanna see a flash? pulls down pants" - Yiwei Shao 28/01/2021',
    ' "Come on kids, hop in the van" -Yiwei Shao, 17/03/22',
    ' "your babies need to knock them up so hard that CPS needs to be called" - Yiwei Shao 6/04/22',
    ' "Come on Kids, Hop in the van!" - Yiwei Shao @ 11.30pm',
    ' "I will embrace the minor if I want to embrace the minor" - Yiwei Shao',
    ' "I will drive truck if no one else will drive and someone has to come with me" - Yiwei Shao 3am',
    ' "If I play Astra again can someone please whack some sense into me” - Yiwei Shao after playing Astra',
    ' "If you ever hear me say “sheesh” i give you permission to slap some sense into me" - Yiwei Shao 11.30pm',
    ' "Im a strong independent woman and I don\'t need no money" - Yiwei Shao',
    ' "[Yuumi] is such a dumb character. Only people with no skills play her." -Yiwei Shao 28/12/2021',
    ' "Living is overrated" - Yiwei Shao 4/04/22',
    ' "I think I have vision loss from the vaccine" - Yiwei Shao, 25/09/21',
    ' "It is OK to hate yourself” - Yiwei Shao 10/05/2022',
    ' "Look, I have long legs, I\'m a white boy, I can run fast, what are you, you\'re a black ma- oh wait" - Yiwei Shao, 29/03/2021',
    ' "He has 81 WAM he can figure it out" - Yiwei Shao 17/09/21',
    ' "I lose nothing from this. Oh wait, you might die" - Yiwei Shao at Jonason, 24/09/21',
    ' "moral of the lesson, rebel OP" -Yiwei Shao 11/12/21',
    ' "All that matters is how many people did you fuck" - Yiwei Shao, 2:54am 22/05/2022',
    ' "Galio doesn\'t need a giant\'s belt. He has his own. His giant schlong is wrapped around his waist" - Yiwei Shao, 3:37 am 22/05/2022',
    ' Starts with s and ends with leep: \n "Sharpie"\n"Oh i thought u said starts with s and ends with eep" - Yiwei Shao'
]

module.exports = async function (msg) {
    let tokens = msg.content.split(" ");
    if (tokens.length == 1) {
        msg.reply({
            content: 'Ask nicely :)'
        })
    } else if (tokens.length == 2 && tokens[1] === 'please') {
        const index = Math.floor(Math.random() * yiweiQuotes.length);
        const yiweiSend = `A random Yiwei quote to brighten your day: \n ${yiweiQuotes[index]}`;
        msg.reply({
            content: yiweiSend
        })
    } else {
        msg.reply({
            content: 'Incorrect command'
        })
    }
        
}
    