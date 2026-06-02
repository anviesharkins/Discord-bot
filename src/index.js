import 'dotenv/config';
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, Events } from 'discord.js';
import { runLuauCommand } from './luauRunner.js';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;
const prefix = process.env.BOT_PREFIX || '!';

if (!token) {
  throw new Error('Faltou DISCORD_TOKEN no ambiente. Coloque no Railway ou no arquivo .env.');
}

if (!clientId) {
  throw new Error('Faltou DISCORD_CLIENT_ID no ambiente. Pegue o Application ID no Discord Developer Portal.');
}

const slashCommands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Testa se o bot está online.'),
].map((command) => command.toJSON());

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(token);

  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: slashCommands,
    });
    console.log('Comandos slash registrados no servidor de teste.');
    return;
  }

  await rest.put(Routes.applicationCommands(clientId), {
    body: slashCommands,
  });
  console.log('Comandos slash globais registrados. Podem demorar para aparecer.');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Bot online como ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const payload = {
    type: 'slash',
    commandName: interaction.commandName,
    userId: interaction.user.id,
    username: interaction.user.username,
    guildId: interaction.guildId,
    channelId: interaction.channelId,
  };

  await interaction.deferReply();
  const result = await runLuauCommand(interaction.commandName, payload);
  await interaction.editReply(result.content.slice(0, 2000));
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const [rawCommandName, ...args] = message.content.slice(prefix.length).trim().split(/\s+/);
  const commandName = rawCommandName?.toLowerCase();
  if (!commandName) return;

  const payload = {
    type: 'prefix',
    commandName,
    args,
    content: message.content,
    userId: message.author.id,
    username: message.author.username,
    guildId: message.guildId,
    channelId: message.channelId,
  };

  const result = await runLuauCommand(commandName, payload);
  await message.reply(result.content.slice(0, 2000));
});

await registerCommands();
await client.login(token);
