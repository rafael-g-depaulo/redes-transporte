module.exports = class Sender {
  constructor(channel) {
    // para mandar mensagens para o outro host, mande pelo this.send
    this.send = channel.send  
  }
  
  // recebe mensagens por esse método
  recieve = packet => {

  }

  sendMsg = packet => {
    this.send(packet)

    setTimeout(() => {
      // checar se eu não recebi o ack
      if (true)
        this.resendPreviousPacket(packet)
    }, 10000)
  }
}