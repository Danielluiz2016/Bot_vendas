const Discord = require("discord.js");
const ms = require("ms");
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });
const db = new JsonDatabase({ databasePath:"./databases/myJsonProdutos.json" });

module.exports =  {
    name: "config",
    description: "Configure um produto.",
    type: "CHAT_INPUT",
    options: [{
        name: 'id',
        type: "STRING",
        description: 'Selecione um id.',
        required: true,
      }],
    run: async(client, interaction, args) => {
        if(interaction.user.id !== `${perms.get(`${interaction.user.id}_id`)}`) return interaction.reply({content: `❌ | Você não tem permissão!`, ephemeral: true})
        if(args[0] !== `${db.get(`${args[0]}.idproduto`)}`) return interaction.reply({content: `❌ | Esse produto não existe!`, ephemeral: true})
        
        const adb = args[0];
        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('descgerenciar')
                    .setEmoji('📖')
                    .setLabel('Descrição')
                    .setStyle('SUCCESS'),
            )
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('nomegerenciar')
                    .setEmoji('🌍')
                    .setLabel('Nome')
                    .setStyle('SUCCESS'),
            )
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('precogerenciar')
                    .setEmoji('💸')
                    .setLabel('Preço')
                    .setStyle('SUCCESS'),
            )
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('deletegerenciar')
                    .setEmoji('🚯')
                    .setLabel('Excluir')
                    .setStyle('DANGER'),
            )
            

    
        const embed1 = new Discord.MessageEmbed()
            .setTitle(`${config.get(`title`)} | Configurando o(a) ${adb}`)
            .setDescription(`
📖 | Descrição: \`\`\`${db.get(`${adb}.desc`)}\`\`\`
🚨 | Id: ${db.get(`${adb}.idproduto`)}
🌍 | Nome: ${db.get(`${adb}.nome`)}
💸 | Preço: R$${db.get(`${adb}.preco`)} 
📦 | Estoque: ${db.get(`${adb}.conta`).length}`)
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(config.get(`color`))
            
             interaction.reply({embeds: [embed1],components: [row]})
        
            const interação = interaction.channel.createMessageComponentCollector({
               componentType: "BUTTON",
            })
  
            interação.on("collect", async (interaction) => {
                if (interaction.user.id != interaction.user.id) {
                  return;
                }
                
                if (interaction.customId === "precogerenciar") {
                   interaction.deferUpdate();
                   interaction.channel.send("❓ | Qual o novo preço?").then(msg => {
                        const filter = m => m.author.id === interaction.user.id;
                        const collector = msg.channel.createMessageCollector({ filter, max: 1 });
                        collector.on("collect", message => {
                            message.delete()
                            db.set(`${adb}.preco`, `${message.content.replace(",", ".")}`)
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`${config.get(`title`)} | Configurando o(a) ${adb}`)
                            .setDescription(`
📖 | Descrição: \`\`\`${db.get(`${adb}.desc`)}\`\`\`
🚨 | Id: ${db.get(`${adb}.idproduto`)}
🌍 | Nome: ${db.get(`${adb}.nome`)}
💸 | Preço: R$${db.get(`${adb}.preco`)}
📦 | Estoque: ${db.get(`${adb}.conta`).length}`)
                            .setThumbnail(client.user.displayAvatarURL())
                            .setColor(config.get(`color`))
                            interaction.editReply({ embeds: [embed] })
                            msg.edit(`✅ | Descrição alterada para \`R$${db.get(`${adb}.preco`)}\``).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
                        })
                    })
                }
                if (interaction.customId === "nomegerenciar") {
        interaction.deferUpdate();
              interaction.channel.send("❓ | Qual o novo nome?").then(msg => {
                        const filter = m => m.author.id === interaction.user.id;
                        const collector = msg.channel.createMessageCollector({ filter, max: 1 });
                        collector.on("collect", message => {
                            message.delete()
                            db.set(`${adb}.nome`, `${message.content}`)
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`${config.get(`title`)} | Configurando o(a) ${adb}`)
                            .setDescription(`
📖 | Descrição: \`\`\`${db.get(`${adb}.desc`)}\`\`\`
🚨 | Id: ${db.get(`${adb}.idproduto`)}
🌍 | Nome: ${db.get(`${adb}.nome`)}
💸 | Preço: R$${db.get(`${adb}.preco`)} 
📦 | Estoque: ${db.get(`${adb}.conta`).length}`)
                            .setThumbnail(client.user.displayAvatarURL())
                            .setColor(config.get(`color`))
                            interaction.editReply({ embeds: [embed] })
                            msg.edit(`✅ | Descrição alterada para \`${db.get(`${adb}.nome`)}\``).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
                        })
                    })
                }
    if (interaction.customId === 'descgerenciar') {
        interaction.deferUpdate();
        interaction.channel.send("❓ | Qual a nova descrição?").then(msg => {
                        const filter = m => m.author.id === interaction.user.id;
                        const collector = msg.channel.createMessageCollector({ filter, max: 1 });
                        collector.on("collect", message => {
                            message.delete()
                            db.set(`${adb}.desc`, `${message.content}`)
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`${config.get(`title`)} | Configurando o(a) ${adb}`)
                            .setDescription(`
📖 | Descrição: \`\`\`${db.get(`${adb}.desc`)}\`\`\`
🚨 | Id: ${db.get(`${adb}.idproduto`)}
🌍 | Nome: ${db.get(`${adb}.nome`)}
💸 | Preço: R$${db.get(`${adb}.preco`)} 
📦 | Estoque: ${db.get(`${adb}.conta`).length}`)
                            .setThumbnail(client.user.displayAvatarURL())
                            .setColor(config.get(`color`))
                            interaction.editReply({ embeds: [embed] })
                            msg.edit(`✅ | Descrição alterada para \`${db.get(`${adb}.desc`)}\``).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
                        })
                    })
                }

                if (interaction.customId === "deletegerenciar") {

                    interaction.channel.bulkDelete(1);
                       interaction.channel.send("✅ | Excluido!").then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
                       db.delete(adb)
                   }      
                })
            }}