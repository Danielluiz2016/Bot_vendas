const Discord = require("discord.js")
const wio = require("wio.db");
const config = new wio.JsonDatabase({ databasePath:"./config.json" });
const perms = new wio.JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });
const db1 = new wio.JsonDatabase({ databasePath:"./databases/myJsonProdutos.json" });
const db2 = new wio.JsonDatabase({ databasePath:"./databases/myJsonCupons.json" });
const db3 = new wio.JsonDatabase({ databasePath:"./databases/gifts.json" });


        module.exports =  {
            name: "criados",
            description: "Veja seus Produtos, Cupons e Gifts criados",
            type: "CHAT_INPUT",
            
        
            run: async(client, interaction, args) => {

              if(interaction.user.id !== `${perms.get(`${interaction.user.id}_id`)}`) return interaction.reply({content: `❌ | Você não tem permissão!`, ephemeral: true})
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('db1')
            .setEmoji('🛒')
            .setLabel('Produtos')
            .setStyle('SECONDARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('db2')
            .setEmoji('🌌')
            .setLabel('Cupons')
            .setStyle('SECONDARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('db3')
            .setEmoji('🎁')
            .setLabel('Gifts')
            .setStyle('SECONDARY'),
        )
      
        const embed = new Discord.MessageEmbed()
        .setTitle("Nome Loja | Sistema de Vendas")
          .setDescription(`Escolha o tipo de **serviço** que você deseja ver:`)
          .setColor(config.get(`color`))
         interaction.reply({ embeds: [embed], components: [row] })
        const filter = i => i.user.id === interaction.user.id
        const collector = interaction.channel.createMessageComponentCollector({ filter })
        collector.on("collect", async interaction => {
          if(interaction.customId.startsWith("db")) {
            let dbs = interaction.customId
            let itens
            let local
            let status
            
            if(dbs == "db1") {
              if(db1.all().length == 0) return (`Não há nenhum **produto criado** no momento!`)
              itens = db1.all()
              local = "Produtos"
              status = "nome"
            }
            if(dbs == "db2") {
              if(db2.all().length == 0) return (`Não há nenhum **cupom criado** no momento!`)
              itens = db2.all()
              local = "Cupons"
              status = "desconto"
            }
            if(dbs == "db3") {
              if(db3.all().length == 0) return (`Não há nenhum **gift criado** no momento!`)
              itens = db3.all()
              local = "Gifts"
              status = "status"
            }
              
            let texto = ""
            let quant = 1
      
            for(let i in itens) {
              let item = itens[i]
              let value = item.data[status]
              let extra = local == "Cupons" ? "% de desconto" : ""
              texto += `**${item.ID}** (${value}${extra})\n`
              quant++
            }
        
            const embed = new Discord.MessageEmbed()                       
              .setTitle(`${client.user.username} | ${local} Existentes`)
              .setDescription(texto)
              .setColor(config.get(`color`))
              .setTimestamp()
             interaction.reply({ embeds: [embed], ephemeral: true})
          }
        })
    }
}