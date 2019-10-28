const { Packet, Checksum } = require('../../util/packet')
const config = require('../../config')                          // configuração do canal
const print = config.print.receptorME ?                         // print bonitinho (se é pra mandar print)
  require('../../util/logger')('RECIEVER-ME', "93m") : () => {}

  module.exports = class Reciever {
  //Aqui teremos dois estados
  // expect = 0 (espera ACK =0)
  // Expect = 1

  expect = 0//estado inicial
  constructor(channel) {
    // para mandar mensagens para o outro host, mande pelo this.send
    this.send = channel.send  
  }
  
  // recebe mensagens por esse método
  recieve = packet => {
    let ack
    if (this.isCorrupted(packet)) {//se estiver corrompido
      if (packet.header.ack == 0) {
        ack = 1
        this.send(new Packet(packet.data, { ack }))
      } else {
        ack = 0
        this.send(new Packet(packet.data, { ack }))
      }
    } else {//se nao estiver corrompido mas o ack estiver errado
        if (this.expect!= packet.header.ack){
          //me deixou confuso isso aqui. Como meu ACK veio errado (exemplo: Expected = 0 ACK1) eu vou enviar o ACK que EU recebi para o sender, que espera um ACK=0 mas recebe ACK =1
          print("Olha nem corrompeu mas ack ta baubau")
          this.send(packet)
        } else {//Se o ACK for o esperado
          //tenho umas dúvidas. Aqui eu envio esse pacote, porque como ele veio com o ack correto por exemplo, esperava 0 e ACK= 0, ele vai enviar o pacote com o ACK correto para o sender
          print("recebi o pacote deboinhas", packet)
          this.send(packet)
        }
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