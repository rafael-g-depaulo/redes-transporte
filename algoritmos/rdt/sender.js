const { Packet, Checksum } = require('../../util/packet')
const print = require('../../util/logger')('RECIEVER-ME', "93m")

module.exports = class Sender {
 //Teremos então 4 estados nessa classe
 // inicial ACK=0 callMade= false (nao recebeu tarefa)
 // ACK=0 CallMade = true (recebeu tarefa, espera respossta 0)
 //ACK = 1 CallMade = false (espera tarefa nova)
 //ACK = 1 CallMade = true (recebeu tarefa, espera resposta 1)
  expectedACK = 0
  callMade = false
  sentPacket = null

  constructor(channel) {
    // para mandar mensagens para o outro host, mande pelo this.send
    this.send = channel.send  
  }
  
  // recebe mensagens por esse método
  //Se o ACK = 0 e ele receber 0, muda o estado para ACK = 1 callMade = false. Assim ele pode receber uma nova call. 
  //Se o ACK = 1 e ele receber 1, muda o estado para ACK = 0 callMade = false. Assim ele pode receber nova call
  //Se ACK = 0 e ele receber 1, ou ACK=1 e recebe 0, ele não faz nada até o tempo acabar.
  recieve = packet => {
    print("to recebendo e o meu callmade ta", this.callMade)
    print("e o ack que eu espero ta ", this.expectedACK)
    print("e o ack que eu recebo ta ", packet.header.ack)

    if((this.expectedACK == packet.header.ack) && (this.callMade == true)){//se os ack forem iguais E a call da de cima tiver sido feita, ele pode receber pacotes
      clearTimeout(this.timeout)
      if(this.expectedACK == 0) {
        print("recebi e mudei meu estado pra ack = 1")
        this.expectedACK = 1 //muda o estado atual para o oposto
      }
      else {
        print("recebi e mudei meu estado pra ack = 1")
        this.expectedACK = 0
      }
      print("meu estado atual é esperaACK", this.expectedACK)
      this.callMade = false
    }
  }

  // chamado pela camada de aplicação quando quiser enviar mensagens para receptor
  rdtSendMsg = data => {
    if(!this.callMade){//Se nao tiver enviando uma mensagem
      print("cheguei no sender")
      this.sendMsg(this.sentPacket = new Packet(data.data, { ack: this.expectedACK }))
    }
    else print("desculpa, ja to enviando uma mensagem bonitinha :(")
  }
  
  // chamado pela camada de transporte (essa classe) quando quiser enviar mensagens para receptor
  sendMsg = packet => {
    print("estou enviando e esperando ack", this.expectedACK)
    this.callMade = true
    print("callMade esta ", this.callMade)
    this.send(packet)
    print("começou o timeouot")

    this.timeout = setTimeout(() => {
      print("estourou o timeout, reenviando pacote", packet)
     
      // checar se eu não recebi o ackk
      // if ((!this.expected) || packet.data=="corrompido")//Se for falso OU se packet estiver corrompido
        this.sendMsg(packet)
    }, 10000)   
  }
  
  
  

}