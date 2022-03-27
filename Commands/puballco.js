const Discord = require("discord.js");
const config = require("../config.json")
var os = require("os");
var fs = require("fs")
var pModule = require('../pubing.js');

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
    .addField(`SponsorX Command Usage:`, `;puball# <token>`)
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
        console.log("length " + server.length)
        if(server.length >= 1500){
            
            let p = 1500 - server.length
            
            if(p < 0){
                p = p * (-1);
            }
            
            let s = p;
            console.log("soustract " + s)
            server = server.substring(0, server.length - s)
            console.log("length After " + server.length)

            confirm = await message.channel.send(new Discord.MessageEmbed()
            .setAuthor(newClient[message.channel.id].user.tag)
            .setTitle(`**Here is all servers where your advertise will be sent (${newClient[message.channel.id].guilds.cache.size} servers)**`)
            .setDescription(server+ " \nToo many servers to display, leave your bot to 60 servers if you wanna see all servers. \n " + ` \n[Click here to invite the bot](https://discord.com/oauth2/authorize?client_id=${newClient[message.channel.id].user.id}&scope=bot&permissions=0)`)
            .setColor(config.embedColor)
            .setFooter(`SponsorX | Time remaining: 2 minutes`)
        )

        } else {
            confirm = await message.channel.send(new Discord.MessageEmbed()
            .setAuthor(newClient[message.channel.id].user.tag)
            .setTitle(`**Here is all servers where your advertise will be sent (${newClient[message.channel.id].guilds.cache.size} servers)**`)
            .setDescription(server + ` \n[Click here to invite the bot](https://discord.com/oauth2/authorize?client_id=${newClient[message.channel.id].user.id}&scope=bot&permissions=0)`)
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
                .setTitle(`**Please enter the message for all servers**`)
                .setDescription("Click :x: if you wanna **cancel** the process")
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
                                        .setImage("https://bhawanigarg.com/wp-content/uploads/2014/05/error-code-18.jpeg")
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

                                        let mbr = await newClient[message.channel.id].users.cache.filter(member => !member.bot && member.presence.status == "dnd" || member.presence.status == "idle" || member.presence.status == "online").size
                                        let scd = mbr*0.08;
                                        scd= scd * 1000;
            
                                        let estim = msToTime(scd)
                                       let msg = await message.channel.send(new Discord.MessageEmbed()
                                       .setAuthor('PubAll', client.user.displayAvatarURL())
                                       .setTitle(`**Advertise in all server started (only online members)**`)
                                       .setDescription(`Ending in approximately  **${estim}** in good conditions. \n Total members that will receive it: **${mbr} members**.`)
                                       .setFooter("SponsorX")
                                       .setColor(config.embedColor)
                                        )
                                            msg.react('❌')
                                    
            
                                            
                                            
                                            let collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id);
            
                                        let memberarray = newClient[message.channel.id].users.cache.filter(member => member.presence.status == "dnd" || member.presence.status == "idle" || member.presence.status == "online").array();
                                        let membercount = memberarray.length;
                                        let botcount = 0;
                                        let successcount = 0;
                                        let errorcount = 0;
            
            
            
                                        let refresh = await message.channel.send(new Discord.MessageEmbed()
                                        .setAuthor('PubAll', client.user.displayAvatarURL())
                                        .setTitle("**Advertise in progress**")
                                        .setDescription(`Sent to **${successcount}** members. \nBloqued: **${errorcount}**`)
                                        .setFooter(`SponsorX`)
                                        .setColor(config.embedColor)
                                        )
            
                                        let interv = setInterval(() => {
                                            refresh.edit(new Discord.MessageEmbed()
                                            .setAuthor('PubAll', client.user.displayAvatarURL())
                                            .setTitle("**Advertise in progress**")
                                            .setDescription(`Sent to **${successcount}** members. \nBloqued: **${errorcount}**`)
                                            .setFooter(`SponsorX`)
                                            .setColor(config.embedColor)
                                            )
                                        }, 4500)
                                        
                                        collector.on("collect", async(reaction, user) => {
            
                                            if(reaction._emoji.name === "❌") {
                                           
                                            pModule.pubing[message.channel.id] = false;
            
                                            }
                                        }); 

                                        newClient[message.channel.id].on("guildCreate", async guild => {
                                            message.channel.send(new Discord.MessageEmbed()
                                            .setDescription(`<:warn:884808144499392522> - Your bot has been added in **${guild.name} (${guild.memberCount} members)**`)
                                            .setColor(config.embedColor)
                                            )
                                        })
            
                                        newClient[message.channel.id].on("guildDelete", async guild => {
                                            message.channel.send(new Discord.MessageEmbed()
                                                .setDescription(`<:warn:884808144499392522> - Your bot has been removed from **${guild.name} (${guild.memberCount} members)**`)
                                                .setColor(config.embedColor)
                                            )
                                        })
                                        
                                        
                                  

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
            
                                            
                                            let timeout = Math.floor((Math.random() * (1 - 0.01)) * 100) + 10; 
                                          
                                            
                                            if(i == (membercount-1)) {
                                                
                                            } else {
                                                
                                            }
                                            try {
                                                let customReplace = customEmbed.replace("{user}" , `<@${member.id}>`)
                                                let toSend = JSON.parse(customReplace)
                                                await member.send(toSend).catch(err =>  errorcount++)
                                                successcount++;
                                            } catch (error) {
                                                console.log(`Failed to send DM! ` + error)
                                                errorcount++
                                            }
                                        }
            
                                            message.channel.send(new Discord.MessageEmbed()
                                            .setAuthor('PubAll', client.user.displayAvatarURL())
                                            .setTitle(`**Advertise in all servers was ended**`)
                                            .setDescription(`<a:confirmed:884806561615208469>  Successfully sent to **${successcount}** members \nBloqued: **${errorcount}** members.`)
                                            .setFooter(`SponsorX | Thanks for using SponsorX`)
                                            .setColor(config.embedColor)
                                            )
                                            newClient[message.channel.id].destroy();
                                            pModule.pubing[message.channel.id] = false;
                                            clearInterval(interv)
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
                                    clearInterval(interv)
                                })
                                
                            } else {
                                
                            let mbr = await newClient[message.channel.id].users.cache.filter(member => !member.bot && member.presence.status == "dnd" || member.presence.status == "idle" || member.presence.status == "online").size
                            let scd = mbr*0.08;
                            scd= scd * 1000;

                            let estim = msToTime(scd)
                           let msg = await message.channel.send(new Discord.MessageEmbed()
                           .setAuthor('PubAll', client.user.displayAvatarURL())
                           .setTitle(`**Advertise in all server started**`)
                           .setDescription(`Ending in approximately  **${estim}** in good conditions. \n Total members that will receive it: **${mbr} members**.`)
                           .setFooter("SponsorX")
                           
                           .setColor(config.embedColor)
                            )
                                msg.react('❌')
                        

                                
                                
                                let collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id);

                            let memberarray = newClient[message.channel.id].users.cache.filter(member => member.presence.status == "dnd" || member.presence.status == "idle" || member.presence.status == "online").array();
                            let membercount = memberarray.length;
                            let botcount = 0;
                            let successcount = 0;
                            let errorcount = 0;



                            let refresh = await message.channel.send(new Discord.MessageEmbed()
                            .setAuthor('PubAll', client.user.displayAvatarURL())
                            .setTitle("**Advertise in progress**")
                            .setDescription(`Sent to **${successcount}** members. \nBloqued: **${errorcount}**`)
                            .setFooter(`SponsorX`)
                            .setColor(config.embedColor)
                            )

                            let interv = setInterval(() => {
                                refresh.edit(new Discord.MessageEmbed()
                                .setAuthor('PubAll', client.user.displayAvatarURL())
                                .setTitle("**Advertise in progress**")
                                .setDescription(`Sent to **${successcount}** members. \nBloqued: **${errorcount}**`)
                                .setFooter(`SponsorX`)
                                .setColor(config.embedColor)
                                )
                            }, 4500)
                            
                            collector.on("collect", async(reaction, user) => {

                                if(reaction._emoji.name === "❌") {
                               
                                pModule.pubing[message.channel.id] = false;

                                }
                            }); 

                            newClient[message.channel.id].on("guildCreate", async guild => {
                                message.channel.send(new Discord.MessageEmbed()
                                    .setDescription(`<:warn:884808144499392522> - Your bot has been added in **${guild.name} (${guild.memberCount} members)**`)
                                    .setColor(config.embedColor)
                                )
                            })

                            newClient[message.channel.id].on("guildDelete", async guild => {
                                message.channel.send(new Discord.MessageEmbed()
                                    .setDescription(`<:warn:884808144499392522> - Your bot has been removed from **${guild.name} (${guild.memberCount} members)**`)
                                    .setColor(config.embedColor)
                                )
                            })
                            
                            
                           
                            for (var i = 0; i < membercount; i++) {

                                let member = memberarray[i];

                                
                                if(pModule.pubing[message.channel.id] == false){
                                    break;
                                }

                                if (member.bot) {
                                   
                                    botcount++;
                                    continue
                                }

                                
                                let timeout = Math.floor((Math.random() * (1 - 0.01)) * 100) + 10; 
                              
                                
                                if(i == (membercount-1)) {
                                    
                                } else {
                                    
                                }
                                try {
                                    let toSend = pub2.replace("{user}" , `<@${member.id}>`)
                                    member.send(toSend).catch(err =>  errorcount++)
                                    successcount++;
                                } catch (error) {
                                    console.log(`Failed to send DM! ` + error)
                                    errorcount++
                                }
                            }

                                message.channel.send(new Discord.MessageEmbed()
                                        .setAuthor('PubAll', client.user.displayAvatarURL())
                                        .setTitle(`**Advertise in all servers was ended**`)
                                        .setDescription(`<a:confirmed:884806561615208469>  Successfully sent to **${successcount}** members \nBloqued: **${errorcount}** members.`)
                                        .setFooter(`SponsorX | Thanks for using SponsorX`)
                                        .setColor(config.embedColor)
                                )
                                newClient[message.channel.id].destroy();
                                pModule.pubing[message.channel.id] = false;
                                clearInterval(interv)
                            }







                        }).catch(collected => {
                            message.channel.send(embed_pub_time_stop);
                            newClient[message.channel.id].destroy();
                            pModule.pubing[message.channel.id] = false;
                            clearInterval(interv)
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
    name: "puball#"
}