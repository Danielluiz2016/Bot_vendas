const Discord = require("discord.js")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const perms = new JsonDatabase({ databasePath:"./databases/myJsonPerms.json" });
const db = new JsonDatabase({ databasePath:"./databases/gifts.json" });

module.exports =  {
    name: "criar-gift",
    description: "Criar gift",
    type: "CHAT_INPUT",

  
    run: async (client, interaction, args) => {
      if(interaction.user.id !== `${perms.get(`${interaction.user.id}_id`)}`) return interaction.reply({content: `❌ | Você não tem permissão!`, ephemeral: true})
        function codigo() {
          var gerados = "";
          var codigos = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          for (var i = 0; i < 16; i++) {
            if (i > 0 && i % 4 == 0) gerados += "-";
            gerados += codigos.charAt(Math.floor(Math.random() * codigos.length));
          }
          return gerados;
        }
        
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('concluir')
            .setEmoji('✅')
            .setLabel('Continuar')
            .setStyle('SUCCESS'),
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('cancelar')
            .setEmoji('❌')
            .setLabel('Cancelar')
            .setStyle('DANGER'),
        );
        
        const gerado = codigo()        
        const embed2 = new Discord.MessageEmbed()
          .setTitle(`${config.get(`title`)} | Criação de Gift Card ✨`)
          .addField(`📦 Estoque:`, `Nenhum...`)
          .addField(`💻 Código:`, `${gerado}`)
          .setColor(config.get(`color`))
          await interaction.reply({ embeds: [embed2] , components: [row]})
        const interação = interaction.channel.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: 15000,
          });
          interação.on("collect", async (interaction2) => {
           if (interaction2.user.id != interaction.user.id) {
             return;
           }

           if (interaction2.customId === "concluir") {
            interaction2.deferUpdate()
             const idcodigo = gerado
              db.set(`${idcodigo}.idgift`, `${idcodigo}`)
              db.set(`${idcodigo}.status`, `Disponivel`)
              db.push(`${idcodigo}.estoque`, `${idcodigo}`)
              const a = db.get(`${idcodigo}.estoque`);
              const removed = a.splice(0, 1);
              db.set(`${idcodigo}.estoque`, a);
               
              interaction2.channel.send(`❓ | Envie os novos estoques no chat!`).then(msg => {
             const filter = m => m.author.id === interaction2.user.id;
             const collector = msg.channel.createMessageCollector({ filter, max: 1 });
             collector.on("collect", message => {
               collector.stop();
               message.delete()
               var estoque = message.content.split('\n');            
               for (let i = 0; i != estoque.length; i++) {
                 db.push(`${idcodigo}.estoque`, `${estoque[i]}`)

                 if(i + 1 === estoque.length) {
                   var texto = ""
                   var quant = 1
                   var estoque = `${db.get(`${idcodigo}.estoque`)}`.split(',');
            
                   for(let i in estoque) {
                     texto = `${texto}${quant}° | ${estoque[i]}\n`
                     quant++
                   }
                     
                   row.components[0].setDisabled(true)
                   row.components[1].setDisabled(true)
                   msg.edit(`✅ | Gift \`${gerado}\`\ Criado com sucesso!`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
                   const embednew = new Discord.MessageEmbed()
                     .setTitle(`${config.get(`title`)} | Criação de Gift Card`)
                     .addField(`📦 Estoque:`, `${texto}`)
                     .addField(`💻 Código:`, `${gerado}`)
                     .setColor(config.get(`color`))
                     interaction.editReply({ embeds: [embednew], components: [row] })
                 }
               }
             })
           })
         }
        
           if (interaction.customId === "cancelar") {
             interaction.delete()
             interaction.reply(`✅ | Cancelado...`).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
           }
         })
       }
     };