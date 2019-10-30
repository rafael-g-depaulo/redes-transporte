const { Packet, isCorrupted } = require('../../util/packet')
const { print: { receptorME }} = require('../../config')  // configuração do canal
const Host = require('../host')

module.exports = class Reciever extends Host {
  //Aqui teremos dois estados
  // expect = 0 (espera ACK =0)
  // expect = 1
  expect = 0

  constructor(channel) {
    console.log
    super(channel, receptorME)  // chama a superclasse
  }
  
  // recebe mensagens por esse método
  recieve = packet => {
    // se estiver corrompido ou não é o pacote certo (número de sequencia errado)
    if (isCorrupted(packet) || this.expect != packet.header.ack) {
      this.print("Recebi um pacote corrompido, duplicado ou fora de ordem")
      this.send(new Packet(packet.data, { ack: this.expect ^ 1 }))  
    
    // se o número de sequencia for o esperado
    } else {
      this.print("recebi um pacote:", packet)
      this.deliver(packet)      // entrega a mensagem para a camada de aplicação
      this.expect ^= 1          // troca o ack esperado (0->1, 1->0)
      this.send(packet)         // manda o ACK
    }
  }
}