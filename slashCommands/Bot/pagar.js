const Discord = require("discord.js")
const { JsonDatabase, } = require("wio.db");
const db3 = new JsonDatabase({ databasePath:"./databases/myJsonIDs.json" });
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });

module.exports =  {
    name: "aprovar",
    description: "Aprovar alguma compra.",
    type: "CHAT_INPUT",
    options: [{
        name: 'id',
        type: "STRING",
        description: 'Selecione um id.',
        required: true,
      }],

    run: async(client, interaction, args) => {
      if(interaction.user.id !== `${perms.get(`${interaction.user.id}_id`)}`) return interaction.reply({content: `❌ | Você não tem permissão!`, ephemeral: true})
      if(args[0] !== `${db3.get(`${args[0]}.id`)}`) return interaction.reply({content:`❌ | Esse ID de compra não existe!`, ephemeral: true})
      if(`${db3.get(`${args[0]}.status`)}` === `Concluido`) return interaction.reply({content:`❌ | Esse ID de compra já foi marcado como pago!`, ephemeral: true})
      if(`${db3.get(`${args[0]}.status`)}` !== `Pendente (2)`) return interaction.reply({content:`❌ | Esse ID de compra não pode ser marcado como pago no momento, aguarde até a segunda etapa de pendência!`, ephemeral: true})
    
      const id = args[0]
      db3.set(`${id}.status`, `Processando`)
      interaction.reply("✅ | Status de compra alterado para pago!").then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
    }
}