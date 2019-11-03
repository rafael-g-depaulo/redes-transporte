const Host = require('./host')

module.exports = class Sender extends Host {
  toSend = []   // lista de pacotes a serem enviados
  
  constructor(channel) {
    super(channel, "emissorME")
  }

  // quando receber mensagens a enviar, coloque na lista de coisas a serem enviadas
  sendMsg = (...data) => {
    this.toSend.push(...data)
    this.sendWaitingMessages()
  } 

}