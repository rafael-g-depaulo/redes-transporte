module.exports = class Sender {
 
  received = false

  constructor(channel) {
    // para mandar mensagens para o outro host, mande pelo this.send
    this.send = channel.send  
  }
  
  // recebe mensagens por esse método
  recieve = packet => {
    received = true;
  }

  sendMsg = packet => {
    this.send(packet)

    setTimeout(() => {
      // checar se eu não recebi o ackk
      if (!received)
        this.sendMsg(packet)
    }, 10000)
  }
}