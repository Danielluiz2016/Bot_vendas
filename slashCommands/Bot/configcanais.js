const Discord = require("discord.js")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });

module.exports =  {
    name: "configcanais",
    description: "Configurar os canais.",
    type: "CHAT_INPUT",


    run: async(client, interaction, args) => {
      if(interaction.user.id !== `${perms.get(`${interaction.user.id}_id`)}`) return interaction.reply({content: `❌ | Você não tem permissão!`, ephemeral: true})
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('categoriaconfig')
            .setEmoji('⚙')
            .setLabel('Categoria Carrinho')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('logsconfig')
            .setEmoji('⚙')
            .setLabel('Logs Vendas')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('logs2config')
            .setEmoji('⚙')
            .setLabel('Logs Vendas Staff')
            .setStyle('PRIMARY'),
        )
        .addComponents(
            new Discord.MessageButton()
              .setCustomId('cargoconfig')
              .setEmoji('⚙')
              .setLabel('Cargo')
              .setStyle('PRIMARY'),
        );
        
        const embed = await interaction.reply({ embeds: [new Discord.MessageEmbed()
                  .setTitle(`${config.get(`title`)} | Configuração dos canais`)
                  .setDescription(`
⚙| Categoria Carrinho: <#${config.get(`category`)}>
⚙| Logs Vendas: <#${config.get(`logs`)}>
⚙| Logs Vendas Staff: <#${config.get(`logs_staff`)}>
⚙| Cargo Cliente: <@&${config.get(`role`)}>`)
                  .setColor("BLUE")], components: [row]})
        const interação = interaction.channel.createMessageComponentCollector({ componentType: "BUTTON", });
         interação.on("collect", async (interaction) => {
          if (interaction.user.id != interaction.user.id) {
           return;
          }

          if (interaction.customId === "categoriaconfig") {
            interaction.deferUpdate();
            interaction.channel.send("❓ | Qual a nova de categoria dos carrinhos em id?").then(msg => {
             const filter = m => m.author.id === interaction.user.id;
             const collector = msg.channel.createMessageCollector({ filter, max: 1 });
              collector.on("collect", category => {
                category.delete()
                const newt = category.content
                config.set(`category`, newt)
                msg.edit("✅ | Alterado!").then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
                            
                const embednew = new Discord.MessageEmbed()
                  .setTitle(`${config.get(`title`)} | Configuração dos canais`)
                  .setDescription(`
⚙| Categoria Carrinho: <#${config.get(`category`)}>
⚙| Logs Vendas: <#${config.get(`logs`)}>
⚙| Logs Vendas Staff: <#${config.get(`logs_staff`)}>
⚙| Cargo Cliente: <@&${config.get(`role`)}>`)
                  .setColor("BLUE")
                interaction.editReply({ embeds: [embednew] })
                })
              })
            }
           if (interaction.customId === "logsconfig") {
            interaction.deferUpdate();
            interaction.channel.send("❓ | Qual o novo canal de logs de vendas em id?").then(msg => {
             const filter = m => m.author.id === interaction.user.id;
             const collector = msg.channel.createMessageCollector({ filter, max: 1 });
              collector.on("collect", logs => {
                logs.delete()
                const newt = logs.content
                config.set(`logs`, newt)
                msg.edit("✅ | Alterado!").then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
                            
                const embednew = new Discord.MessageEmbed()
                  .setTitle(`${config.get(`title`)} | Configuração dos canais`)
                  .setDescription(`
⚙| Categoria Carrinho: <#${config.get(`category`)}>
⚙| Logs Vendas: <#${config.get(`logs`)}>
⚙| Logs Vendas Staff: <#${config.get(`logs_staff`)}>
⚙| Cargo Cliente: <@&${config.get(`role`)}>`)
                  .setColor("BLUE")
                interaction.editReply({ embeds: [embednew] })
                })
              })
            }

            if (interaction.customId === "cargoconfig") {
                interaction.deferUpdate();
                interaction.channel.send("❓ | Qual o novo cargo em id?").then(msg => {
                  const filter = i => i.author.id === interaction.user.id;
                  const collector = msg.channel.createMessageCollector({ filter, max: 1 });
                    collector.on("collect", role => {
                     role.delete()
                     const newt = role.content
                     config.set(`role`, newt)
                     msg.edit("✅ | Alterado!").then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
                                
                     const embednew = new Discord.MessageEmbed()
                       .setTitle(`${config.get(`title`)} | Configuração do bot`)
                       .setDescription(`
⚙| Categoria Carrinho: <#${config.get(`category`)}>
⚙| Logs Vendas: <#${config.get(`logs`)}>
⚙| Logs Vendas Staff: <#${config.get(`logs_staff`)}>
⚙| Cargo Cliente: <@&${config.get(`role`)}>
`)
                       .setColor("BLUE")
                       interaction.editReply({ embeds: [embednew] })
                     })
                   })
                 }            

          if (interaction.customId === "logs2config") {
            interaction.deferUpdate();
            interaction.channel.send("❓ | Qual o novo canal de logs de vendas staff em id?").then(msg => {
             const filter = m => m.author.id === interaction.user.id;
             const collector = msg.channel.createMessageCollector({ filter, max: 1 });
              collector.on("collect", logs_staff => {
                logs_staff.delete()
                const newt = logs_staff.content
                config.set(`logs_staff`, newt)
                msg.edit("✅ | Alterado!").then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
                            
                const embednew = new Discord.MessageEmbed()
                  .setTitle(`${config.get(`title`)} | Configuração dos canais`)
                  .setDescription(`
⚙| Categoria Carrinho: <#${config.get(`category`)}>
⚙| Logs Vendas: <#${config.get(`logs`)}>
⚙| Logs Vendas Staff: <#${config.get(`logs_staff`)}>
⚙| Cargo Cliente: <@&${config.get(`role`)}>`)
                  .setColor("BLUE")
                interaction.editReply({ embeds: [embednew] })
                })
              })
            }
          })
        }
      };