const Discord = require('discord.js');
const dotenv = require('dotenv');
const { REST } = require("@discordjs/rest");
const { Routes } = require("@discord-api-types/v9");
const fs = require('fs');
const { Player } = require('discord-player');

dotenv.config();
const TOKEN = process.env.TOKEN

const LOAD_SLASH = process.argv[2] == "load"

const CLIENT_ID = "954203349882929194";
const GUILD_ID = "285648579605954560";





const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_VOICES_STATES"
    ]
})

client.slashcommand =new Discord.Collection()
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

let command = []

const slashFIles = fs.readdirSync("./slash").filter(file.enfsWith(".js"))
for (const file of slashFiles) {
    const slashcmd = require('./slash/${file}')
    client.slashcommands.set(slashcmd.data.name, slashcmd )
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

if (LOAD_SLASH) {
    const rest = new REST({version :"9" }).setToken(TOKEN)
    console.log("Deployeando slash commands")
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: commands})
    .then(() => {
        console.log("se cargo con exito")
        process.exit(0)
    })
    .catch((err) => {
        if (err){
            console.log(err)
            process.exit(1)
        }
    })
}
else{
    client.on("ready",()=> {
        console.log('Logeado como ${client.user.tag}')
    })
    client.on('interactionCreate', (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return
            const slashcmd = client.slashcommands.get(interaction.commandName)
            if (!slashcmd) interaction.reply ("No es un comando valido")

            await interaction.deferReply()
            await slashcmd.run({client, interaction})
        }
        handleCommand()
    })
    client.log(TOKEN)
}




client.on("ready", () => {
    console.log('VIVA LA PATRIA PERONISTA')
})

client.on("messageCreate", (message) => {
    if (message.content == "PERON") {
        message.reply("VIVA!!!!")
    }
})

  
    



client.login(TOKEN);
