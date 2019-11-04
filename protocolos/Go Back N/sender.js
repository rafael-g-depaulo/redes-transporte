const { Packet, Checksum } = require('../../util/packet')
const Sender = require('../sender')
const { isCorrupted } = require('../../util/packet')
const { windowSize } = require('../../config')

module.exports = class RDTSender extends Sender {

  // Para começar teremos uma janela
  seqNum = 1           // o ack sempre começara no 0, esse é meu nextseqnum
  base = this.seqNum   // base seria o meu expected sequence number
  hasTimeout = false
  lastAckRecieved = 0

  // vamos construir as coisinhas
  sent_noACK = [] // mensagens enviadas mas que nao receberam ACK ainda, é um array de pacotes
  toSend = []     // recebe o total de mensagens e fica depois como mensagens a serem enviadas

  //   callMade = false
  //   sentPacket = null

  constructor(channel) {
    super(channel)  // chama a superclasse
  }

  // recebe mensagens por esse método
  // Se o ACK = 0 e ele receber 0, muda o estado para ACK = 1 callMade = false. Assim ele pode receber uma nova call. 
  // Se o ACK = 1 e ele receber 1, muda o estado para ACK = 0 callMade = false. Assim ele pode receber nova call
  // Se ACK = 0 e ele receber 1, ou ACK=1 e recebe 0, ele não faz nada até o tempo acabar.
  recieve = packet => {
    if (isCorrupted(packet)) return       // se o pacote veio corrompido, retorne

    this.print("recebi um ACK", packet.header.ack)
    while (this.lastAckRecieved < packet.header.ack) {
      this.deliver(packet.data)
      this.lastAckRecieved++
    }
    this.base = packet.header.ack

    // se os ack forem iguais E a call da de cima tiver sido feita, ele pode receber pacotes
    if (this.base === this.seqNum) {
      clearTimeout(this.timeout)
      this.hasTimeout = false
      this.print(`parei o tempo porque eu estou recebendo no mesmo ritmo que estou enviando`)

    // se não for igual ao next seq number, rola timer novo
    } else
      this.startTimeout()
    
    this.sendWaitingMessages()  // se tem mais mensagens para enviar, faça isso
  }

  startTimeout = () => {
    if (this.hasTimeout) return
    
    this.hasTimeout = true
    this.timeout = setTimeout(() => {
      this.hasTimeout = false
      this.startTimeout()
      for (let i = this.base; i <= this.seqNum; i++)
      if (this.sent_noACK[i])
        this.send2Net(this.sent_noACK[i])
          
      this.sendWaitingMessages()
    }, this.timeoutAmmount)
  }

  sendWaitingMessages = () => {
    // se não tiver pacotes pra enviar, não faça nada
    if (this.toSend.length === 0) return this.startTimeout()
    if (this.seqNum > this.base + windowSize) return
    // se tiver pacotes pra enviar
    
    // aqui eu verifico se minha window esta cheia. se meu nextseqnum > base + window, ela esta cheia
    if (this.seqNum < this.base + windowSize) {    // se o numero de mensagens enviado for menor que o da banda
      const proxMsg = this.toSend.shift()               // anda no array e recebe o elemento que foi retirado
      this.print("prox msg:", proxMsg)
      this.currentPkt = new Packet(proxMsg, { ack: this.seqNum })   // cria o pacote com a mensagem e o numero de sequencia
      this.sent_noACK.push(this.currentPkt)                     // bota esse pacote na lista de pacotes enviados (vai de 0 a N)
      this.send2Net(this.currentPkt)                                // envia o aux para o receptor
      
      // se a base é igual ao prox numero de sequencia, comece o timer
      if (0 === this.seqNum)
        this.startTimeout()

      // Incremente o numero de sequencia da proxima mensagem
      this.seqNum++
      
      this.sendWaitingMessages()
    }  else {
      this.startTimeout()
      this.send2Net(this.currentPkt)
    }
  }

  // chamado pela camada de transporte (essa classe) quando quiser enviar mensagens para receptor
  send2Net = packet => {
    this.send(packet)
  }
}