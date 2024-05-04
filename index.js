const { Client, Collection, Intents } = require('discord.js');
const handler = require("./handler/index");
const myIntents = new Intents();
const mercadopago = require("mercadopago")
const axios = require("axios")
const moment = require("moment")
const { WebhookClient } = require("discord.js")

const { JsonDatabase, } = require("wio.db");
const db = new JsonDatabase({ databasePath: "./databases/myJsonProdutos.json" });
const dbc = new JsonDatabase({ databasePath: "./databases/myJsonCupons.json" });
const db2 = new JsonDatabase({ databasePath: "./databases/myJsonDatabase.json" });
const db3 = new JsonDatabase({ databasePath: "./databases/myJsonIDs.json" });
const perms = new JsonDatabase({ databasePath: "./databases/myJsonPerms.json" });
const config = new JsonDatabase({ databasePath: "./config.json" });
myIntents.add(
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_BANS,
  Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
  Intents.FLAGS.GUILD_INTEGRATIONS,
  Intents.FLAGS.GUILD_WEBHOOKS,
  Intents.FLAGS.GUILD_INVITES,
  Intents.FLAGS.GUILD_VOICE_STATES,
  Intents.FLAGS.GUILD_PRESENCES,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.GUILD_MESSAGE_TYPING,
  Intents.FLAGS.DIRECT_MESSAGES,
  Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
  Intents.FLAGS.DIRECT_MESSAGE_TYPING
)

const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  intents: myIntents
});

const Discord = require('discord.js');
require('dotenv').config()

module.exports = client;

client.discord = Discord;
client.commands = new Collection();
client.slash = new Collection();
client.config = require('./config')

// Carregar comando e eventos
handler.loadEvents(client);
handler.loadCommands(client);
handler.loadSlashCommands(client);

// Erro no Handling

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception: " + err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("[GRAVE] Rejeição possivelmente não tratada em: Promise ", promise, " motivo: ", reason.message);
});

client.login(process.env.TOKEN);

client.on("messageCreate", message => {

  if (message.author.bot) return;
  if (message.channel.type == '')
    return
  if (message.content == `<@${client.user.id}>` || message.content == `<@!${client.user.id}>`) {
    return message.channel.send(`🖕`)
  }
});

process.on('unhandledRejection', (reason, p) => {
  console.log('❌ | Script Rejeitado')
  console.log(reason, p)
});
process.on('multipleResolves', (type, promise, reason) => {
  console.log('❌ | Vários erros encontrados')
  console.log(type, promise, reason)
});
process.on('uncaughtExceptionMonito', (err, origin) => {
  console.log('❌ | Sistema bloqueado')
  console.log(err, origin)
});
process.on('uncaughtException', (err, origin) => {
  console.log('❌ | Erro encontrado')
  console.log(err, origin)
});

