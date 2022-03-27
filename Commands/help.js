const Discord = require("discord.js");
const config = require("../config.json")
var pModule = require('../pubing.js');

/* EMBED */

var eHelp = new Discord.MessageEmbed()
    .setAuthor("📨 - Help")
    .setTitle("Here is the available commands for SponsorX")

    .setDescription("** Pub Commands :**")
    .addField("``" + config.prefix + "autopub tokenbot``", "This command sends a message to all the members of a new added server in your bot.")
    .addField("``" + config.prefix + "autopub# tokenbot``", "This command sends a message to all the online members of a new added server in your bot.")
    .addField("** Other Commands :** \n``" + config.prefix + "token <token>``", "This command allows you to check if your bot token is valid or not.")
    .addField("``" + config.prefix + "servlist tokenbot``", "This command displays the entire list of servers where your bot is found. \n\n **Website to create an embed code:** https://leovoel.github.io/embed-visualizer/")
    .setColor(config.embedColor)
    .setFooter('SponsorX')
    .setTimestamp()

module.exports.run = async (client, message, args) => {
    message.channel.send(eHelp)
}

module.exports.help = {
    name: "help"
}