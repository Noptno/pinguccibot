var colors = require('colors');



const Discord = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
var prefix = config.prefix;
const client = new Discord.Client({fetchAllMembers: true});
client.commands = new Discord.Collection();

client.login(config.token);

fs.readdir("./Commands/", (err, files) => {
    if(err) console.log(err)
    console.log(`${files.length} commands loaded`.bgRed.black);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");

    if(jsfiles.length <= 0){
        console.log("Commands not loaded")
        return;
    }

    jsfiles.forEach((f, i) => {
        let props = require(`./Commands/${f}`) 
        client.commands.set(props.help.name, props);
    })
})






client.on("ready", () => {
    console.log(
        `Connected as ${client.user.tag} (Advert+) \n`.bgGreen.black
        +`Client Id: ${client.user.id} (Advert+) \n `.bgGreen.black
        +`Invite: https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=0 \n`.bgGreen.black
        +`Discord Version: ${Discord.version}`.bgGreen.black
        +`Dev by azuri.#0001`.bgGreen.black
    )

    client.user.setActivity(config.stream, {type: "STREAMING", url: "https://twitch.tv/azuri"});


})


client.on("message", async message => {

    client.emit('checkMessage', message);
   
    
    let prefix = config.prefix;
    if (message.content.indexOf(prefix) !== 0) return;

const args = message.content.slice(prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();
let commandfile = client.commands.get(command);
if (commandfile) commandfile.run(client, message, args);
if (message.content.indexOf(prefix) !== 0) return;



                            
})
