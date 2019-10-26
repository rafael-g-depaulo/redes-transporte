module.exports = class Packet {
  constructor(message) {
    let total = 0
    for (let i = 0; i < message.length; i++)
      total += message.charCodeAt(i)
    
    this.message = message      // mensagem
    this.size = message.length  // tamanho em bytes da mensagem (cada char tem 1 byte)
    this.checksum = total & 1   // pega o primeiro digito binário da soma da mensagem
  }
}