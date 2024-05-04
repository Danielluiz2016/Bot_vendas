const Discord = require("discord.js")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });

module.exports =  {
    name: "configbot",
    description: "Configurar o bot.",
    type: "CHAT_INPUT",
    

    run: async(client, interaction, args) => {
      if(interaction.user.id !== `${perms.get(`${interaction.user.id}_id`)}`) return interaction.reply({content: `❌ | Você não tem permissão!`, ephemeral: true})

      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('nomeconfig')
            .setEmoji('⚙')
            .setLabel('Nome')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('corconfig')
            .setEmoji('⚙')
            .setLabel('Cor')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('avatarconfig')
            .setEmoji('⚙')
            .setLabel('Avatar')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('bannerconfig')
            .setEmoji('⚙')
            .setLabel('Banner')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('tokenconfig')
            .setEmoji('🤝')
            .setLabel('Token Mp')
            .setStyle('PRIMARY'),
        );
        
        const embed = await interaction.reply({ embeds: [new Discord.MessageEmbed()
          .setTitle(`${config.get(`title`)} | Configuração do bot`)
          .setDescription(`
⚙ | Nome: **${config.get(`title`)}**
⚙ | Cor: ${config.get(`color`)}
⚙ | Avatar: [Clique aqui](${config.get(`thumbnail`)})
⚙ | Banner: [Clique aqui](${config.get(`banner`)})
🤝 | Token Mercado Pago: \`\Token Seguro\``)
          .setColor("BLUE")], components: [row]})
        const interação = interaction.channel.createMessageComponentCollector({
            componentType: 'BUTTON',
          });
          interação.on("collect", async (interaction) => {
           if (interaction.user.id != interaction.user.id) {
             return;
           }

           if (interaction.customId === "nomeconfig") {
            interaction.deferUpdate();
            interaction.channel.send("❓ | Qual o novo nome?").then(msg => {
              const filter = m => m.author.id === interaction.user.id;
              const collector = interaction.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", title => {
                 title.delete()
                 client.user.setUsername(title.content);
                 const newt = title.content
                 config.set(`title`, newt)
                 msg.edit("✅ | Alterado!").then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
                            
                 const embednew = new Discord.MessageEmbed()
                   .setTitle(`${config.get(`title`)} | Configuração do bot`)
                   .setDescription(`
⚙ | Nome: **${config.get(`title`)}**
⚙ | Cor: ${config.get(`color`)}
⚙ | Avatar: [Clique aqui](${config.get(`thumbnail`)})
⚙ | Banner: [Clique aqui](${config.get(`banner`)})
🤝  | Token Mercado Pago: \`\Token Seguro\``)
                   .setColor("BLUE")
                   interaction.editReply({ embeds: [embednew] })
                 })
               })
             }

             if (interaction.customId === "tokenconfig") {
              interaction.deferUpdate();
              interaction.channel.send("❓ | Qual o novo access token do seu mp?").then(msg => {
               const filter = m => m.author.id === interaction.user.id;
               const collector = msg.channel.createMessageCollector({ filter, max: 1 });
                 collector.on("collect", access_token => {
                   access_token.delete()
                   const newt = access_token.content
                   config.set(`access_token`, newt)
                   msg.edit("✅ | Alterado!").then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));

                   const embednew = new Discord.MessageEmbed()
                   .setTitle(`${config.get(`title`)} | Configuração do bot`)
                   .setDescription(`
⚙ | Nome: **${config.get(`title`)}**
⚙ | Cor: ${config.get(`color`)}
⚙ | Avatar: [Clique aqui](${config.get(`thumbnail`)})
⚙ | Banner: [Clique aqui](${config.get(`banner`)})
🤝 | Token Mercado Pago: \`\Token Seguro\``)
                   .setColor("BLUE")
                   interaction.editReply({ embeds: [embednew] })
                 })
               })
             }       
           if (interaction.customId === "corconfig") {
            interaction.deferUpdate();
            interaction.channel.send("❓ | Qual a nova cor em hex?").then(msg => {
              const filter = i => i.author.id === interaction.user.id;
              const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", color => {
                 color.delete()
                 const newt = color.content
                 config.set(`color`, newt)
                 msg.edit("✅ | Alterado!").then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
                            
                 const embednew = new Discord.MessageEmbed()
                   .setTitle(`${config.get(`title`)} | Configuração do bot`)
                   .setDescription(`
⚙ | Nome: **${config.get(`title`)}**
⚙ | Cor: ${config.get(`color`)}
⚙ | Avatar: [Clique aqui](${config.get(`thumbnail`)})
⚙ | Banner: [Clique aqui](${config.get(`banner`)})
🤝 | Token Mercado Pago: \`\Token Seguro\``)
                   .setColor("BLUE")
                   interaction.editReply({ embeds: [embednew] })
                 })
               })
             }
           if (interaction.customId === "avatarconfig") {
            interaction.deferUpdate();
            interaction.channel.send("❓ | Qual o novo avatar do bot?").then(msg => {
              const filter = m => m.author.id === interaction.user.id;
              const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", thumbnail => {
                 thumbnail.delete()
                 thumbnail.attachments.forEach(attachment => {
                 const newt = attachment.proxyURL;
                 client.user.setAvatar(newt);
                 config.set(`thumbnail`, newt)});
                 msg.edit("✅ | Alterado!").then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
                            
                 const embednew = new Discord.MessageEmbed()
                   .setTitle(`${config.get(`title`)} | Configuração do bot`)
                   .setDescription(`
⚙ | Nome: **${config.get(`title`)}**
⚙ | Cor: ${config.get(`color`)}
⚙ | Avatar: [Clique aqui](${config.get(`thumbnail`)})
⚙ | Banner: [Clique aqui](${config.get(`banner`)})
🤝 | Token Mercado Pago: \`\Token Seguro\``)
                   .setColor("BLUE")
                   interaction.editReply({ embeds: [embednew] })
                 })
               })
             }

             if (interaction.customId === "bannerconfig") {
              interaction.deferUpdate();
              interaction.channel.send("❓ | Qual a novo banner?").then(msg => {
                const filter = i => i.author.id === interaction.user.id;
                const collector = msg.channel.createMessageCollector({ filter, max: 1 });
                 collector.on("collect", color => {
                   color.delete()
                   const newt = color.content
                   config.set(`banner`, newt)
                   msg.edit("✅ | Alterado!").then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
                              
                   const embednew = new Discord.MessageEmbed()
                     .setTitle(`${config.get(`title`)} | Configuração do bot`)
                     .setDescription(`
  ⚙ | Nome: **${config.get(`title`)}**
  ⚙ | Cor: ${config.get(`color`)}
  ⚙ | Avatar: [Clique aqui](${config.get(`thumbnail`)})
  ⚙ | Banner: [Clique aqui](${config.get(`banner`)})
  🤝 | Token Mercado Pago: \`\Token Seguro\``)
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
⚙ | Nome: **${config.get(`title`)}**
⚙ | Cor: ${config.get(`color`)}
⚙ | Avatar: [Clique aqui](${config.get(`thumbnail`)})
⚙ | Banner: [Clique aqui](${config.get(`banner`)})
🤝 | Token Mercado Pago: \`\Token Seguro\``)
                   .setColor("BLUE")
                   interaction.editReply({ embeds: [embednew] })
                 })
               })
             }
           })
         }
       };