// importando bibliotecas, classes e configurações
const { parentPort } = require('worker_threads')                // por onde o canal pode mandar mensagens para o emissor
const config = require('../config')                             // configuração do canal
const Channel = require('./canal')                              // canal de comunicação com o emissor
const print = require('../util/logger').getPrint("receptor")    // print bonitinho 

// estabelecendo canal
const emissor = parentPort                                      // pegar referencia do receptor
const canal = new Channel(config.canal)                         // criando o canal de comunicação com o receptor
canal.setSender(msg => emissor.postMessage(msg))                // configurando para onde o canal deve mandar mensagens saindo do receptor (para o emissor)

// pegando o arquivo onde a lógica da conexão está implementada
const protocolo = config.protocol                               // qual protocolo o receptor está usando
const recieverLogicPath = `../protocolos/${protocolo}/reciever` // qual o caminho para o arquivo que implementa a lógica que o receptor está usando

// criando a lógica de conexão
const recieverLogic = require(recieverLogicPath)                // importando a lógica de conexão 
const receptor = new recieverLogic(canal)                       // criando uma nova instância da lógica de conexão
emissor.on('message', message => receptor.recieve(message))     // "Quando o emissor me envia uma mensagem" redirecionando todas as mensagens recebidas para a lógica de conexão
receptor.onMsg(msg => print('eu recebi uma mensagem!', msg))

// isso é inútil, pode tirar quando o trabalho estiver pronto //////////////////////////////////////////////
// TEMPORARIO ###############################################################
// emissor.on('message', packet => {
//   print("eu recebi", packet, ". O checksum disso é:", Checksum(packet.data))
//   canal.send(new Packet("kkk, olha o idiota", {}))
// }) 
// TEMPORARIO ###############################################################

module.exports = {
  send: receptor.rdtSendMsg,
  onMsg: receptor.onMsg,
}