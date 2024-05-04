const Discord = require("discord.js")
const { JsonDatabase, } = require("wio.db");
const perms = new JsonDatabase({ databasePath: "./databases/myJsonPerms.json" });
const config = new JsonDatabase({ databasePath: "./config.json" });

module.exports = {
  name: "donoadd",
  description: "Dono add",
  type: "CHAT_INPUT",
  options: [{
    name: 'id',
    type: "USER",
    description: 'Selecione o serviço.',
    required: true,
  }],


  run: async (client, interaction, args) => {
    const user = args[0]
    if (interaction.user.id !== `1171139558935625751`) // coloque seu ID entre as aspas
    return interaction.reply(`⚡ | Apenas o criador do bot pode usar isso!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
    if (!args[0]) return interaction.reply(`⚡ | Você não selecionou ninguem!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
    if (args[1]) return interaction.reply(`⚡ | Você não pode selecionar duas pessoas de vez!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
    if (user === `${config.get(`owner`)}`) return interaction.reply(`⚡ | Essa pessoa já é o dono do bot!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
    if (isNaN(args)) return interaction.reply(`⚡ | Você só pode adicionar IDs!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));

    interaction.reply(`⚡ | Permissão de dono adicionada!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
    config.set(`owner`, user)
    if (user === `${perms.get(`${user}_id`)}`) return
    else {
      perms.set(`${user}_id`, user)
    }
  }
}