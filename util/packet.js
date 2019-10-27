exports.Packet = class {
  constructor(data, { ack }) {
    this.data = data                    // mensagem
    this.header = {                     // cabeçalhos
      size: data.length,                // tamanho em bytes da mensagem (cada char tem 1 byte)
      checksum: exports.Checksum(data), // checksum da mensagem
      ack,                              // ack bit
    }
  }
}

// pega o primeiro digito binário da soma da mensagem
exports.Checksum = data => {
  let total = 0
  for (let i = 0; i < data.length; i++)
    total += data.charCodeAt(i)
  return total & 1
}