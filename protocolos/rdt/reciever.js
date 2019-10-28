const { Packet, Checksum } = require('../../util/packet')
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
    if (this.isCorrupted(packet) || this.expect != packet.header.ack) {
      this.print("Recebi um pacote corrompido, duplicado ou fora de ordem")
      this.send(new Packet(packet.data, { ack: this.expect ^ 0 }))  
    
    // se o número de sequencia for o esperado
    } else {
      this.print("recebi o pacote deboinhas", packet)
      this.deliver(packet)      // entrega a mensagem para a camada de aplicação
      this.expect ^= 1          // troca o ack esperado (0->1, 1->0)
      this.send(packet)         // manda o ACK
    }
  }

  isCorrupted(packet) {
    let compara = Checksum(packet.data)
    if (packet.header.checksum != compara) {
      this.print("é corrupto sim", compara)
      this.print("devia ter dado isso ó ", packet.header.checksum)
      this.print("minha informação corrompida é", packet.data)
      return true
    }

    this.print("olha deu bom") 
    return false
   }
}