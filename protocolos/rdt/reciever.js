const { Packet, Checksum } = require('../../util/packet')
const { print: { receptorME }} = require('../../config')  // configuração do canal
const print = require('../../util/logger')(receptorME)    // print bonitinho (se é pra mandar print)

  module.exports = class Reciever {
  //Aqui teremos dois estados
  // expect = 0 (espera ACK =0)
  // Expect = 1

  expect = 0            // estado inicial
  msgHandler = () => {} // entrega mensagens a camada de aplicação

  constructor(channel) {
    // para mandar mensagens para o outro host, mande pelo this.send
    this.send = channel.send  
  }
  
  // mandar mensagens corretas recebidas para a camada de aplicação
  onMsg = msgHandler => this.msgHandler = msgHandler
  deliver = pkt => this.msgHandler(pkt.data)

  // recebe mensagens por esse método
  recieve = packet => {
    // se estiver corrompido ou não é o pacote certo (número de sequencia errado)
    if (this.isCorrupted(packet) || this.expect != packet.header.ack) {
      print("Recebi um pacote corrompido, duplicado ou fora de ordem")
      this.send(new Packet(packet.data, { ack: this.expect ^ 0 }))  
    
    // se o número de sequencia for o esperado
    } else {
      print("recebi o pacote deboinhas", packet)
      this.deliver(packet)      // entrega a mensagem para a camada de aplicação
      this.expect ^= 1          // troca o ack esperado (0->1, 1->0)
      this.send(packet)         // manda o ACK
    }
  }

  isCorrupted(packet) {
    let compara = Checksum(packet.data)
    if (packet.header.checksum != compara) {
      print("é corrupto sim", compara)
      print("devia ter dado isso ó ", packet.header.checksum)
      print("minha informação corrompida é", packet.data)
      return true
    }

    print("olha deu bom") 
    return false
   }
}