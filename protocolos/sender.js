const Host = require('./host')
const { senderTimeout } = require('../config')

module.exports = class Sender extends Host {
  toSend = []   // lista de pacotes a serem enviados
  
  constructor(channel) {
    super(channel, "emissorME")
    this.timeoutAmmount = senderTimeout
  }

  // quando receber mensagens a enviar, coloque na lista de coisas a serem enviadas
  sendMsg = (...data) => {
    this.toSend.push(...data)
    this.sendWaitingMessages()
  }

}