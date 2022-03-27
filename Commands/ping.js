module.exports.run = async (client, message, args) => {

message.channel.send(`My ping is **${client.ws.ping}** ms ! Very **rapid** no ?`)
    }

    module.exports.help = {
        name: "ping"
    }