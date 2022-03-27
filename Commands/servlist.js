const Discord = require('discord.js')
var newClient = {};
var pModule = require('../pubing.js');
const config = require("../config.json")
module.exports.run = async (client, message, args) => {
    var loading = new Discord.MessageEmbed()
    .setAuthor("Verification", "https://cdn.discordapp.com/emojis/884793608660746250.gif?v=1")
    .setDescription("**SponsorX is verifiying your bot token** \n\nIf this process takes too long, make sure you have the intents ** enabled ** and that your bot is not ** flagged ** by Discord.")
    .setFooter("Dev by azuri.#0001")
    .setColor(config.embedColor)
    // CHECK IF ALREADY PUBING
    message.channel.send(loading)
    var embed_token_invalid = new Discord.MessageEmbed()
    .setTitle(`** ${config.m_token_invalide_title} **`)
    .setDescription(config.m_token_invalid_description)
    .setColor(config.embedColor)
    let tkn = args[0];
    newClient[message.channel.id] = new Discord.Client({fetchAllMembers: true});

    newClient[message.channel.id].login(tkn).catch(err => {message.channel.send(embed_token_invalid)})

    newClient[message.channel.id].on("ready", async () => {
       
        let i0 = 0;
        let i1 = 10;
        let page = 1;
  
        let description =
          `Total Servers - ${newClient[message.channel.id].guilds.cache.size}\n\n` +
          newClient[message.channel.id].guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .map(r => r)
            .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Members\nID - ${r.id}`)
            .slice(0, 10)
            .join("\n");
  
        let embed = new Discord.MessageEmbed()
          .setAuthor(
            message.author.tag,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setColor("GREEN")
          .setFooter(newClient[message.channel.id].user.tag)
          .setTitle(`Page - ${page}/${Math.ceil(newClient[message.channel.id].guilds.cache.size / 10)}`)
          .setDescription(description)
          .addField("Invite the bot", `[Click here to invite the bot](https://discordapp.com/oauth2/authorize?client_id=${newClient[message.channel.id].user.id}&permissions=0&scope=bot)`)
        let msg = await message.channel.send(embed);
  
        await msg.react("⬅");
        await msg.react("➡");
        await msg.react("❌");
  
        let collector = msg.createReactionCollector(
          (reaction, user) => user.id === message.author.id
        );
  
        collector.on("collect", async (reaction, user) => {
          if (reaction._emoji.name === "⬅") {
            // Updates variables
            i0 = i0 - 10;
            i1 = i1 - 10;
            page = page - 1;
  
            // if there is no guild to display, delete the message
            if (i0 + 1 < 0) {
              console.log(i0)
              return msg.delete();
            }
            if (!i0 || !i1) {
              return msg.delete();
            }
  
            description =
              `Total Servers - ${newClient[message.channel.id].guilds.cache.size}\n\n` +
              newClient[message.channel.id].guilds.cache
                .sort((a, b) => b.memberCount - a.memberCount)
                .map(r => r)
                .map(
                  (r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Members`
                )
                .slice(i0, i1)
                .join("\n");
  
            // Update the embed with new informations
            embed
              .setTitle(
                `Page - ${page}/${Math.round(newClient[message.channel.id].guilds.cache.size / 10 + 1)}`
              )
              .setDescription(description)
              .addField("Invite the bot", `[Click here to invite the bot](https://discordapp.com/oauth2/authorize?client_id=${newClient[message.channel.id].user.id}&permissions=0&scope=bot)`)
            // Edit the message
            msg.edit(embed);
          }
  
          if (reaction._emoji.name === "➡") {
            // Updates variables
            i0 = i0 + 10;
            i1 = i1 + 10;
            page = page + 1;
  
            // if there is no guild to display, delete the message
            if (i1 > newClient[message.channel.id].guilds.cache.size + 10) {
              return msg.delete();
            }
            if (!i0 || !i1) {
              return msg.delete();
            }
  
            description =
              `Total Servers - ${newClient[message.channel.id].guilds.cache.size}\n\n` +
              newClient[message.channel.id].guilds.cache
                .sort((a, b) => b.memberCount - a.memberCount)
                .map(r => r)
                .map(
                  (r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Members`
                )
                .slice(i0, i1)
                .join("\n");
  
            // Update the embed with new informations
            embed
              .setTitle(
                `Page - ${page}/${Math.round(newClient[message.channel.id].guilds.cache.size / 10 + 1)}`
              )
              .setDescription(description)
              .addField("Invite the bot", `[Click here to invite the bot](https://discordapp.com/oauth2/authorize?client_id=${newClient[message.channel.id].user.id}&permissions=0&scope=bot)`)
            // Edit the message
            msg.edit(embed);
          }
  
          if (reaction._emoji.name === "❌") {
            return msg.delete();
          }
  
          // Remove the reaction when the user react to the message
          await reaction.users.remove(message.author.id);
        });
      }) 
    }

module.exports.help = {
    name: "servlist"
}