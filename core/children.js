const { Client } = require("discord.js")
const DiscordVoice = require('@discordjs/voice');

class Core extends Client {
    constructor(intents, id, token) {
        super(intents)
        this.id = id
        this.token = token
        this.on("ready", () => console.log(`Logged in as: ${this.user.tag} with ID: ${this.id}`))
        this.on("messageCreate", (message) => {
            if (message.content === "play") {
                if(!message.member.voice.channel) return message.channel.send("You are not in a voice channel")
                if(message.member.voice.channel?.id === message.guild.me.voice.channel?.id) {
                    message.channel.send("I'll add the track to the queue")
                } else if (!message.guild.me.voice.channel) {
                    process.send({ id: this.id, message: message, channel: message.member.voice.channel?.id })
                    process.once('message', (m) => {
                        if (m.type === "play") {
                            DiscordVoice.joinVoiceChannel({
                                channelId: message.member.voice.channel.id,
                                guildId: message.guild.id,
                                adapterCreator: message.guild.voiceAdapterCreator,
                                group: this.id,
                                selfDeaf: true
                            });
                            message.channel.send("I'll start play")
                        }
                    });
                }
            }
        })
    }
    spawn() {
        this.login(this.token)
    }
}

process.on('message', (message) => {
    if (!global.child?.user) {
        global.child = new Core({ intents: "3067" }, message.id, message.token)
        global.child.spawn()
    }
});