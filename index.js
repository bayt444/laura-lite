/* 
*
* Venda de código proibida
* Projeto feito por ton/bayt criador da laura main
* Versão melhorada e otimizada de laura main 
* Grupo oficial https://chat.whatsapp.com/F7IrLGErFucGvBvDGQrfUR
*
*/
require("./datab/armazenamento/env/info.js")
const { 
default: makeWASocket,
MessageType, 
Presence,
MessageOptions, 
downloadContentFromMessage,
fetchLatestBaileysVersion,
Mimetype,
useMultiFileAuthState,
DisconnectReason,
Browsers,
delay
} = require("@whiskeysockets/baileys")
const fs = require("fs")
const P = require("pino") 
const fetch = require("node-fetch")
const chalk = require("chalk")
const inquirer = require("inquirer")
const { color } = require("./datab/lib/cores")
const { banner, getBuffer, getExtension, getRandom } = require("./datab/lib/funções")
const moment = require("moment-timezone")
const hora = moment.tz("America/Sao_Paulo").format("HH:mm:ss")
const data = moment.tz("America/Sao_Paulo").format("DD/MM/YY")
const speed = require("performance-now")
const yts = require("yt-search")
const _ = require("lodash")

// Definições 
prefixo = configurações.prefixo
nomeBot = configurações.nomeBot
nomeDono = configurações.nomeDono
numeroDono = configurações.numeroDono

const girastamp = speed()
const latensi = speed() - girastamp

// Contato do dono
const vcard = "BEGIN:VCARD\n"
+ "VERSION:3.0\n" 
+ "FN:Ton\n" // Nome completo
+ "ORG:Lwa Company;\n" // A organização do contato
+ "TEL;type=CELL;type=VOICE;waid=558586294618:+55 85 8629-4618\n" // WhatsApp ID + Número de telefone
+ "END:VCARD" // Fim do ctt

async function laur() {

// Início da conexão
const { state, saveCreds } = await useMultiFileAuthState("./datab/qr-code")
console.log(banner.string)
const conn = makeWASocket({
 logger: P({ level: "silent" }),
 mobile: false,
 browser: ["chrome (linux)"],
 auth: state
})

// Nova conexão 
if (conn.user == null) {
let resposta = await inquirer.prompt([{ type: "input", name: "numero", message: "Digite seu número: \nEx: 558586294618\n-->" }])

let codigo = await conn.requestPairingCode(resposta.numero)
console.log(`Seu código de conexão é: ${chalk.bold(codigo)}`)
}

// Chat update
// Ouvir quando as credenciais auth é atualizada
conn.ev.on("creds.update", saveCreds)
conn.ev.on("messages.upsert", async ({ messages }) => {
try {
const info = messages[0]
if (!info.message) return 
await conn.readMessages([info.key.id])
if (info.key && info.key.remoteJid == "status@broadcast") return
const altpdf = Object.keys(info.message)
const type = altpdf[0] == "senderKeyDistributionMessage" ? altpdf[1] == "messageContextInfo" ? altpdf[2] : altpdf[1] : altpdf[0]

const content = JSON.stringify(info.message)
const from = info.key.remoteJid

// Body
var body = (type === "conversation") ?
info.message.conversation : (type == "imageMessage") ?
info.message.imageMessage.caption : (type == "videoMessage") ?
info.message.videoMessage.caption : (type == "extendedTextMessage") ?
info.message.extendedTextMessage.text : ""

const args = body.trim().split(/ +/).splice(1)
const isCmd = body.startsWith(prefixo)
const comando = isCmd ? body.slice(1).split(/ +/).shift().toLowerCase() : null

bidy =  body.toLowerCase()

const getFileBuffer = async (mediakey, MediaType) => { 
const stream = await downloadContentFromMessage(mediakey, MediaType)

let buffer = Buffer.from([])
for await(let chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}

const isGroup = from.endsWith("@g.us")
const tescuk = ["0@s.whatsapp.net"]
const sender = isGroup ? info.key.participant : from
const testat = bidy
const pushname = info.pushName ? info.pushName : ""
const groupMetadata = isGroup ? await conn.groupMetadata(from) : ""
const groupName = isGroup  ? groupMetadata.subject : ""
const groupDesc = isGroup ? groupMetadata.desc : ""
const groupMembers = isGroup ? groupMetadata.participants : ""
const groupAdmins = isGroup ? _.map(_.filter(groupMembers, "admin"), "id")  : ""
const q = args.join(" ")

// Consts dono/adm etc...
const quoted = info.quoted ? info.quoted : info
const mime = (quoted.info || quoted).mimetype || ""
const numeroBot = conn.user.id.split(":")[0] + "@s.whatsapp.net"
const isBot = info.key.fromMe
const isOwner = sender.includes(numeroDono)
const isBotGroupAdmins = groupAdmins.includes(numeroBot) || false
const isGroupAdmins = groupAdmins.includes(sender) || false 
const enviar = (texto) => {
conn.sendMessage(from, { text: texto }, {quoted: info}) }

// Mensagens do console

if (!isCmd && !isBot) {

console.log(chalk.gray("~>"), `[${chalk.blue("Mensagem")}]`, "de", color(sender.split("@")[0]))

} else if (isCmd && !isBot) {

console.log(chalk.gray("~>"), `[${chalk.red("Comando")}]`, color(comando), "de",
color(sender.split("@")[0]))
}

// Começo dos comandos com prefix
switch (comando) {

// Feito por Ton

case "programado":
case "suporte":
case "dono":
await delay(3000)
try {
conn.sendMessage(sender, { contacts: { displayName: `${nomeDono}`, contacts: [{ vcard }]
}})
} catch (e) {
console.log(e)
}
break

case "tag":
case "hidetag":
if (!isGroup) return enviar("Este comando só poderia ser utilizado em grupo.")
if (!isGroupAdmins) return enviar("Somente admins poderia utilizar esse comando.")
if (args.length < 1) return enviar("Diga oque irei citar...")
let mem = _.map(groupMembers, "id")
let options = {
  text: q,
  mentions: mem,
  quoted: info
}
conn.sendMessage(from, options)
break

case "reagir":
{
conn.sendMessage(from, { react: { text: "🐳", key: info.key }})
}
break

case "ping":
if (!isOwner) return enviar("Você não e meu dono...")
enviar(`☁️ Velocidade: ${latensi.toFixed(4)}`)
break

default:

// Comandos sem prefixo
switch (testat) {

case "corno":
enviar("Você tá bravinha? tá?")
break

case "bom dia":
conn.sendMessage(from, { react: { text: "☕", key: info.key }})
break

}

// Resposta quando o comando não é encontrado
if (isCmd) {
enviar("Comando não encontrado... 🐳")
}

}

} catch (e) {
console.log(e)
}})

// New auto reconexão própria
conn.ev.on("connection.update", (update) => {
let { connection, lastDisconnect } = update

if (connection === "open") {
console.log(chalk.greenBright("Laura 3.0 conectada ✓"))
console.log(chalk.gray("Info"), color("Os: Baileys"))
console.log(chalk.gray("Info"), color("Versão: 3.0 (Lite)"))
console.log(chalk.gray("Info"), color("Dev: Ton"))
console.log(chalk.gray("Boa Sorte!\n"))
} else if (connection === "close") {

console.log(chalk.dim("Ocorreu um conflito na conexão"))
laur()
}
if(update.isNewLogin) {
laur()
}})}
laur()
