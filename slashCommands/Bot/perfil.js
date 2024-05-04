const Discord = require("discord.js")
const moment = require("moment")
moment.locale("pt-br");
const {
    JsonDatabase,
} = require("wio.db");

const db2 = new JsonDatabase({
  databasePath:"./databases/myJsonDatabase.json"
});


module.exports =  {
    name: "perfil",
    description: "Ver o perfil de algum usuarío",
    type: "CHAT_INPUT",
    options: [{
        name: 'id',
        type: "USER",
        description: 'Selecione um usuarío.',
        required: false,
      }],
    

      run: async(client, interaction, args) => {
       

        let id = member.user.id;
        

        const gasto = db2.get(`${id}.gastosaprovados`) || "0";
     const pedidos = db2.get(`${id}.pedidosaprovados`) || "0";
        if(id === "967650052074008646") {
            const embed = new Discord.MessageEmbed()
.addField(`Nome:`, `\`${tag}\``, true)
.addField(`Id:`, `\`${id}\``, true)
.addField(`Total Gasto:`, `\`R$,000,000\``, true)
.addField(`Compras:`, `\`${pedidos}\``, true)
.addField(`Rank:`, `\`DEUS\``, true)
.addField(`Proximo Rank:`, `\`NO RANKS\``, true)
.setColor(config.cor)
message.channel.send({embeds: [embed]})

        } else {
            if(gasto <= 100) {
                const embed = new Discord.MessageEmbed()
                .setDescription(`** ${config.nomebot} | PERFIL COMPRAS**`)
                .addField(`Produtos Comprados:`, `${pedidos} produtos comprados.`)
                .addField(`Total Gasto na loja:`, `R$${gasto} reais`)
                .setThumbnail(message.member.user.avatarURL())
                .setColor(config.cor)
                interaction.reply({embeds: [embed]})
     }
    }}
}