client.on("interactionCreate", (interaction) => {
  if (interaction.isButton()) {
    const eprod = db.get(interaction.customId);
    if (!eprod) return;
    const severi = interaction.customId;
    if (eprod) {
      const quantidade = db.get(`${severi}.conta`).length;
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId(interaction.customId)
            .setLabel('Comprar')
            .setEmoji("🛒")
            .setStyle('SUCCESS'),
        );

      const embed = new Discord.MessageEmbed()
        .setTitle(`${config.get(`title`)} | Bot Store`)
        .setDescription(`
\`\`\`
${db.get(`${interaction.customId}.desc`)}
\`\`\`
**🌍 | Nome:** __${db.get(`${interaction.customId}.nome`)}__
**💸 | Preço:** __${db.get(`${interaction.customId}.preco`)}__
**📦 | Estoque:** __${db.get(`${interaction.customId}.conta`).length}__`)
        .setColor(config.get(`color`))
        .setImage(config.get(`banner`))
        .setThumbnail(client.user.displayAvatarURL())
      interaction.message.edit({ embeds: [embed], components: [row] })

      if (quantidade < 1) {

        interaction.reply({ content: `❌ | Este produto está sem estoque no momento, volte mais tarde!`, ephemeral: true })
        return;
      }

      interaction.deferUpdate()
      if ((interaction.guild.channels.cache.find(c => c.topic === interaction.user.id))) {
        return;
      }


      interaction.guild.channels.create(`🛒・carrinho-${interaction.user.username}`, {
        type: "GUILD_TEXT",
        parent: config.get(`category`),
        topic: interaction.user.id,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS"]
          },
          {
            id: interaction.user.id,
            allow: ["VIEW_CHANNEL"],
            deny: ["SEND_MESSAGES"]
          }
        ]


      }).then(c => {
        let quantidade1 = 1;
        let precoalt = eprod.preco;
        var data_id = Math.floor(Math.random() * 999999999999999);
        db3.set(`${data_id}.id`, `${data_id}`)
        db3.set(`${data_id}.status`, `Pendente (1)`)
        db3.set(`${data_id}.userid`, `${interaction.user.id}`)
        db3.set(`${data_id}.dataid`, `${moment().format('LLLL')}`)
        db3.set(`${data_id}.nomeid`, `${eprod.nome}`)
        db3.set(`${data_id}.qtdid`, `${quantidade1}`)
        db3.set(`${data_id}.precoid`, `${precoalt}`)
        db3.set(`${data_id}.entrid`, `Andamento`)
        const timer2 = setTimeout(function () {
          if ((interaction.guild.channels.cache.find(c => c.topic === interaction.user.id))) { c.delete(); }
          db3.delete(`${data_id}`)
        }, 300000)



        const row = new Discord.MessageActionRow()
          .addComponents(
            new Discord.MessageButton()
              .setCustomId('removeboton')
              .setLabel('-')
              .setEmoji("")
              .setStyle('SECONDARY'),
          )
          .addComponents(
            new Discord.MessageButton()
              .setCustomId('comprarboton')
              .setLabel('Comprar')
              .setEmoji('✅')
              .setStyle('SUCCESS'),
          )
          .addComponents(
            new Discord.MessageButton()
              .setCustomId('addboton')
              .setLabel('+')
              .setEmoji("")
              .setStyle('SECONDARY'),
          )
          .addComponents(
            new Discord.MessageButton()
              .setCustomId('cancelarbuy')
              .setLabel('Cancelar')
              .setEmoji('❌')
              .setStyle('DANGER'),
          );
        const embedss = new Discord.MessageEmbed()
          .setTitle(`${config.get(`title`)} | Sistema de Compras`)
          .addField(`🌍 | Nome:`, `${eprod.nome}`)
          .addField(`📦 | Quantidade:`, `${quantidade1}`)
          .addField(`💸 | Valor`, `${precoalt} Reais`)
          .addField(`⭐ | Id da compra`, `${data_id}`)
          .setColor(config.get(`color`))
          .setThumbnail(client.user.displayAvatarURL())
        c.send({ embeds: [embedss], content: `<@${interaction.user.id}>`, components: [row], fetchReply: true }).then(msg => {
          const filter = i => i.user.id === interaction.user.id;
          const collector = msg.createMessageComponentCollector({ filter });
          collector.on("collect", intera => {
            intera.deferUpdate()
            if (intera.customId === 'cancelarbuy') {
              clearInterval(timer2);
              const embedcancelar = new Discord.MessageEmbed()
                .setTitle(`${config.get(`title`)} | Compra Cancelada`)
                .setDescription(`${interaction.user}, Você cancelou a compra, e todos os produtos foram devolvido para o estoque. Você pode voltar a comprar quando quiser!`)
                .setColor(config.get(`color`))
                .setThumbnail(client.user.displayAvatarURL())
              interaction.user.send({ embeds: [embedcancelar] })
              db3.delete(`${data_id}`)
              if ((interaction.guild.channels.cache.find(c => c.topic === interaction.user.id))) { c.delete(); }
            }
            if (intera.customId === "addboton") {
              if (quantidade1++ >= quantidade) {
                quantidade1--;
                const embedss2 = new Discord.MessageEmbed()
                  .setTitle(`${config.get(`title`)} | Sistema de Compras`)
                  .addField(`🌍 | Nome:`, `${eprod.nome}`)
                  .addField(`📦 | Quantidade:`, `${quantidade1}`)
                  .addField(`💸 | Valor`, `${precoalt} Reais`)
                  .addField(`⭐ | Id da compra`, `${data_id}`)
                  .setColor(config.get(`color`))
                  .setThumbnail(client.user.displayAvatarURL())
                msg.edit({ embeds: [embedss2] })
              } else {
                precoalt = Number(precoalt) + Number(eprod.preco);
                const embedss = new Discord.MessageEmbed()
                  .setTitle(`${config.get(`title`)} | Sistema de Compras`)
                  .addField(`🌍 | Nome:`, `${eprod.nome}`)
                  .addField(`📦 | Quantidade:`, `${quantidade1}`)
                  .addField(`💸 | Valor`, `${precoalt} Reais`)
                  .addField(`⭐ | Id da compra`, `${data_id}`)
                  .setColor(config.get(`color`))
                  .setThumbnail(client.user.displayAvatarURL())
                msg.edit({ embeds: [embedss] })
              }
            }
            if (intera.customId === "removeboton") {
              if (quantidade1 <= 1) {
                msg.channel.send({
                  embeds: [new Discord.MessageEmbed()
                    .setDescription(`❌ Você não pode remover mais produtos!`)
                    .setColor("RED")
                  ]
                }).then(msg => setTimeout(() => msg.delete().catch(err => console.log(err)), 5000));
              } else {
                precoalt = precoalt - eprod.preco;
                quantidade1--;
                const embedss = new Discord.MessageEmbed()
                  .setTitle(`${config.get(`title`)} | Sistema de Compras`)
                  .addField(`🌍 | Nome:`, `${eprod.nome}`)
                  .addField(`📦 | Quantidade:`, `${quantidade1}`)
                  .addField(`💸 | Valor`, `${precoalt} Reais`)
                  .addField(`⭐ | Id da compra`, `${data_id}`)
                  .setColor(config.get(`color`))
                  .setThumbnail(client.user.displayAvatarURL())
                msg.edit({ embeds: [embedss] })
              }
            }

            if (intera.customId === "comprarboton") {
              msg.channel.bulkDelete(50);
              clearInterval(timer2);
              const timer3 = setTimeout(function () {
                if ((interaction.guild.channels.cache.find(c => c.topic === interaction.user.id))) { c.delete(); }
                db3.delete(`${data_id}`)
              }, 300000)
              const row = new Discord.MessageActionRow()
                .addComponents(
                  new Discord.MessageButton()
                    .setCustomId('addcboton')
                    .setLabel('Cupom')
                    .setEmoji('🌌')
                    .setStyle('PRIMARY'),
                )
                .addComponents(
                  new Discord.MessageButton()
                    .setCustomId('continuarboton')
                    .setLabel('Continuar')
                    .setEmoji('✅')
                    .setStyle('SUCCESS'),
                )
                .addComponents(
                  new Discord.MessageButton()
                    .setCustomId('cancelarboton')
                    .setLabel('Cancelar')
                    .setEmoji('❌')
                    .setStyle('DANGER'),
                );

              const embedss = new Discord.MessageEmbed()
                .setTitle(`${config.get(`title`)} | Sistema de Compras`)
                .addField(`🌌 | Cupom:`, `Nenhum`)
                .addField(`☀ | Desconto:`, `0.00%`)
                .addField(`💸 | Preço Atual:`, `${precoalt}`)
                .setColor(config.get(`color`))
                .setThumbnail(client.user.displayAvatarURL())
              c.send({ embeds: [embedss], components: [row], content: `<@${interaction.user.id}>`, fetchReply: true }).then(msg => {
                const filter = i => i.user.id === interaction.user.id;
                const collector = msg.createMessageComponentCollector({ filter });
                collector.on("collect", intera2 => {
                  intera2.deferUpdate()
                  if (intera2.customId === 'addcboton') {
                    intera.channel.permissionOverwrites.edit(intera.user.id, { SEND_MESSAGES: true });
                    msg.channel.send("❓ | Qual o cupom?").then(mensagem => {
                      const filter = m => m.author.id === interaction.user.id;
                      const collector = mensagem.channel.createMessageCollector({ filter, max: 1 });
                      collector.on("collect", cupom => {
                        if (`${cupom}` !== `${dbc.get(`${cupom}.idcupom`)}`) {
                          cupom.delete()
                          mensagem.edit("❌ | Isso não é um cupom!")
                          intera.channel.permissionOverwrites.edit(intera.user.id, { SEND_MESSAGES: false });
                          return;
                        }

                        var minalt = dbc.get(`${cupom}.minimo`);
                        var dscalt = dbc.get(`${cupom}.desconto`);
                        var qtdalt = dbc.get(`${cupom}.quantidade`);

                        precoalt = Number(precoalt) + Number(`1`);
                        minalt = Number(minalt) + Number(`1`);
                        if (precoalt < minalt) {
                          cupom.delete()
                          intera.channel.permissionOverwrites.edit(intera.user.id, { SEND_MESSAGES: false });
                          mensagem.edit(`❌ | Você não atingiu o mínimo!`)
                          return;
                        } else {

                          precoalt = Number(precoalt) - Number(`1`);
                          minalt = Number(minalt) - Number(`1`);

                          if (`${dbc.get(`${cupom}.quantidade`)}` === "0") {
                            cupom.delete()
                            intera.channel.permissionOverwrites.edit(intera.user.id, { SEND_MESSAGES: false });
                            mensagem.edit("❌ | Esse cupom saiu de estoque!")
                            return;
                          }

                          if (`${cupom}` === `${dbc.get(`${cupom}.idcupom`)}`) {
                            cupom.delete()
                            mensagem.edit("✅ | Cupom adicionado")
                            intera.channel.permissionOverwrites.edit(intera.user.id, { SEND_MESSAGES: false });
                            var precinho = precoalt;
                            var descontinho = "0." + dscalt;
                            var cupomfinal = precinho * descontinho;
                            precoalt = precinho - cupomfinal;
                            qtdalt = qtdalt - 1;
                            row.components[0].setDisabled(true)
                            const embedss2 = new Discord.MessageEmbed()
                              .setTitle(`${config.get(`title`)} | Sistema de Compras`)
                              .addField(`🌌 | Cupom:`, `${dbc.get(`${cupom}.idcupom`)}`)
                              .addField(`☀ | Desconto:`, `${dbc.get(`${cupom}.desconto`)}.00%`)
                              .addField(`💸 | Preço Atual:`, `${precoalt} Reais`)
                              .setColor(config.get(`color`))
                              .setThumbnail(client.user.displayAvatarURL())
                            msg.edit({ embeds: [embedss2], components: [row], content: `<@${interaction.user.id}>`, fetchReply: true })
                            dbc.set(`${cupom}.quantidade`, `${qtdalt}`)
                          }
                        }
                      })
                    })
                  }

                  if (intera2.customId === 'cancelarboton') {
                    clearInterval(timer3);
                    const embedcancelar2 = new Discord.MessageEmbed()
                      .setTitle(`${config.get(`title`)} | Compra Cancelada`)
                      .setDescription(`${interaction.user}, Você cancelou a compra, e todos os produtos foram devolvido para o estoque. Você pode voltar a comprar quando quiser!`)
                      .setColor(config.get(`color`))
                      .setThumbnail(client.user.displayAvatarURL())
                    interaction.user.send({ embeds: [embedcancelar2] })
                    db3.delete(`${data_id}`)
                    if ((interaction.guild.channels.cache.find(c => c.topic === interaction.user.id))) { c.delete(); }
                  }

                  if (intera2.customId === "continuarboton") {
                    msg.channel.bulkDelete(50);
                    clearInterval(timer3);
                    const venda = setTimeout(function () {
                      if ((interaction.guild.channels.cache.find(c => c.topic === interaction.user.id))) { c.delete(); }
                      db3.delete(`${data_id}`)
                    }, 1800000)
                    mercadopago.configurations.setAccessToken(config.get(`access_token`));
                    var payment_data = {
                      transaction_amount: Number(precoalt),
                      description: `Pagamento | ${interaction.user.username}`,
                      payment_method_id: 'pix',
                      payer: {
                        email: 'botvendas@gmail.com',
                        first_name: 'Heverson',
                        last_name: 'Bueno',
                        identification: {
                          type: 'CPF',
                          number: '75608669649'
                        },
                        address: {
                          zip_code: '06233200',
                          street_name: 'Av. das Nações Unidas',
                          street_number: '3003',
                          neighborhood: 'Bonfim',
                          city: 'Osasco',
                          federal_unit: 'SP'
                        }
                      }
                    };

                    mercadopago.payment.create(payment_data).then(function (data) {
                      db3.set(`${data_id}.status`, `Pendente (2)`)
                      const buffer = Buffer.from(data.body.point_of_interaction.transaction_data.qr_code_base64, "base64");
                      const attachment = new Discord.MessageAttachment(buffer, "payment.png");
                      const row = new Discord.MessageActionRow()
                        .addComponents(
                          new Discord.MessageButton()
                            .setCustomId('codigo')
                            .setEmoji("<:pix_:1066368353242988584>")
                            .setLabel("Copia e Cola")
                            .setStyle('PRIMARY'),
                        )
                        .addComponents(
                          new Discord.MessageButton()
                            .setCustomId('qrcode')
                            .setEmoji("<:qr_code:1079410307132293290>")
                            .setLabel("QR Code")
                            .setStyle('PRIMARY'),
                        )
                        .addComponents(
                          new Discord.MessageButton()
                            .setCustomId('cancelarpix')
                            .setEmoji("❌")
                            .setLabel("Cancelar")
                            .setStyle('DANGER'),
                        );
                      const embed = new Discord.MessageEmbed()
                        .setTitle(`${config.get(`title`)} | Sistema de Compras`)
                        .setDescription(`
\`\`\`
Pague para receber o produto.
\`\`\``)
                        .addField(`🌍 | Nome:`, `${eprod.nome}`)
                        .addField(`📦 | Quantidade:`, `${quantidade1}`)
                        .addField(`💸 | Valor`, `${precoalt} Reais`)
                        .addField(`⭐ | Id da compra`, `${data_id}`)
                        .setColor(config.get(`color`))
                        .setThumbnail(client.user.displayAvatarURL())
                      msg.channel.send({ embeds: [embed], content: `<@${interaction.user.id}>`, components: [row] }).then(msg => {

                        const collector = msg.channel.createMessageComponentCollector();
                        const lopp = setInterval(function () {
                          const time2 = setTimeout(function () {
                            clearInterval(lopp);
                          }, 1800000)
                          axios.get(`https://api.mercadolibre.com/collections/notifications/${data.body.id}`, {
                            headers: {
                              'Authorization': `Bearer ${config.get(`access_token`)}`
                            }
                          }).then(async (doc) => {
                            if (doc.data.collection.status === "approved") {
                              db3.set(`${data_id}.status`, `Processando`)
                            }

                            if (`${db3.get(`${data_id}.status`)}` === "Processando") {
                              clearTimeout(time2)
                              clearInterval(lopp);
                              clearInterval(venda);
                              const vendadel = setTimeout(function () {
                                if ((interaction.guild.channels.cache.find(c => c.topic === interaction.user.id))) { c.delete(); }
                              }, 60000)
                              const a = db.get(`${severi}.conta`);
                              const canalif1 = client.channels.cache.get(config.canallogs);
                              db2.add("pedidostotal", 1)
                              db2.add("gastostotal", Number(precoalt))
                              db2.add(`${moment().format('L')}.pedidos`, 1)
                              db2.add(`${moment().format('L')}.recebimentos`, Number(precoalt))
                              db2.add(`${interaction.user.id}.gastosaprovados`, Number(precoalt))
                              db2.add(`${interaction.user.id}.pedidosaprovados`, 1)

                              if (a < quantidade1) {
                                db3.set(`${data_id}.status`, `Reembolsado`)
                                msg.channel.send("✅ | Pagamento reembolsado")
                                msg.channel.send(`🚨 | ID Da compra: ${data_id}`)
                                mercadopago.configure({ access_token: `${config.get(`access_token`)}` });
                                var refund = { payment_id: `${data.body.id}` };
                                mercadopago.refund.create(refund).then(result => {
                                  const message2new = new Discord.MessageEmbed()
                                    .setTitle(`${config.get(`title`)} | Compra Reembolsada`)
                                    .addField(`Comprador:`, `<@${data_id}>`)
                                    .addField(`Data da compra:`, `${moment().format('LLLL')}`)
                                    .addField(`Nome:`, `${eprod.nome}`)
                                    .addField(`Quantidade:`, `${quantidade1}x`)
                                    .addField(`Preço:`, `${precoalt}`)
                                    .addField(`Id da compra:`, `\`\`\`${data_id}\`\`\``)
                                    .setColor(config.get(`color`))
                                    .setThumbnail(client.user.displayAvatarURL())
                                  canalif1.send({ embeds: [message2new] })
                                })
                              } else {
                                const removed = a.splice(0, Number(quantidade1));
                                db.set(`${severi}.conta`, a);
                                const embedentrega = new Discord.MessageEmbed()
                                  .setTitle(`${config.get(`title`)} | Seu produto`)
                                  .setDescription(`**📦 | Produtos:** \n  \`\`\` 1º| ${removed.join("\n")}\`\`\`\n**⭐ | Id da Compra:** ${data_id}`)
                                  .setColor(config.get(`color`))
                                  .setThumbnail(client.user.displayAvatarURL())

                                interaction.user.send({ embeds: [embedentrega] })
                                db3.set(`${data_id}.status`, `Concluido`)
                                msg.channel.send("✅ | Pagamento aprovado verifique a sua dm!")
                                const membro = interaction.guild.members.cache.get(interaction.user.id)
                                const role = interaction.guild.roles.cache.find(role => role.id === config.get(`role`))
                                membro.roles.add(role)

                                const rowavaliacao = new Discord.MessageActionRow()
                                  .addComponents(
                                    new Discord.MessageButton()
                                      .setCustomId('1star')
                                      .setEmoji('⭐')
                                      .setLabel('1')
                                      .setStyle('PRIMARY'),
                                  )
                                  .addComponents(
                                    new Discord.MessageButton()
                                      .setCustomId('2star')
                                      .setEmoji('⭐')
                                      .setLabel('2')
                                      .setStyle('PRIMARY'),
                                  )
                                  .addComponents(
                                    new Discord.MessageButton()
                                      .setCustomId('3star')
                                      .setEmoji('⭐')
                                      .setLabel('3')
                                      .setStyle('PRIMARY'),
                                  )
                                  .addComponents(
                                    new Discord.MessageButton()
                                      .setCustomId('4star')
                                      .setEmoji('⭐')
                                      .setLabel('4')
                                      .setStyle('PRIMARY'),
                                  )
                                  .addComponents(
                                    new Discord.MessageButton()
                                      .setCustomId('5star')
                                      .setEmoji('⭐')
                                      .setLabel('5')
                                      .setStyle('PRIMARY'),
                                  );

                                let sleep = async (ms) => await new Promise(r => setTimeout(r, ms));
                                let avaliacao = "Nenhuma avaliação enviada..."
                                const embed = await msg.reply({
                                  embeds: [new Discord.MessageEmbed()
                                    .setTitle(`${config.get(`title`)} | Avaliação`)
                                    .setDescription("Escolha uma nota para a venda.")
                                    .setFooter(`Você tem 30 segundos para avaliar...`)
                                    .setColor(config.get(`color`))], components: [rowavaliacao]
                                })
                                const interacaoavaliar = embed.createMessageComponentCollector({ componentType: "BUTTON", });
                                interacaoavaliar.on("collect", async (interaction) => {
                                  if (interaction.user.id != interaction.user.id) {
                                    return;
                                  }

                                  if (interaction.isButton()) {
                                    var textoest = ""
                                    var estrelas = interaction.customId.replace("star", "")

                                    for (let i = 0; i != estrelas; i++) {
                                      textoest = `${textoest} ⭐`
                                    }
                                    interaction.deferUpdate()
                                    msg.channel.bulkDelete(50);
                                    embed.channel.send("✅ | Obrigado pela avaliação!").then(msg => {
                                      rowavaliacao.components[0].setDisabled(true)
                                      rowavaliacao.components[1].setDisabled(true)
                                      rowavaliacao.components[2].setDisabled(true)
                                      rowavaliacao.components[3].setDisabled(true)
                                      rowavaliacao.components[4].setDisabled(true)

                                      const embednew = new Discord.MessageEmbed()
                                        .setTitle(`${config.get(`title`)} | Avaliação`)
                                        .setDescription("Escolha uma nota para a venda.")
                                        .setColor(config.get(`color`))
                                      embed.edit({ embeds: [embednew], components: [rowavaliacao] })
                                      avaliacao = `${textoest} (${estrelas})`

                                      interaction.channel.send({ embeds: [embed] })
                                      const embedaprovadolog = new Discord.MessageEmbed()
                                        .setTitle(`${config.get(`title`)} | Compra Aprovada`)
                                        .addField(`👤 | **Comprador:**`, `${interaction.user} | ${interaction.user.tag}`, false)
                                        .addField(`📅 | **Data:**`, `<t:${moment(interaction.createdTimestamp).unix()}>`)
                                        .addField(`🛒 | **Produto Comprado:**`, `\`${eprod.nome}\``, false)
                                        .addField(`📦 | **QuantidadeO:**`, `\`${quantidade1}x\``)
                                        .addField(`💸 | **Valor Pago:**`, `\`R$${precoalt}\``, false)
                                        .addField(`🧾 | Avaliação:`, `${avaliacao}`, false)
                                        .setColor(config.get(`color`))
                                        .setImage(config.get(`banner`))
                                        .setThumbnail(client.user.displayAvatarURL())
                                      client.channels.cache.get(config.get(`logs`)).send({ embeds: [embedaprovadolog] })
                                      db3.set(`${data_id}.entrid`, `${removed.join(" \n")}`)

                                    })
                                  }
                                })

                                const row = new Discord.MessageActionRow()
                                  .addComponents(
                                    new Discord.MessageButton()
                                      .setCustomId('reembolso')
                                      .setEmoji('💸')
                                      .setLabel('Reembolsar')
                                      .setStyle('DANGER'),
                                  );

                                const canalif = client.channels.cache.get(config.get(`logs_staff`))
                                const message2 = await canalif.send({
                                  embeds: [new Discord.MessageEmbed()
                                    .setTitle(`${config.get(`title`)} | Compra Aprovada`)
                                    .addField(`👤 | **Comprador:**`, `${interaction.user} | ${interaction.user.tag}`, false)
                                    .addField(`📅 | **Data:**`, `<t:${moment(interaction.createdTimestamp).unix()}>`)
                                    .addField(`🛒 | **Produto Comprado:**`, `\`${eprod.nome}\``, false)
                                    .addField(`📦 | **Quantidade:**`, `\`${quantidade1}x\``)
                                    .addField(`💸 | **Valor Pago:**`, `\`R$${precoalt}\``, false)
                                    .addField(`🚨 | Id da compra:`, `${data_id}`, false)
                                    .addField(`Produto Entregue: `, `\`\`\`${removed.join(" \n")}\`\`\``)
                                    .setColor(config.get(`color`))
                                    .setThumbnail(client.user.displayAvatarURL())], components: [row]
                                })
                                const interação = message2.createMessageComponentCollector({ componentType: "BUTTON", })
                                interação.on("collect", async (interaction) => {
                                  if (interaction.customId === "reembolso") {
                                    const user = interaction.user.id
                                    if (interaction.user.id !== `${perms.get(`${user}_id`)}`) return interaction.reply({ content: '❌ | Você não tem permissão!', ephemeral: true })
                                    interaction.deferUpdate()
                                    mercadopago.configure({ access_token: `${config.get(`access_token`)}` });
                                    var refund = { payment_id: `${data.body.id}` };
                                    mercadopago.refund.create(refund).then(result => {
                                      db3.set(`${data_id}.status`, `Reembolsado`)
                                      message2.delete()
                                      const message2new = new Discord.MessageEmbed()
                                        .setTitle(`${config.get(`title`)} | Compra Reembolsada`)
                                        .addField(`👤 | **Comprador:**`, `${interaction.user} | ${interaction.user.tag}`, false)
                                        .addField(`📅 | **Data:**`, `<t:${moment(interaction.createdTimestamp).unix()}>`)
                                        .addField(`🛒 | **Produto Comprado:**`, `\`${eprod.nome}\``, false)
                                        .addField(`📦 | **Quantidade:**`, `\`${quantidade1}x\``)
                                        .addField(`💸 | **Valor Pago:**`, `\`R$${precoalt}\``, false)
                                        .addField(`🧾 | Avaliação:`, `${avaliacao}`, false)
                                        .addField(`🚨 | Id da compra:`, `${data_id}`, false)
                                        .setColor(config.get(`color`))
                                        .setImage(config.get(`banner`))
                                        .setThumbnail(client.user.displayAvatarURL())
                                      canalif.send({ embeds: [message2new] })
                                    }).catch(function (error) { interaction.followUp({ content: '❌ | Houve algum erro durante a transação, tente novamente!', ephemeral: true }) });
                                  }
                                })

                                const row2 = new Discord.MessageActionRow()
                                  .addComponents(
                                    new Discord.MessageButton()
                                      .setCustomId(interaction.customId)
                                      .setLabel('Comprar')
                                      .setEmoji("🛒")
                                      .setStyle('SUCCESS'),
                                  );

                                const embed2 = new Discord.MessageEmbed()
                                  .setTitle(`${config.get(`title`)} | Bot Store`)
                                  .setDescription(`
\`\`\`
${db.get(`${interaction.customId}.desc`)}
\`\`\`
**🌍 | Nome:** __${db.get(`${interaction.customId}.nome`)}__
**💸 | Preço:** __${db.get(`${interaction.customId}.preco`)}__
**📦 | Estoque:** __${db.get(`${interaction.customId}.conta`).length}__`)
                                  .setColor(config.get(`color`))
                                  .setThumbnail(client.user.displayAvatarURL())
                                  .setImage(config.get(`banner`))
                                interaction.message.edit({ embeds: [embed2], components: [row2] })
                              }
                            }
                          })
                        }, 10000)

                        collector.on("collect", interaction => {
                          if (interaction.customId === 'codigo') {
                            row.components[0].setDisabled(true)
                            interaction.reply(data.body.point_of_interaction.transaction_data.qr_code)
                            const embed = new Discord.MessageEmbed()
                              .setTitle(`${config.get(`title`)} | Sistema de Compras`)
                              .setDescription(`
\`\`\`
Pague para receber o produto.
\`\`\``)
                              .addField(`🌍 | Nome:`, `${eprod.nome}`)
                              .addField(`📦 | Quantidade:`, `${quantidade1}`)
                              .addField(`💸 | Valor`, `${precoalt} Reais`)
                              .addField(`⭐ | Id da compra`, `${data_id}`)
                              .setColor(config.get(`color`))
                              .setThumbnail(client.user.displayAvatarURL())
                            msg.edit({ embeds: [embed], content: `<@${interaction.user.id}>`, components: [row] })
                          }

                          if (interaction.customId === 'qrcode') {
                            row.components[1].setDisabled(true)
                            const embed2 = new Discord.MessageEmbed()
                              .setTitle(`${config.get(`title`)} | Sistema de Compras`)
                              .setDescription(`
\`\`\`
Pague para receber o produto.
\`\`\``)
                              .addField(`🌍 | Nome:`, `${eprod.nome}`)
                              .addField(`📦 | Quantidade:`, `${quantidade1}`)
                              .addField(`💸 | Valor`, `${precoalt} Reais`)
                              .addField(`⭐ | Id da compra`, `${data_id}`)
                              .setColor(config.get(`color`))
                              .setThumbnail(client.user.displayAvatarURL())
                            msg.edit({ embeds: [embed2], content: `<@${interaction.user.id}>`, components: [row] })

                            const embed = new Discord.MessageEmbed()
                              .setTitle(`${config.get(`title`)} | QR Code`)
                              .setImage("attachment://payment.png")
                              .setColor(config.get(`color`))
                            interaction.reply({ embeds: [embed], files: [attachment] })
                          }

                          if (interaction.customId === 'cancelarpix') {
                            clearInterval(lopp);
                            clearInterval(venda)
                            const embedcancelar3 = new Discord.MessageEmbed()
                              .setTitle(`${config.get(`title`)} | Compra Cancelada`)
                              .setDescription(`${interaction.user}, Você cancelou a compra, e todos os produtos foram devolvido para o estoque. Você pode voltar a comprar quando quiser!`)
                              .setColor(config.get(`color`))
                              .setThumbnail(client.user.displayAvatarURL())
                            interaction.user.send({ embeds: [embedcancelar3] })
                            db3.delete(`${data_id}`)
                            if ((interaction.guild.channels.cache.find(c => c.topic === interaction.user.id))) { c.delete(); }
                          }
                        })
                      })
                    }).catch(function (error) {
                      console.log(error)
                    });
                  }
                })
              })
            }
          })
        })
      })
    }
  }
})