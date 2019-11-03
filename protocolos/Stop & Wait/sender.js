const { Packet, Checksum } = require('../../util/packet')
const Sender = require('../sender')

module.exports = class StopWait_Sender extends Sender {

 //aqui a gente tem um tamanho de janela
 windowSize = 4;
  expectedACK = 0
  callMade = false
  sentPacket = null

  toSend = []

  constructor(channel) {
    super(channel)  // chama a superclasse
  }
  
  // recebe mensagens por esse método
  //Se o ACK = 0 e ele receber 0, muda o estado para ACK = 1 callMade = false. Assim ele pode receber uma nova call. 
  //Se o ACK = 1 e ele receber 1, muda o estado para ACK = 0 callMade = false. Assim ele pode receber nova call
  //Se ACK = 0 e ele receber 1, ou ACK=1 e recebe 0, ele não faz nada até o tempo acabar.
  recieve = packet => {
    // se os ack forem iguais E a call da de cima tiver sido feita, ele pode receber pacotes
    if (this.callMade && this.expectedACK === packet.header.ack) {
      // recebeu a resposta, então limpe o timeout
      clearTimeout(this.timeout)
      this.print(`recebi um ACK #${packet.header.ack}, que é o que eu esperava`)
      this.expectedACK ^= 1   // muda o estado atual para o oposto
      this.callMade = false   // muda o estado. Não estou mais esperando um ACK

      this.deliver(packet.data)

      // se tem mais mensagens para enviar, faça isso
      this.sendWaitingMessages()
    }
  }

  sendWaitingMessages = () => {
    // se não tiver pacotes pra enviar, não faça nada
    if (this.toSend.length === 0) return

    //Se nao tiver enviando uma mensagem
    if (!this.callMade) {
      const proxMsg = this.toSend.shift()
      this.send2Net(this.sentPacket = new Packet(proxMsg, { ack: this.expectedACK }))
    } else print("fui mandado enviar uma mensagem quando já estou esperando o ack de outro pacote")
    
  }

  // chamado pela camada de transporte (essa classe) quando quiser enviar mensagens para receptor
  send2Net = packet => {
    this.callMade = true
    this.send(packet)
    this.print(`estou enviando um pacote para o receptor. (seqNum: #${packet.header.ack})`)

    this.timeout = setTimeout(() => {
      this.print("estourou o timeout, reenviando pacote", packet)
      this.send2Net(packet)
    }, this.timeoutAmmount)   
  }
}