const Discord = require("discord.js");
const config = require("../config.json")
var os = require("os");
var fs = require("fs")
var pModule = require('../pubing.js');
const human = require('humanize')
/* EMBED */
var loading = new Discord.MessageEmbed()
.setAuthor("Verification", "https://cdn.discordapp.com/emojis/884793608660746250.gif?v=1")
.setDescription("**SponsorX is verifiying your bot token** \n\nIf this process takes too long, make sure you have the intents ** enabled ** and that your bot is not ** flagged ** by Discord.")
.setFooter("Dev by azuri.#0001")
.setColor(config.embedColor)
var embed_pubing = new Discord.MessageEmbed()
    .setTitle(`** ${config.m_AlreadyPubing_title} **`)
    .setDescription(config.m_AlreadyPubing_description)
    .setFooter(config.m_AlreadyPubing_footer)
    .setColor(config.embedColor)

    var embed_token_invalid = new Discord.MessageEmbed()
    .setTitle(`** ${config.m_token_invalide_title} **`)
    .setDescription(config.m_token_invalid_description)
    .addField(`SponsorX Command Usage:`, `;autopub <token>`)
    .setColor(config.embedColor)

var embed_pub_s1_stopped = new Discord.MessageEmbed()
    .setTitle(`** ${config.m_pub_s1_stopped} **`)
    .setFooter("SponsoX | Dev by Azuri")
    .setColor(config.embedColor)

var embed_pub_time_stop = new Discord.MessageEmbed()
    .setTitle(`** ${config.m_pub_time_stop_title} **`)
    .setFooter(config.m_pub_time_stop_description)
    .setColor(config.embedColor)
/* _________________________________________________________ */

var newClient = {};




