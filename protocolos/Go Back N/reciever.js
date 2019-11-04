const { Packet, isCorrupted } = require('../../util/packet')
const Host = require('../host')

module.exports = class Reciever extends Host {
  //Aqui teremos dois estados
  // expect = 0 ExpectedSeqNum = 0
  expect = 1
  ACK = new Packet("", { ack: this.expect })

  constructor(channel) {
    super(channel, "receptorME")  // chama a superclasse
  }
  
  // recebe mensagens por esse método
  recieve = packet => {
    
    // se estiver corrompido ou não é o pacote certo (número de sequencia errado)
    if (isCorrupted(packet) || this.expect !== packet.header.ack) {
      this.print("corrompido ou fora de ordem. esperava:", this.expect, "recebi", packet.header.ack)
    }
  
    // se o número de sequencia for o esperado
   else {
      this.print("recebi um pacote:", packet)
      this.ACK = new Packet("", { ack: this.expect })
      this.expect++
      this.deliver(packet)        // entrega a mensagem para a camada de aplicação
      this.send2Net(this.ACK)     // manda o ACK
    }
  }
}