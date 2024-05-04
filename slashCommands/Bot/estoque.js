const Discord = require("discord.js")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });
const db = new JsonDatabase({ databasePath:"./databases/myJsonProdutos.json" });

module.exports =  {
    name: "estoque",
    description: "Ver o estoque.",
    type: "CHAT_INPUT",
    options: [{
        name: 'id',
        type: "STRING",
        description: 'Selecione um id.',
        required: true,
      }],
    run: async(client, interaction, args) => {
      if(interaction.user.id !== `${perms.get(`${interaction.user.id}_id`)}`) return interaction.reply({content: `❌ | Você não tem permissão!`, ephemeral: true})
        if(args[0] !== `${db.get(`${args[0]}.idproduto`)}`) return interaction.reply({content: `❌ | Esse ID de produto não é existente!`, ephemeral: true})

      const adb = args[0];
      const itens = db.get(`${adb}.conta`);
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('addestoque')
            .setEmoji('➕')
            .setLabel('Adicionar')
            .setStyle('SUCCESS'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('remestoque')
            .setEmoji('➖')
            .setLabel('Remover')
            .setStyle('SECONDARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('bckestoque')
            .setEmoji('📖')
            .setLabel('Backup')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('clestoque')
            .setEmoji('🧹')
            .setLabel('Limpar')
            .setStyle('DANGER'),
        )

        
        const embed = new Discord.MessageEmbed()
        .setTitle(`${config.get(`title`)} | Gerenciando o(a) ${adb}`)
        .setDescription(`
💻 | Descrição: ${db.get(`${adb}.desc`)}
🌍 | Nome: ${db.get(`${adb}.nome`)}
💸 | Preço: ${db.get(`${adb}.preco`)} Reais
📦 | Estoque: ${db.get(`${adb}.conta`).length}`)
        .setThumbnail(client.user.displayAvatarURL())
        .setColor(config.get(`color`))

        interaction.reply({ embeds: [embed], components: [row]})



    
        const interação = interaction.channel.createMessageComponentCollector({
            componentType: "BUTTON",
         })

         interação.on("collect", async (interaction) => {
             if (interaction.user.id != interaction.user.id) {
               return;
             }
                
             if (interaction.customId === "addestoque") {
              interaction.deferUpdate();
              interaction.channel.send("❓ | Envie os novos produtos no chat!").then(msg => {
               const filter = m => m.author.id === interaction.user.id;
               const collector = msg.channel.createMessageCollector({ filter })
               collector.on("collect", message => {
                  const content = message.content.split('\n');
                  const contasnb = message.content.split('\n').length;
                  var contas = content;
                  var etapa = 0;
                  var etapaf = contasnb;
                  collector.stop();
                  message.delete()
                  const timer = setInterval(async function() {
                  if(etapa === etapaf) {
                    const embed = new Discord.MessageEmbed()
           .setTitle(`${config.get(`title`)} | Gerenciando o(a) ${adb}`)
           .setDescription(`
💻 | Descrição: ${db.get(`${adb}.desc`)}
🌍 | Nome: ${db.get(`${adb}.nome`)}
💸 | Preço: ${db.get(`${adb}.preco`)} Reais
📦 | Estoque: ${db.get(`${adb}.conta`).length}`)
           .setThumbnail(client.user.displayAvatarURL())
           .setColor(config.get(`color`))
           interaction.editReply({ embeds: [embed] })
                   msg.edit(`✅ | Pronto, \`${etapaf}\`\ Produtos foram adicionados com sucesso!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
                   clearInterval(timer)
                   return;
                  }
                  const enviando = contas[etapa];
                  db.push(`${adb}.conta`, `${enviando}`)
                  etapa = etapa + 1
                }, 100)   
             })
           })
         }
   if (interaction.customId === "remestoque") {
     interaction.deferUpdate();
     interaction.channel.send("❓ | Envie a linha do produto que você quer remover!").then(msg => {
      const filter = m => m.author.id === interaction.user.id;
      const collector = msg.channel.createMessageCollector({ filter, max: 1 })
       collector.on("collect", interaction1 => {
          const a = db.get(`${adb}.conta`);
          a.splice(interaction1.content, 1)
          db.set(`${adb}.conta`, a);
          interaction1.delete()
          const embed = new Discord.MessageEmbed()
          .setTitle(`${config.get(`title`)} | Gerenciando o(a) ${adb}`)
          .setDescription(`
💻 | Descrição: ${db.get(`${adb}.desc`)}
🌍 | Nome: ${db.get(`${adb}.nome`)}
💸 | Preço: ${db.get(`${adb}.preco`)} Reais
📦 | Estoque: ${db.get(`${adb}.conta`).length}`)
          .setThumbnail(client.user.displayAvatarURL())
          .setColor(config.get(`color`))
          interaction.editReply({ embeds: [embed] })
          msg.edit(`✅ | O Produto número \`${interaction1}\`\ foi removido com sucesso!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
        })
      })
    }
   if (interaction.customId === 'clestoque') {
     interaction.deferUpdate();

     const a = db.get(`${adb}.conta`);
     const removed = a.splice(0, `${db.get(`${adb}.conta`).length}`);
      db.set(`${adb}.conta`, a);
      interaction.channel.send("✅ | Estoque limpo!").then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
    }
   if (interaction.customId === 'bckestoque') {
        interaction.deferUpdate();
        interaction.channel.send("✅ | Enviado com sucesso!").then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
        var quantia = 1;
        var contas = `${db.get(`${adb}.conta`)}`.split(',');
        var backup = `${contas.join(`\n `)}`
        const embed = new Discord.MessageEmbed()
        .setTitle(`${config.get(`title`)} | Backup feito`)
        .setDescription(`\`\`\`${backup} \`\`\``)
        .setColor(config.get(`color`))
        interaction.user.send({embeds: [embed] })
      }
                
    if (interaction.customId === 'rlestoque') {
        interaction.deferUpdate();
         const embed = new Discord.MessageEmbed()
           .setTitle(`${config.get(`title`)} | Gerenciando o(a) ${adb}`)
           .setDescription(`
💻 | Descrição: ${db.get(`${adb}.desc`)}
🌍 | Nome: ${db.get(`${adb}.nome`)}
💸 | Preço: ${db.get(`${adb}.preco`)} Reais
📦 | Estoque: ${db.get(`${adb}.conta`).length}`)
           .setThumbnail(client.user.displayAvatarURL())
           .setColor(config.get(`color`))
           interaction.editReply({ embeds: [embed] })
           interaction.channel.send("✅ | Atualizado!").then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
                }
              })
            }
          }