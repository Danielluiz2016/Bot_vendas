const Discord = require("discord.js")
const { JsonDatabase, } = require("wio.db");
const db = new JsonDatabase({ databasePath:"./databases/myJsonProdutos.json" });
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });
module.exports =  {
    name: "stockid",
    description: "Stock de alguma produto.",
    type: "CHAT_INPUT",
    options: [{
        name: 'id',
        type: "STRING",
        description: 'Selecione um id.',
        required: true,
      }],
    run: async(client, interaction, args) => {
        if(interaction.user.id !== `${perms.get(`${interaction.user.id}_id`)}`) return interaction.reply({content: `❌ | Você não tem permissão!`, ephemeral: true})
        if(args[0] !== `${db.get(`${args[0]}.idproduto`)}`) return interaction.reply({content: `❌ | Esse produto não é existe!`, ephemeral: true})

const itens = db.get(`${args[0]}.conta`);
const embed = new Discord.MessageEmbed()
.setTitle(`Mostrando Estoque de: ${args[0]}`)
.setDescription(`\`\`\`${itens.join(" \n") || "Sem estoque"}\`\`\``)
.setColor(config.get(`color`))
interaction.reply({embeds: [embed], ephemeral: true})
    }
}