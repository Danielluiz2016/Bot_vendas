const Discord = require("discord.js")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });
const db = new JsonDatabase({ databasePath:"./databases/myJsonProdutos.json" });

module.exports =  {
    name: "setar",
    description: "Setar algum produto.",
    type: "CHAT_INPUT",
    options: [{
        name: 'id',
        type: "STRING",
        description: 'Selecione o serviço.',
        required: true,
      }],
    

    run: async(client, interaction, args) => {
      if(interaction.user.id !== `${perms.get(`${interaction.user.id}_id`)}`) return interaction.reply({content: `❌ | Você não tem permissão!`, ephemeral: true})
      if(args[0] !== `${db.get(`${args[0]}.idproduto`)}`) return interaction.reply({content: `❌ | Esse produto não é existe!`, ephemeral: true})

      const row = new Discord.MessageActionRow()               
        .addComponents(
          new Discord.MessageButton()
            .setCustomId(args[0])
            .setLabel('Comprar')
            .setEmoji("🛒")
            .setStyle('SUCCESS'),
      );
        
      const embed = new Discord.MessageEmbed()
        .setTitle(`${config.get(`title`)} | Bot Store`)
        .setDescription(`
\`\`\`
${db.get(`${args[0]}.desc`)}
\`\`\`
**🌍 | Nome:** __${db.get(`${args[0]}.nome`)}__
**💸 | Preço:** __R$${db.get(`${args[0]}.preco`)}__
**📦 | Estoque:** __${db.get(`${args[0]}.conta`).length}__`)
        .setColor(config.get(`color`))
        .setImage(config.get(`banner`))
        .setThumbnail(client.user.displayAvatarURL())
        interaction.reply({ content: `✅ | Produto setado com sucesso! `, ephemeral: true})
        interaction.channel.send({embeds: [embed], components: [row]})
    }
}