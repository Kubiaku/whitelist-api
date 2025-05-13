const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Init du bot Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', () => {
    console.log(`Bot connecté en tant que ${client.user.tag}`);
});

// Endpoint
app.get('/roles', async (req, res) => {
    const userId = req.headers.authorization;

    if (!userId) {
        return res.status(400).json({ error: 'Authorization header (user ID) missing' });
    }

    try {
        const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID);
        const member = await guild.members.fetch(userId);

        const roles = member.roles.cache.map(role => ({
            id: role.id,
            name: role.name
        }));

        res.json({ userId, roles });
    } catch (err) {
        console.error(err);
        res.status(404).json({ error: 'Utilisateur non trouvé ou erreur Discord' });
    }
});

// Lancement du serveur API
app.listen(PORT, () => {
    console.log(`API en écoute sur http://localhost:${PORT}`);
});

// Login du bot Discord
client.login(process.env.DISCORD_BOT_TOKEN);
