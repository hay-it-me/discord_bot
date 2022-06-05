// Import fetch
const fetch = require('node-fetch');

const fs = require('fs');


module.exports = async function(msg) {
    let account = 'couchpohtehto33';
    let tag = 3770;

    let split_msg = msg.content.split(' ');
    // command used to check mmr and ranking
    // command structure: !valorant mmr accountname (optional) tag (optional)
    if (split_msg[1] == 'mmr') {
        if (split_msg.length >= 3) {
            // Reassign name if provided
            let temp = split_msg.slice(2,split_msg.length).join(' ');
            // idiot proofing the command for accountname
            if (temp.split('#').length == 1) {
                account = split_msg.slice(2,split_msg.length-1).join(' ');
                tag = split_msg[split_msg.length-1];
            } else {
                account = temp.split('#')[0];
                tag = temp.split('#')[1];
            }
        }
        let url = `https://api.henrikdev.xyz/valorant/v1/mmr/ap/${account}/${tag}`;
        let response = await fetch(url);
        let json = await response.json();
        if (json.status == 200) {
            const data_msg = 
            `Details about ${account}${'#' + tag}:\nRank: ${json.data.currenttierpatched}\nCurrent RR: ${json.data.ranking_in_tier}\nMRR: ${json.data.elo} (${json.data.mmr_change_to_last_game})`;
            msg.channel.send(data_msg);
        } else {
            msg.channel.send('Oops something went wrong! Error code: ' + json.status);
        }
        return;
    }
    // command used to check match history and data
    // command structure: !valorant mh accountname (optional) tag (optional) match ('1-5' optional)
    if (split_msg[1] == 'mh') {
        let match_num = 1;
        let match_num_used = false;
        if (split_msg.length >= 3) {
            // check if the last 'match' field is used
            if (!isNaN(split_msg[split_msg.length - 1])) {
                // range check
                let last_num = parseInt(split_msg[split_msg.length - 1]);
                if (last_num >= 1 && last_num <= 5) {
                    match_num = last_num;
                    match_num_used = true;
                    let temp_split = split_msg.slice(0, split_msg.length-1);
                    split_msg = temp_split;
                }
            }
            
            let temp = split_msg.slice(2,split_msg.length).join(' ');
            // idiot proofing the command for accountname
            if (temp.split('#').length == 1) {
                account = split_msg.slice(2,split_msg.length-1).join(' ');
                tag = split_msg[split_msg.length-1];
            } else {
                account = temp.split('#')[0];
                tag = temp.split('#')[1];
            }
        }
        let url = `https://api.henrikdev.xyz/valorant/v3/matches/ap/${account}/${tag}`;
        let response = await fetch(url);
        let json = await response.json();
        if (json.status == 200) {
            console.log(json.data.players.name);
        }
    }
    
}
    