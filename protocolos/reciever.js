const Host = require('./host')

module.exports = class Reciever extends Host {
  toSend = []   // lista de pacotes a serem enviados
  
  constructor(channel) {
    super(channel, "receptorME")
  }
  
}