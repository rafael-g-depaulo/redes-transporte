exports.Packet = class {
  constructor(data, { ack = 0, options = {} }) {
    options.length = options.length || 0
    const size = data.length + 5*4 + options.length

    this.data = data                    // mensagem
    this.header = {                     // cabeçalhos
      size,                             // tamanho em bytes da mensagem (cada char tem 1 byte)
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

exports.isCorrupted = packet => packet.header.checksum != exports.Checksum(packet.data)