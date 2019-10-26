module.exports = class Packet {
  constructor(data) {
    let total = 0
    for (let i = 0; i < data.length; i++)
      total += data.charCodeAt(i)
    
    this.data = data        // mensagem
    this.header = {         // cabeçalhos
      size: data.length,    // tamanho em bytes da mensagem (cada char tem 1 byte)
      checksum: total & 1   // pega o primeiro digito binário da soma da mensagem
    }
  }
}