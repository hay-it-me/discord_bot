// Import fetch
const fetch = require('node-fetch');

const fs = require('fs');
const { match } = require('assert');


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
        // setting up variables for match history loop
        let last_num = match_num;
        if (match_num_used == false) {
            last_num = 5;
        }
        
        if (json.status == 200) {
            for (; match_num <= last_num; match_num++) {
                let red_team = [];
                let red_team_agents = [];
                let blue_team = [];
                let blue_team_agents = [];
                let char_index;
                for (let i = 0; i < json.data[match_num - 1].players.all_players.length; i++) {
                    if (json.data[match_num - 1].players.all_players[i].team == "Red") {
                        red_team.push(json.data[match_num - 1].players.all_players[i].name);
                        red_team_agents.push(json.data[match_num - 1].players.all_players[i].character);
                    }
                    if (json.data[match_num - 1].players.all_players[i].team == "Blue") {
                        blue_team.push(json.data[match_num - 1].players.all_players[i].name);
                        blue_team_agents.push(json.data[match_num - 1].players.all_players[i].character);
                    }
                    if (json.data[match_num - 1].players.all_players[i].name == account) {
                        char_index = i;
                    }
                }
                let red_output = "Red team: \n";
                for (let i = 0; i < red_team.length; i++) {
                    red_output = red_output.concat(`${red_team[i]} - ${red_team_agents[i]}\n`);
                }
                let blue_output = "Blue team: \n";
                for (let i = 0; i < blue_team.length; i++) {
                    blue_output = blue_output.concat(`${blue_team[i]} - ${blue_team_agents[i]}\n`);
                }
                msg.channel.send(red_output + blue_output);
                
                
            }
        }

        // if match_num_used, return just that match

        // if match_num_used = false, return last 5 matches

        return;

    }
    msg.channel.send('Oops, that command was not recognised!');
    
}
    