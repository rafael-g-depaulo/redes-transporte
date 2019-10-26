module.exports = class Reciever {
  constructor(channel) {
    // para mandar mensagens para o outro host, mande pelo this.send
    this.send = channel.send  
  }
  
  // recebe mensagens por esse método
  recieve = packet => {
    if(isCorrupted(packet)){//se estiver corrompido
      this.send("corrompido")
    }    
    else{
      this.send("Nope")
    }

  }

  isCorrupted(packet){
      
  }
}