const Discord = require("discord.js")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });
const db = new JsonDatabase({ databasePath:"./databases/myJsonCupons.json" });

module.exports =  {
    name: "criarcupom",
    description: "Crie um cupom.",
    type: "CHAT_INPUT",
    options: [{
        name: 'id',
        type: "STRING",
        description: 'Selecione um id.',
        required: true,
      }],

    run: async(client, interaction, args) => {
      if(interaction.user.id !== `${perms.get(`${interaction.user.id}_id`)}`) return interaction.reply({content: `❌ | Você não tem permissão!`, ephemeral: true})
      if(args[0] === `${db.get(`${args[0]}.idcupom`)}`) return interaction.reply({content:`❌ | Esse ID de cupom já é existente!`, ephemeral: true})
      interaction.reply({content:"✅ | Criado com sucesso!", ephemeral: true})
      const idcupom = args[0]
        db.set(`${idcupom}.idcupom`, `${idcupom}`)
        db.set(`${idcupom}.quantidade`, `0`)
        db.set(`${idcupom}.minimo`, `20`)
        db.set(`${idcupom}.desconto`, `50`)
       }
     }