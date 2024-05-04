const Discord = require("discord.js")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });
const db = new JsonDatabase({ databasePath:"./databases/gifts.json" });

module.exports =  {
    name: "resgatar",
    description: "Resgatar um gift card.",
    type: "CHAT_INPUT",
    options: [{
        name: 'gift',
        type: "STRING",
        description: 'Selecione o serviço.',
        required: true,
      }],

    run: async(client, interaction, args) => {

      if(args[0] !== `${db.get(`${args[0]}.idgift`)}`) return interaction.reply({ content : `❌  | Gift inválido!`, ephemeral: true})
      if(`${db.get(`${args[0]}.status`)}` == `Resgatado`) return interaction.reply({ content :`❌  | Gift já resgatado!`, ephemeral: true})
      var texto = ""
      var quant = 1
      var estoque = `${db.get(`${args[0]}.estoque`)}`.split(',');
            
      for(let i in estoque) {
        texto = `${texto}${quant}° | ${estoque[i]}\n`
        quant++
      }
      
      db.set(`${args[0]}.status`, `Resgatado`)
      db.delete(`${args[0]}.estoque`)
      interaction.reply(`✅ | Resgatado com sucesso!`)



      const embed = new Discord.MessageEmbed()
          .setTitle(`${config.get(`title`)} | Gift Resgatado`)
          .addField(`🎁 Presentes:`, `\`\`\`${texto}\`\`\``)
          .addField(`💻 Gift:`, `${args[0]}`)
          .setColor(config.get(`color`))
          interaction.user.send({embeds: [embed]})

          
    }
    
  } 

  