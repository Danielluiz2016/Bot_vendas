const Discord = require("discord.js")
const { JsonDatabase, } = require("wio.db");
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });

module.exports =  {
    name: "limpar",
    description: "Limpar mensagens.",
    type: "CHAT_INPUT",
    

    run: async(client, interaction, args) => {
      if(interaction.user.id !== `${perms.get(`${interaction.user.id}_id`)}`) return interaction.reply({content: `❌ | Você não tem permissão!`, ephemeral: true})
      setTimeout(() => interaction.channel.bulkDelete(100).catch(err => {
      }), 400)
       return interaction.reply({ content: `✅ | Mesangens Deletadas!`, ephemeral: true})

      }
   }
