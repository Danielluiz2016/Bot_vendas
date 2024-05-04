const Discord = require("discord.js")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });
const db = new JsonDatabase({ databasePath:"./databases/myJsonProdutos.json" });

module.exports =  {
    name: "criar",
    description: "Crie um produto.",
    type: "CHAT_INPUT",
    options: [{
        name: 'id',
        type: "STRING",
        description: 'Selecione o serviço.',
        required: true,
      }],
    

    run: async(client, interaction, args) => {
      if(interaction.user.id !== `${perms.get(`${interaction.user.id}_id`)}`) return interaction.reply({content: `❌ | Você não tem permissão!`, ephemeral: true})
      if(args[0] === `${db.get(`${args[0]}.idproduto`)}`) return interaction.reply({content: `❌ | Esse ID de produto já é existente!`, ephemeral: true})

      const row = new Discord.MessageActionRow()               
        .addComponents(
          new Discord.MessageButton()
            .setCustomId(args[0])
            .setLabel('Comprar')
            .setEmoji("🛒")
            .setStyle('SUCCESS'),
      );
       
      const adici = new Discord.MessageEmbed()
        .setTitle(`${config.get(`title`)} | Bot Store`)
        .setImage(config.get(`banner`))
        .setDescription(`
\`\`\`
Sem descrição ainda...
\`\`\`
**🌍 | Nome:** __Sem nome ainda...__
**💸 | Preço:** __10__
**📦 | Estoque:** __0__`)
        .setColor(config.get(`color`))
        .setThumbnail(client.user.displayAvatarURL())
        interaction.reply({ content: `✅ | Produto setado com sucesso! `, ephemeral: true})
        interaction.channel.send({embeds: [adici], components: [row]})
        
      const idproduto = args[0]
        db.set(`${idproduto}.idproduto`, `${idproduto}`)
        db.set(`${idproduto}.nome`, `Sem nome ainda...`) 
        db.set(`${idproduto}.desc`, `Sem descrição ainda...`) 
        db.set(`${idproduto}.preco`, `10`) 

        db.push(`${idproduto}.conta`, `${idproduto}`)
        const a = db.get(`${idproduto}.conta`);
        const removed = a.splice(0, 1);
        db.set(`${idproduto}.conta`, a);
       }
     }