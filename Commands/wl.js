const Discord = require("discord.js");
const config = require("../config.json")




    /* EMBED */


var embed_wl_error = new Discord.MessageEmbed()
    .setDescription(`**${config.m_wl_error}**`)
    .setColor(config.embedColor)

var embed_wl_null = new Discord.MessageEmbed()
    .setDescription(` ${config.m_wl_null} `)
    .setColor(config.embedColor)



/* _________________________________________________________ */



module.exports.run = async (client, message, args) => {




    if(!message.member.roles.cache.get(config.helperRole)) return;

    let target;

    if(!message.mentions.members.first()){
        if(!args[0]){
            return message.channel.send(embed_wl_null);
        } else {
            target = message.guild.members.cache.get(args[0])

            if(!target) return message.channel.send(embed_wl_error);

            message.guild.channels.create(target.user.username, {type: "text", permissionOverwrites: [
                {
                    id: message.guild.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: target.id,
                    allow: ['VIEW_CHANNEL'],
                },
            ],}).then(channel => {
                target.roles.add(config.wlrole)
                channel.send(new Discord.MessageEmbed() 
                .setTitle(`**Welcome in your private channel, ${target.user.username}**`)
                .setDescription(`You now have your own private room to advertise with SponsorX! \nDon't forget that to have a stable and optimal use, you must have several bot tokens! Please speak to an <@&884863271700672533> for further assistance! \nGood ad!`)
                .setColor(config.embedColor)
                )
    
                channel.send(new Discord.MessageEmbed() 
                .setAuthor("📨 - Help")
                .setTitle("Here is the available commands for SponsorX")
            
                .setDescription("** Pub Commands :**")
                .addField("``" + config.prefix + "autopub tokenbot``", "This command sends a message to all the members of a new added server in your bot.")
                .addField("``" + config.prefix + "autopub# tokenbot``", "This command sends a message to all the online members of a new added server in your bot.")
                .addField("``" + config.prefix + "embed tokenbot``", "This command sends an embed message to all the members of a server.")
                .addField("``" + config.prefix + "embedall tokenbot``", "This command sends an embed message to all members of all servers where your bot is found.")
                .addField("``" + config.prefix + "embed# tokenbot``", "This command sends an embed message to all connected members of a server. ")
                .addField("``"+ config.prefix + "embedall# tokenbot``", "This command allows you to send an embed message to all connected members of the servers where your bot is found. \n **Site to create an embed code:** https://leovoel.github.io/embed-visualizer/")
                .addField("** Other Commands :** \n``" + config.prefix + "token <token>``", "This command allows you to check if your bot token is valid or not.")
                .addField("``" + config.prefix + "servlist tokenbot``", "This command displays the entire list of servers where your bot is found.")
                .setColor(config.embedColor)
                .setFooter('SponsorX')
                .setTimestamp()

                )
            })

            
            message.channel.send(new Discord.MessageEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL())
            .setDescription(`**<a:confirmed:884806561615208469> ${target.user.username} ${config.m_wl_sucess}**`)
            .setColor(config.embedColor)
            .setFooter("SupraX Whitelist"))
        }
    } else {
        target = message.mentions.members.first()

        message.guild.channels.create(target.user.username, {type: "text", permissionOverwrites: [
            {
                id: message.guild.id,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: target.id,
                allow: ['VIEW_CHANNEL'],
            },
        ],}).then(channel => {
            target.roles.add(config.wlrole)
            channel.send(new Discord.MessageEmbed() 
                .setTitle(`**Welcome in your private channel, ${target.user.username}**`)
                .setDescription(`You now have your own private room to advertise with SponsorX! \nDon't forget that to have a stable and optimal use, you must have several bot tokens! Please speak to <@&884863271700672533> for further assistance! \nGood ad!`)
                .setColor(config.embedColor)
            )

            channel.send(new Discord.MessageEmbed() 
            .setAuthor("📨 - Help")
            .setTitle("Here is the available commands for SponsorX")
        
            .setDescription("** Pub Commands :**")
            .addField("``" + config.prefix + "autopub tokenbot``", "This command sends a message to all the members of a new added server in your bot.")
            .addField("``" + config.prefix + "autopub# tokenbot``", "This command sends a message to all the online members of a new added server in your bot.")
            .addField("``" + config.prefix + "embed tokenbot``", "This command sends an embed message to all the members of a server.")
            .addField("``" + config.prefix + "embedall tokenbot``", "This command sends an embed message to all members of all servers where your bot is found.")
            .addField("``" + config.prefix + "embed# tokenbot``", "This command sends an embed message to all connected members of a server. ")
            .addField("``"+ config.prefix + "embedall# tokenbot``", "This command allows you to send an embed message to all connected members of the servers where your bot is found. \n **Site to create an embed code:** https://leovoel.github.io/embed-visualizer/")
            .addField("** Other Commands :** \n``" + config.prefix + "token <token>``", "This command allows you to check if your bot token is valid or not.")
            .addField("``" + config.prefix + "servlist tokenbot``", "This command displays the entire list of servers where your bot is found.")
            .setColor(config.embedColor)
            .setFooter('SponsorX')
            .setTimestamp()
            
            )
        })

        message.channel.send(new Discord.MessageEmbed()
        .setDescription(`**<a:confirmed:884806561615208469> ${target.user.username} ${config.m_wl_sucess}** `)
        .setColor(config.embedColor))
    }






    
    
}

module.exports.help = {
    name: "wl"
}