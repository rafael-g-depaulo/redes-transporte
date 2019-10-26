// importando bibliotecas, classes e configurações
const { Worker } = require('worker_threads')                // biblioteca para criar uma thread paralela que serve como o receptor
const Channel = require('./canal')                          // canal
const config = require('./canalConfig')                     // configuração do canal
const print = require('../util/logger')('EMISSOR', '36m')   // print bonitinho

// escolhendo o tipo de conexão
const protocolo = 'rdt'                                     // qual protocolo o emissor está usando
const senderLogicPath = `../algoritmos/${protocolo}/sender` // qual o caminho para o arquivo que implementa a lógica que o emissor está usando

// esbelendo canal de comunicação com o receptor
const receptor = new Worker('./conexao/receptor.js', { worketData: protocolo }) // criar o receptor
const canal = new Channel(config)                           // criar o canal que simula atraso, perda de pacotes e limite de banda
canal.setSender(msg => receptor.postMessage(msg))           // configurando para onde o canal deve mandar mensagens saindo do emissor (para o receptor)

// instanciando a lógica de conexão
const senderLogic = require(senderLogicPath)                // importando a lógica de conexão 
const emissor = new senderLogic(canal)                      // criando uma nova instância da lógica de conexão
// receptor.on('message', message => emissor.recieve(message)) // redirecionando todas as mensagens recebidas para a lógica de conexão

// TEMPORARIO ###############################################################
receptor.on('message', msg => print(`eu recebi a mensagem`, msg))
// TEMPORARIO ###############################################################

module.exports = {
  send: pkt => print("enviando o pacote:", pkt) || canal.send(pkt)
}