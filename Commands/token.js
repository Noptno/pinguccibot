const Discord = require('discord.js')
var newClient = {};
const config = require("../config.json")
const human = require("humanize")
module.exports.run = async (client, message, args) => {
    var loading = new Discord.MessageEmbed()
    .setAuthor("Verification", "https://cdn.discordapp.com/emojis/884793608660746250.gif?v=1")
    .setDescription("**SponsorX is verifiying your bot token** \n\nIf this process takes too long, make sure you have the intents ** enabled ** and that your bot is not ** flagged ** by Discord.")
    .setFooter("Dev by azuri.#0001")
    .setColor(config.embedColor)
    message.channel.send(loading)
    const embed_token_valid = new Discord.MessageEmbed()
    .setAuthor('Token', "https://cdn.discordapp.com/attachments/747156473314017382/747193838430453820/730392714096541796.gif")
    .setDescription("**SponsorX verified your token and it's successfully works ! Good ad with it.**")
    .setFooter('SponsorX')
    .setColor("1600FF")
    var embed_token_invalid = new Discord.MessageEmbed()
    .setTitle(`** ${config.m_token_invalide_title} **`)
    .setDescription(config.m_token_invalid_description)
    .addField(`SponsorX Command Usage:`, `*token <token>`)
    .setColor(config.embedColor)
   
    let tkn = args[0];
    newClient[message.channel.id] = new Discord.Client
    newClient[message.channel.id].login(tkn).catch(err => {return message.channel.send(embed_token_invalid)})
    newClient[message.channel.id].on("ready", async () => {
        let embedbot =  new Discord.MessageEmbed()
        .addField("Bot Tag", `\`${newClient[message.channel.id].user.tag}\``, true)
        .addField("Number of servers", `\`${newClient[message.channel.id].guilds.cache.size}\``, true)
        .addField("Number of users", `\`${newClient[message.channel.id].guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}\``, true)
        .addField("Created at", `${human.date('\`d-m-y\` | \`h:i:s\`', newClient[message.channel.id].user.createdAt)} ${(newClient[message.channel.id].user.createdAt >= 12? "\`PM\`": "\`AM\`")}`, true)
        .addField("Add the bot", `[Click here to add the bot](https://discordapp.com/oauth2/authorize?client_id=${newClient[message.channel.id].user.id}&permissions=0&scope=bot)`)
        .setDescription(`Here is all the **informations** of your bot.`)
        .setColor(config.embedColor)
        .setFooter(`SponsorX`)
     message.channel.send(embed_token_valid)
     message.channel.send(embedbot)
    }

    
    )
 
}
module.exports.help = {
    name: "token"
}