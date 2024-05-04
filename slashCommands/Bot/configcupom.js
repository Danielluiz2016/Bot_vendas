const Discord = require("discord.js")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });
const db = new JsonDatabase({ databasePath:"./databases/myJsonCupons.json" });

module.exports =  {
    name: "config-cupom",
    description: "configure um cupom.",
    type: "CHAT_INPUT",
    options: [{
        name: 'id',
        type: "STRING",
        description: 'Selecione um id.',
        required: true,
      }],

    run: async(client, interaction, args) => {

      if(interaction.user.id !== `${perms.get(`${interaction.user.id}_id`)}`) return interaction.reply({content: `❌ | Você não tem permissão!`, ephemeral: true})
        if(args[0] !== `${db.get(`${args[0]}.idcupom`)}`) return interaction.reply({content:`❌ | Esse ID de cupom não é existente!`, ephemeral: true})
        
      const adb = args[0];
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('qtdcupom')
            .setEmoji('📦')
            .setLabel('Quantidade')
            .setStyle('SUCCESS'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('mincupom')
            .setEmoji('💸')
            .setLabel('Valor Mínimo')
            .setStyle('SUCCESS'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('pctcupom')
            .setEmoji('🛒')
            .setLabel('Porcentagem')
            .setStyle('SUCCESS'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('delcupom')
            .setEmoji('❌')
            .setLabel('Excluir')
            .setStyle('DANGER'),
        )

        
        const embed5 = new Discord.MessageEmbed()
          .setTitle(`${config.get(`title`)} | Configurando o(a) ${adb}`)
          .setDescription(`
🌍 | Nome: ${db.get(`${adb}.idcupom`)}     
📦 | Quantidade: ${db.get(`${adb}.quantidade`)}
💸 | Valor Mínimo: ${db.get(`${adb}.minimo`)} Reais
🛒 | Porcentagem: ${db.get(`${adb}.desconto`)}%`)
          .setThumbnail(client.user.displayAvatarURL())
          .setColor("BLUE")

          interaction.reply({ embeds: [embed5], components: [row]})

        const interação = interaction.channel.createMessageComponentCollector({ componentType: "BUTTON", })
        interação.on("collect", async (interaction) => {
         if (interaction.user.id != interaction.user.id) {
          return;
         }
                
         if (interaction.customId === "delcupom") {
          interaction.channel.bulkDelete(1);
           interaction.channel.send("✅ | Excluido!")
           db.delete(`${adb}`)
         }
         if (interaction.customId === "qtdcupom") {
             interaction.deferUpdate();
             interaction.channel.send("❓ | Qual a nova quantidade de usos?").then(msg => {
               const filter = m => m.author.id === interaction.user.id;
               const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", message => {
                 message.delete()
                 if (isNaN(message.content)) return msg.edit("❌ | Não coloque nenhum caractere especial além de números.")
                 db.set(`${adb}.quantidade`, `${message.content}`)
                 const embed = new Discord.MessageEmbed()
                 .setTitle(`${config.get(`title`)} | Configurando o(a) ${adb}`)
                 .setDescription(`
🌍 | Nome: ${db.get(`${adb}.idcupom`)}     
📦 | Quantidade: ${db.get(`${adb}.quantidade`)}
💸 | Valor Mínimo: ${db.get(`${adb}.minimo`)} Reais
🛒 | Porcentagem: ${db.get(`${adb}.desconto`)}%`)
                 .setThumbnail(client.user.displayAvatarURL())
                 .setColor("BLUE")
               interaction.editReply({ embeds: [embed] })
                 msg.edit("✅ | Alterado!").then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
             })
           })
         }
         if (interaction.customId === "mincupom") {
             interaction.deferUpdate();
             interaction.channel.send("❓ | Qual o novo mínimo para uso em reais?").then(msg => {
               const filter = m => m.author.id === interaction.user.id;
               const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", message => {
                 message.delete()
                 db.set(`${adb}.minimo`, `${message.content.replace(",", ".")}`)
                 const embed = new Discord.MessageEmbed()
                 .setTitle(`${config.get(`title`)} | Configurando o(a) ${adb}`)
                 .setDescription(`
🌍 | Nome: ${db.get(`${adb}.idcupom`)}     
📦 | Quantidade: ${db.get(`${adb}.quantidade`)}
💸 | Valor Mínimo: ${db.get(`${adb}.minimo`)} Reais
🛒 | Porcentagem: ${db.get(`${adb}.desconto`)}%`)
                 .setThumbnail(client.user.displayAvatarURL())
                 .setColor("BLUE")
               interaction.editReply({ embeds: [embed] })
                 msg.edit("✅ | Alterado!").then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
             })
           })
         }
         if (interaction.customId === 'pctcupom') {
             interaction.deferUpdate();
             interaction.channel.send("❓ | Qual o novo desconto em porcentagem?").then(msg => {
               const filter = m => m.author.id === interaction.user.id;
               const collector = msg.channel.createMessageCollector({ filter, max: 1 });
               collector.on("collect", message => {
                 message.delete()
                 if(isNaN(message.content)) return msg.edit("❌ | Não coloque nenhum caractere especial além de números.")
                 db.set(`${adb}.desconto`, `${message.content}`)
                 const embed = new Discord.MessageEmbed()
                 .setTitle(`${config.get(`title`)} | Configurando o(a) ${adb}`)
                 .setDescription(`
🌍 | Nome: ${db.get(`${adb}.idcupom`)}     
📦 | Quantidade: ${db.get(`${adb}.quantidade`)}
💸 | Valor Mínimo: ${db.get(`${adb}.minimo`)} Reais
🛒 | Porcentagem: ${db.get(`${adb}.desconto`)}%`)
                 .setThumbnail(client.user.displayAvatarURL())
                 .setColor("BLUE")
               interaction.editReply({ embeds: [embed] })
                 msg.edit("✅ | Alterado!").then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
             })
           })
         }
         if (interaction.customId === 'relcupom') {
           interaction.deferUpdate();
           const embed = new Discord.MessageEmbed()
             .setTitle(`${config.get(`title`)} | Configurando o(a) ${adb}`)
             .setDescription(`
🌍 | Nome: ${db.get(`${adb}.idcupom`)}     
📦 | Quantidade: ${db.get(`${adb}.quantidade`)}
💸 | Valor Mínimo: ${db.get(`${adb}.minimo`)} Reais
🛒 | Porcentagem: ${db.get(`${adb}.desconto`)}%`)
             .setThumbnail(client.user.displayAvatarURL())
             .setColor("BLUE")
           interaction.editReply({ embeds: [embed] })
           interaction.channel.send("✅ | Atualizado!")
             }
           })
         }
       }