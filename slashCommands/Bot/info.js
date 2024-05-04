const Discord = require("discord.js")
const { JsonDatabase, } = require("wio.db");
const db3 = new JsonDatabase({ databasePath:"./databases/myJsonIDs.json" });
const config = new JsonDatabase({ databasePath:"./config.json" });

module.exports =  {
    name: "info",
    description: "Ver a informação de uma compra.",
    type: "CHAT_INPUT",
    options: [{
        name: 'id',
        type: "STRING",
        description: 'Selecione o serviço.',
        required: true,
      }],


    run: async(client, interaction, args) => {

        let servicoG = interaction.options.getString("id");


              const embederro2 = new Discord.MessageEmbed()
              if(interaction.user.id !== `${perms.get(`${interaction.user.id}_id`)}`) return interaction.reply({content: `❌ | Você não tem permissão!`, ephemeral: true})
              if(args[0] !== `${db3.get(`${args[0]}.id`)}`) return interaction.reply({content:`❌ | Esse ID de compra não é existente!`, ephemeral: true})
                
              const id = args[0]
              const embed = new Discord.MessageEmbed()
                .setTitle(`${config.get(`title`)} | Compra Aprovada`)
                .addField(`❓ | ID Da compra:`, `${db3.get(`${args[0]}.id`)}`)
                .addField(`☀ | Status:`, `${db3.get(`${args[0]}.status`)}`)
                .addField(`👤 | Comprador:`, `<@${db3.get(`${args[0]}.userid`)}>`)
                .addField(`🆔 | Id Comprador:`, `${db3.get(`${args[0]}.userid`)}`)
                .addField(`📅 | Data da compra:`, `${db3.get(`${args[0]}.dataid`)}`)
                .addField(`🛒 | Produto:`, `${db3.get(`${args[0]}.nomeid`)}`)
                .addField(`📦 | Quantidade:`, `${db3.get(`${args[0]}.qtdid`)}`)
                .addField(`💸 | Preço:`, `${db3.get(`${args[0]}.precoid`)}`)
                .setColor(config.get(`color`))
                interaction.reply({embeds: [embed]})
            }
        }