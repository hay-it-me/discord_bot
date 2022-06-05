// Import fetch
const fetch = require('node-fetch');

const fs = require('fs');
const { match } = require('assert');


function formatAsPercent(num) {
    return new Intl.NumberFormat('default', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num / 100);
}


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
                    if (i != red_team.length - 1) {
                        red_output = red_output.concat(`${red_team[i]} - ${red_team_agents[i]}, `);
                    } else {
                        red_output = red_output.concat(`${red_team[i]} - ${red_team_agents[i]}\n`);
                    }
                }
                let blue_output = "Blue team: \n";
                for (let i = 0; i < blue_team.length; i++) {
                    if (i != blue_team.length - 1 ) {
                        blue_output = blue_output.concat(`${blue_team[i]} - ${blue_team_agents[i]}, `);
                    } else {
                        blue_output = blue_output.concat(`${blue_team[i]} - ${blue_team_agents[i]}\n`);
                    }
                }
                let personal_stats = "Your performance: \n";
                
                let casts = [json.data[match_num - 1].players.all_players[char_index].ability_casts.c_cast,
                json.data[match_num - 1].players.all_players[char_index].ability_casts.q_cast,
                json.data[match_num - 1].players.all_players[char_index].ability_casts.e_cast,
                json.data[match_num - 1].players.all_players[char_index].ability_casts.x_cast];

                personal_stats = personal_stats.concat(`C casts: ${casts[0]}, Q casts: ${casts[1]}, E casts: ${casts[2]}, X casts: ${casts[3]}\n`);


                let stats = [json.data[match_num - 1].players.all_players[char_index].stats.score,
                json.data[match_num - 1].players.all_players[char_index].stats.kills,
                json.data[match_num - 1].players.all_players[char_index].stats.deaths,
                json.data[match_num - 1].players.all_players[char_index].stats.assists];
                
                personal_stats = personal_stats.concat(`Score: ${stats[0]}\nKDA: ${stats[1]}/${stats[2]}/${stats[3]}\n`);
                
                let shots = [
                json.data[match_num - 1].players.all_players[char_index].stats.bodyshots,
                json.data[match_num - 1].players.all_players[char_index].stats.headshots,
                json.data[match_num - 1].players.all_players[char_index].stats.legshots];
                let total_shots = shots[0] + shots[1] + shots[2];
                let bs_perc = formatAsPercent(100 * shots[0]/total_shots);
                let hs_perc = formatAsPercent(100 * shots[1]/total_shots);
                let fs_perc = formatAsPercent(100 * shots[2]/total_shots);

                personal_stats = personal_stats.concat(`Headshots: ${shots[1]}(${hs_perc})\nBodyshots: ${shots[0]}(${bs_perc})\nFeetshots: ${shots[2]}(${fs_perc})\n`);
                
                let dmg = [
                    json.data[match_num - 1].players.all_players[char_index].damage_made,
                    json.data[match_num - 1].players.all_players[char_index].damage_received
                ]
                personal_stats = personal_stats.concat(`Damage inflicted/taken: ${dmg[0]}/${dmg[1]}`);

                msg.channel.send(red_output + blue_output + personal_stats);
                
            }
        }
        return;

    }
    msg.channel.send('Oops, that command was not recognised!');
    
}
    