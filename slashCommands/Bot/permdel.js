const Discord = require("discord.js")
const { JsonDatabase, } = require("wio.db");
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });
const config = new JsonDatabase({ databasePath:"./config.json" });

module.exports =  {
    name: "permdel",
    description: "Remover pemissão de alguem.",
    type: "CHAT_INPUT",
    options: [{
        name: 'id',
        type: "USER",
        description: 'Selecione o serviço.',
        required: true,
      }],
    

    run: async(client, interaction, args) => {
      const user = args[0]
      if(interaction.user.id !== `${perms.get(`${interaction.user.id}_id`)}`) return interaction.reply({content: `❌ | Você não tem permissão!`, ephemeral: true})
    
      if(user !== `${perms.get(`${user}_id`)}`) return interaction.reply({content:`❌ | Essa pessoa não tem permissão ainda!`, ephemeral: true})
        
      interaction.reply(`✅ | Usuário removido!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
      perms.delete(`${user}_id`)
    }
}