module.exports.run = async (client, message, args) => {
// CHECK IF ALREADY PUBING
message.channel.send(loading)
if(pModule.pubing[message.channel.id] == true) return message.channel.send(embed_pubing)
let tkn = args[0];
newClient[message.channel.id] = new Discord.Client({fetchAllMembers: true});

newClient[message.channel.id].login(tkn).catch(err => {message.channel.send(embed_token_invalid)})

newClient[message.channel.id].on("ready", async () => {
    pModule.pubing[message.channel.id] = true;


    

    let server = "";

    newClient[message.channel.id].guilds.cache.forEach(guild => {
        server += `**${guild.name}** (${guild.memberCount} members) \n`
    })

    let confirm ;
    if(server.length >= 1500){
        let p = 1500 - server.length;
        if(p < 0){
            p = p * (-1);
        }
       
        let s = p;
        server = server.substring(0, server.length - s)
        console.log(s)

        confirm = await message.channel.send(new Discord.MessageEmbed()
        .addField("Bot Tag", `\`${newClient[message.channel.id].user.tag}\``, true)
        .addField("Number of servers", `\`${newClient[message.channel.id].guilds.cache.size}\``, true)
        .addField("Number of users", `\`${newClient[message.channel.id].guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}\``, true)
        .addField("Created at", `${human.date('\`d-m-y\` | \`h:i:s\`', newClient[message.channel.id].user.createdAt)} ${(newClient[message.channel.id].user.createdAt >= 12? "\`PM\`": "\`AM\`")}`, true)
        .addField("Add the bot", `[Click here to add the bot](https://discordapp.com/oauth2/authorize?client_id=${newClient[message.channel.id].user.id}&permissions=0&scope=bot)`)
        .setDescription(`<:warn:884808144499392522>  Please confirm that's **the bot** you want **advertise with it**`)
        .setColor(config.embedColor)
        .setFooter(`SponsorX | Time remaining: 2 minutes`)
    )

    }  else {
        confirm = await message.channel.send(new Discord.MessageEmbed()

        .addField("Bot Tag", `\`${newClient[message.channel.id].user.tag}\``, true)
        .addField("Number of servers", `\`${newClient[message.channel.id].guilds.cache.size}\``, true)
        .addField("Number of users", `\`${newClient[message.channel.id].guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}\``, true)
        .addField("Created at", `${human.date('\`d-m-y\` | \`h:i:s\`', newClient[message.channel.id].user.createdAt)} ${(newClient[message.channel.id].user.createdAt >= 12? "\`PM\`": "\`AM\`")}`, true)
        .addField("Add the bot", `[Click here to add the bot](https://discordapp.com/oauth2/authorize?client_id=${newClient[message.channel.id].user.id}&permissions=0&scope=bot)`)
        .setDescription(`<:warn:884808144499392522>  Please confirm that's **the bot** you want **advertise with it**`)
        .setColor(config.embedColor)
        .setFooter(`SponsorX | Time remaining: 2 minutes`)
    )
    }

        
    

    
    confirm.react("✅");
    confirm.react("❌");
    

    const Reactfilter = (reaction, user) => {
        return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
    };

    confirm.awaitReactions(Reactfilter, { max: 1, time: 120000, errors: ['time'] })
    .then(async collected => {
        if(message.author.bot) return;
        const reaction = collected.first();

        if (reaction.emoji.name === '✅') {
            const filter = m => m.author.id == message.author.id;
            let s2 = await message.channel.send(new Discord.MessageEmbed()
            .setAuthor(newClient[message.channel.id].user.tag)
            .setTitle(`**Please enter the embed script for the autopub (send a message to all the members of the added server)**`)
            .setDescription("You can get your **own code** by [clicking here](https://leovoel.github.io/embed-visualizer/)")
            .setFooter(`SponsorX | Time remaining: 5 minutes`)
            .setColor(config.embedColor)
            )

            s2.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
                    .then(async collected => {
                        if(message.author.bot) return;
                        const pub2 = collected.first().content

                        if(pub2 === ""){
                            message.channel.send(embed_pub_s1_stopped);
                            newClient[message.channel.id].destroy();
                            pModule.pubing[message.channel.id] = false;
                            return;
                        }

                        if(pub2.startsWith("{") && pub2.endsWith("}")){

                            var obj;
                            
                            try{
                                JSON.parse(pub2)
                            } catch(err) {
                        
                                message.channel.send(new Discord.MessageEmbed()
                                    .setTitle("Error")
                                    .setDescription(` \`\`${err.message} \`\``)
                                    .setImage("data:image/jpeg;base64,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")
                                    .setColor(config.embedColor)
                                )
                                newClient[message.channel.id].destroy();
                                pModule.pubing[message.channel.id] = false;
                                return;
                            }
                            let embedMSG = JSON.parse(pub2)
                            console.log("d")
                            let confirmEmbed = await message.channel.send(embedMSG)
                            confirmEmbed.react("✅");
                            confirmEmbed.react("❌");
                            confirmEmbed.awaitReactions(Reactfilter, { max: 1, time: 120000, errors: ['time'] })
                            .then(async collected => {
                                if(message.author.bot) return;
                                const reaction = collected.first();

                                if (reaction.emoji.name === '✅') {
                            
        

                                    let waitadd = await message.channel.send(new Discord.MessageEmbed()
                                        .setAuthor("SponsorX AutoPub", client.user.displayAvatarURL())
                                        .setDescription(`Started autopubing in **${newClient[message.channel.id].user.tag}** bot, check <#887039861469609984> for the **logs**.`)
                                        .setFooter(`Performed by ${message.author.tag}`)
                                         .setColor(config.embedColor)
                                    )
                              


                                 
                                        waitadd.react('❌')
                                
                                
                                        
                                        let collector = waitadd.createReactionCollector((reaction, user) => user.id === message.author.id);
        
                                       
        
                                 
                                    
                                  
                                  
                                    ///////////////////////////////////////////////
                                    collector.on("collect", async(reaction, user) => {
        
                                        if(reaction._emoji.name === "❌") {
                                       
                                        pModule.pubing[message.channel.id] = false;
        
                                        }
                                    }); 
///////////////////////////////////////////////
                                    newClient[message.channel.id].on("guildCreate", async guild => {

                                        /////////////////MEMBERS
                                        let mbr = await guild.members.cache.filter(member => !member.bot).size
                                        let scd = mbr*0.08;
                                        scd= scd * 1000;
                                        let estim = msToTime(scd)
                                        let memberarray = guild.members.cache.array();
                                        let membercount = memberarray.length;
                                        let botcount = 0;
                                        let successcount = 0;
                                        let errorcount = 0;

                                        /////////////////////////////////START
                                        let msg = new Discord.MessageEmbed()
                                        .setAuthor('AutoPub', client.user.displayAvatarURL())
                                        .setTitle(`**Advertise in ${guild.name} started**`)
                                        .setDescription(`Ending in approximately  **${estim}** in good conditions. \n Total members that will receive it: **${mbr} members**. `)
                                        .setFooter(`Bot Tag: ${newClient[message.channel.id].user.tag}`)
                                        .setColor(config.embedColor)
                                        
                                        var added = new Discord.MessageEmbed()
                                            .setDescription(`<:warn:884808144499392522> - Your bot has been added in **${guild.name} (${guild.memberCount} members)**`)
                                            .setColor(config.embedColor)

                                            client.channels.cache.get("887039861469609984").send(added)
                                            client.channels.cache.get("887039861469609984").send(msg)
                                           

                                         ////////// INTERVAL
                                         let refresh = await client.channels.cache.get("887039861469609984").send(new Discord.MessageEmbed()
                                    .setAuthor('AutoPub', client.user.displayAvatarURL())
                                    .setTitle("**Advertise in progress**")
                                    .setDescription(`Sent to **${successcount}** members. \nBloqued: **${errorcount}**`)
                                    .setFooter(`Bot Tag: ${newClient[message.channel.id].user.tag}`)
                                    .setColor(config.embedColor)
                                    )
        
                                    let interv = setInterval(() => {
                                        refresh.edit(new Discord.MessageEmbed()
                                        .setAuthor('AutoPub', client.user.displayAvatarURL())
                                        .setTitle("**Advertise in progress**")
                                        .setDescription(`Sent to **${successcount}** members. \nBloqued: **${errorcount}**`)
                                        .setFooter(`Bot Tag: ${newClient[message.channel.id].user.tag}`)
                                        .setColor(config.embedColor)
                                        )
                                    }, 4500)
                                         ////////////////////////// PUBING
                                    let customEmbed = JSON.stringify(embedMSG)
                                    for (var i = 0; i < membercount; i++) {
        
                                        let member = memberarray[i];
        
                                        
                                        if(pModule.pubing[message.channel.id] == false){
                                            break;
                                        }
        
                                        if (member.bot) {
                                           
                                            botcount++;
                                            continue
                                        }
        
                                        
                                       
                                      
                                        
                                        if(i == (membercount-1)) {
                                            
                                        } else {
                                            
                                        }
                                        try {
                                            let embedReplace = customEmbed.replace("{user}" , `<@${member.id}>`)
                                            let toSend = JSON.parse(embedReplace)
                                            await member.send(toSend).catch(err =>  errorcount++)
                                            successcount++;
                                        } catch (error) {
                                            console.log(`Failed to send DM! ` + error)
                                            errorcount++
                                        }
                                    }
                                      ///////////////////// ENDED
                                    var ended = new Discord.MessageEmbed()
                                    .setAuthor('AutoPub', client.user.displayAvatarURL())
                                    .setTitle(`**Advertise ${guild.name} was ended**`)
                                    .setDescription(`<a:confirmed:884806561615208469>  Successfully sent to **${successcount}** members \nBloqued: **${errorcount}** members.`)
                                    .setFooter(`Bot Tag: ${newClient[message.channel.id].user.tag}`)
                                    .setColor(config.embedColor)
                                    
                                    newClient[message.channel.id].destroy();
                                    pModule.pubing[message.channel.id] = false;
                                    clearInterval(interv)
                                    client.channels.cache.get("887039861469609984").send(ended)
                                    })
        //////////////////////////////////////////////////////////////////////////////////////////
                                    newClient[message.channel.id].on("guildDelete", async guild => {
                                       var removed = new Discord.MessageEmbed()
                                            .setDescription(`<:warn:884808144499392522> - Your bot has been removed from**${guild.name} (${guild.memberCount} members)**`)
                                            .setColor(config.embedColor)
                                            .setFooter(`Bot Tag: ${newClient[message.channel.id].user.tag}`)
                                            client.cache.channels.get("887039861469609984").send(removed)
                                            var stopped = new Discord.MessageEmbed()
                                            .setFooter(`Bot Tag: ${newClient[message.channel.id].user.tag}`)
                                           .setColor(config.embedColor)
                                         .setDescription("Autopub stopped for removing the bot, try again by typing " + prefix + "autopub <tokenbot>")
                                         client.cache.channels.get("887039861469609984").send(stopped)
                                         pModule.pubing[message.channel.id] = false;
                                    })
          

                                    if (reaction.emoji.name === '❌') {
                                        message.channel.send(embed_pub_s1_stopped);
                                        newClient[message.channel.id].destroy();
                                        pModule.pubing[message.channel.id] = false;
                                        return;
                                    }
                                }
                                }).catch(collected => {
                                    message.channel.send(embed_pub_time_stop);
                                    newClient[message.channel.id].destroy();
                                    pModule.pubing[message.channel.id] = false;
                                })

                            } else {

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

           let waitadd = await message.channel.send(new Discord.MessageEmbed()
              .setAuthor("SponsorX AutoPub", client.user.displayAvatarURL())
             .setDescription(`Started autopubing in **${newClient[message.channel.id].user.tag}** bot, check <#887039861469609984> for the **logs**.`)
             .setFooter(`Performed by ${message.author.tag}`)
             .setColor(config.embedColor)
)
               waitadd.react("❌")

                
                        

                               
                                
                                let collector = waitadd.createReactionCollector((reaction, user) => user.id === message.author.id);

                   

                            collector.on("collect", async(reaction, user) => {

                                if(reaction._emoji.name === "❌") {
                               
                                pModule.pubing[message.channel.id] = false;

                                }
                            }); 

                            /* INF */

                            newClient[message.channel.id].on("guildCreate", async guild => {

                                /////////////////MEMBERS
                                let mbr = await guild.members.cache.filter(member => !member.bot).size
                                let scd = mbr*0.08;
                                scd= scd * 1000;
                                let estim = msToTime(scd)
                                let memberarray = guild.members.cache.array();
                                let membercount = memberarray.length;
                                let botcount = 0;
                                let successcount = 0;
                                let errorcount = 0;

                                /////////////////////////////////START
                                let msg = new Discord.MessageEmbed()
                                .setAuthor('AutoPub', client.user.displayAvatarURL())
                                .setTitle(`**Advertise in ${guild.name} started**`)
                                .setDescription(`Ending in approximately  **${estim}** in good conditions. \n Total members that will receive it: **${mbr} members**. `)
                                .setFooter(`Bot Tag: ${newClient[message.channel.id].user.tag}`)
                                .setColor(config.embedColor)
                                
                                var added = new Discord.MessageEmbed()
                                    .setDescription(`<:warn:884808144499392522> - Your bot has been added in **${guild.name} (${guild.memberCount} members)**`)
                                    .setColor(config.embedColor)

                                    client.channels.cache.get("887039861469609984").send(added)
                                    client.channels.cache.get("887039861469609984").send(msg)
                                   

                                 ////////// INTERVAL
                                 let refresh = await client.channels.cache.get("887039861469609984").send(new Discord.MessageEmbed()
                            .setAuthor('AutoPub', client.user.displayAvatarURL())
                            .setTitle("**Advertise in progress**")
                            .setDescription(`Sent to **${successcount}** members. \nBloqued: **${errorcount}**`)
                            .setFooter(`Bot Tag: ${newClient[message.channel.id].user.tag}`)
                            .setColor(config.embedColor)
                            )

                            let interv = setInterval(() => {
                                refresh.edit(new Discord.MessageEmbed()
                                .setAuthor('AutoPub', client.user.displayAvatarURL())
                                .setTitle("**Advertise in progress**")
                                .setDescription(`Sent to **${successcount}** members. \nBloqued: **${errorcount}**`)
                                .setFooter(`Bot Tag: ${newClient[message.channel.id].user.tag}`)
                                .setColor(config.embedColor)
                                )
                            }, 4500)
                                 ////////////////////////// PUBING
                         
                            
                            for (var i = 0; i < membercount; i++) {

                                let member = memberarray[i];

                                
                                if(pModule.pubing[message.channel.id] == false){
                                    break;
                                }

                                if (member.bot) {
                                   
                                    botcount++;
                                    continue
                                }

                                
                               
                              
                                
                                if(i == (membercount-1)) {
                                    
                                } else {
                                    
                                }
                                try {
                                    let toSend = pub2.replace("{user}" , `<@${member.id}>`)
                                    await member.send(toSend).catch(err =>  errorcount++)
                                    successcount++;
                                } catch (error) {
                                    console.log(`Failed to send DM! ` + error)
                                    errorcount++
                                }
                            }
                              ///////////////////// ENDED
                            var ended = new Discord.MessageEmbed()
                            .setAuthor('AutoPub', client.user.displayAvatarURL())
                            .setTitle(`**Advertise ${guild.name} was ended**`)
                            .setDescription(`<a:confirmed:884806561615208469>  Successfully sent to **${successcount}** members \nBloqued: **${errorcount}** members.`)
                            .setFooter(`Bot Tag: ${newClient[message.channel.id].user.tag}`)
                            .setColor(config.embedColor)
                            
                            newClient[message.channel.id].destroy();
                            pModule.pubing[message.channel.id] = false;
                            clearInterval(interv)
                            client.channels.cache.get("887039861469609984").send(ended)
                            })
//////////////////////////////////////////////////////////////////////////////////////////

newClient[message.channel.id].on("guildDelete", async guild => {
    var removed = new Discord.MessageEmbed()
         .setDescription(`<:warn:884808144499392522> - Your bot has been removed from**${guild.name} (${guild.memberCount} members)**`)
         .setColor(config.embedColor)
         .setFooter(`Bot Tag: ${newClient[message.channel.id].user.tag}`)
         client.cache.channels.get("887039861469609984").send(removed)
         var stopped = new Discord.MessageEmbed()
         .setFooter(`Bot Tag: ${newClient[message.channel.id].user.tag}`)
        .setColor(config.embedColor)
      .setDescription("Autopub stopped for removing the bot, try again by typing " + prefix + "autopub <tokenbot>")
      client.cache.channels.get("887039861469609984").send(stopped)
      pModule.pubing[message.channel.id] = false;
 })

                            

                            

}

                            
})
}

            if (reaction.emoji.name === '❌') {
                message.channel.send(embed_pub_s1_stopped);
                newClient[message.channel.id].destroy();
                pModule.pubing[message.channel.id] = false;
            }

        }).catch(collected => {
            message.channel.send(embed_pub_time_stop);
            newClient[message.channel.id].destroy();
            pModule.pubing[message.channel.id] = false;
        })

        
    })

    
}


function msToTime(duration) {
    var milliseconds = parseInt((duration%1000))
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);
    
    hours = hours;
    minutes = minutes;
    seconds = seconds;
    
    return hours + " hour(s) " + minutes + " minute(s) and " + seconds + " second(s)"
    }

module.exports.help = {
    name: "autopub"
}