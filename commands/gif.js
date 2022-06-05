// Import fetch
const fetch = require('node-fetch');

// Require dotenv to hide keys
require('dotenv').config();

module.exports = async function gif(msg) {
    let split_msg = msg.content.split(' ');
    // Base search term
    let search_term = 'puppies';
    if (split_msg.length > 1) {
        search_term = split_msg.slice(1,split_msg.length).join(' ');
    }
    
    let url = `https://g.tenor.com/v1/search?q=${search_term}&key=${process.env.TENORKEY}&contentfilter=low`;
    let response = await fetch(url);
    let json = await response.json();
    let json_index = Math.floor(Math.random() * json.results.length);
    msg.channel.send(json.results[json_index].url);
}
