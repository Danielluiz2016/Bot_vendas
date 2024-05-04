const Discord = require("discord.js")
const { JsonDatabase, } = require("wio.db");
const config = new JsonDatabase({ databasePath:"./config.json" });

module.exports =  {
  name: "ajuda",
  description: "Ver os comandos do bot.",
  type: "CHAT_INPUT",
  

  run: async(client, interaction, args) => {   


        const embed = await interaction.reply({ embeds: [new Discord.MessageEmbed()
          .setTitle(`${config.get(`title`)} ・ Meus Comandos`)
          .setDescription(`
          ⚙ ・ /ajuda - Veja meus comandos
          ⚙ ・ /info - Veja info de uma compra
          ⚙ ・ /perfil - Veja seu perfil
          ⚙ ・ /status - Veja os status de vendas
          ⚙ ・ /rendimentos - Veja seus rendimentos
          ⚙ ・ /pegar - Veja um produto entregue
          ⚙ ・ /pagar - Altere um id para pago
          ⚙ ・ /criarcupom - Crie um cupom
          ⚙ ・ /configcupom - Gerencie um cupom
          ⚙ ・ /clear - Apague as mensagens do chat
          ⚙ ・ /criados - Veja todos os produtos/cupons/gifts criados
          ⚙ ・ /criar - Crie um produto
          ⚙ ・ /setar - Sete um produto
          ⚙ ・ /config - Gerencie um produto
          ⚙ ・ /estoque - Gerencie um estoque
          ⚙ ・ /rank - Veja o Ranking de Clientes
          ⚙ ・ /configbot - Configura o bot
          ⚙ ・ /configcanais - Configura os canais
          ⚙ ・ /configstatus - Configura os status
          ⚙ ・ /permadd - Adicione um administrador
          ⚙ ・ /donoadd - Adicione um dono
          ⚙ ・ /permdel - Remova um administrador
          ⚙ ・ /donodel - Remova um dono
          `)
        ]
        
        })
      }}