const Discord = require("discord.js")
const { JsonDatabase, } = require("wio.db");
const wio = require("wio.db");
const { embn, embp, embq } = require("../../index")
const config = new JsonDatabase({ databasePath:"./config.json" });
const db = new JsonDatabase({ databasePath:"./databases/myJsonDatabase.json" });

module.exports =  {
    name: "rank",
    description: "Veja o ranking de usuários no servidor",
    type: "CHAT_INPUT",
    

    run: async(client, interaction, args) => {

      var grana = db.all().filter(i => i.data.gastosaprovados).sort((a, b) => b.data.gastosaprovados - a.data.gastosaprovados);
      var texto = ""
      if(grana.length < 5) return interaction.reply(`Você **não tem** clientes o suficiente, atualmente temos **apenas ${grana.length}/5** clientes.`, interaction)
      
      for (var i in grana) {
        let pos = grana.indexOf(grana[i]) + 1
        let emoji = `💸`
        let user = client.users.cache.get(grana[i].ID) ? client.users.cache.get(grana[i].ID).id : "Desconhecido#0000"
        texto += `${pos}º | <@${user}> - R$ ${grana[i].data.gastosaprovados} ${emoji}\n`
      }
        
      const rank = new Discord.MessageEmbed()
        .setTitle(`${client.user.username} | Ranking de Clientes`)
        .setDescription(texto.split("\n11º ")[0])
        .setColor(config.get(`color`))
        .setThumbnail(client.user.displayAvatarURL())
        interaction.reply({ embeds: [rank] });
  }
}
