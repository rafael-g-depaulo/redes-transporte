const { Packet, Checksum } = require('../../util/packet')
const Sender = require('../sender')
const isCorrupted = require('../../util/corrupt')

module.exports = class RDTSender extends Sender {

  // Para começar teremos uma janela
  windowSize = 4
  seqNum = 0           // o ack sempre começara no 0, esse é meu nextseqnum
  base = this.seqNum   // base seria o meu expected sequence number

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
    
    sent_noACK.unshift()
    console.log("recebi pacote", packet)
    // se os ack forem iguais E a call da de cima tiver sido feita, ele pode receber pacotes
    if (0 === this.seqNum) {
      clearTimeout(this.timeout)
      this.print(`parei o tempo pq ta de boa`)

    // se não for igual ao next seq number, rola timer novo
    } else
      this.startTimeout()
    
    this.deliver(packet.data)
    this.sendWaitingMessages()  // se tem mais mensagens para enviar, faça isso
  }

  startTimeout = () => {
    this.timeout = setTimeout(() => {
      this.startTimeout()
      for (let i = 0; i < this.windowSize && i < this.sent_noACK.length; i++) {
        setTimeout(() => this.send2Net(this.sent_noACK[i]), this.timeoutAmmount)
      }
    }, this.timeoutAmmount)
  }

  sendWaitingMessages = () => {
    // se não tiver pacotes pra enviar, não faça nada
    if (this.toSend.length === 0) return
    // se tiver pacotes pra enviar


    // aqui eu verifico se minha window esta cheia. se meu nextseqnum > base + window, ela esta cheia
    if (this.seqNum < this.windowSize) {    // se o numero de mensagens enviado for menor que o da banda
      const proxMsg = this.toSend.shift()               // anda no array e recebe o elemento que foi retirado
      this.print("prox msg:", proxMsg)
      const aux = new Packet(proxMsg, { ack: this.seqNum })   // cria o pacote com a mensagem e o numero de sequencia
      this.sent_noACK.push(aux)                     // bota esse pacote na lista de pacotes enviados (vai de 0 a N)
      this.send2Net(aux)                                // envia o aux para o receptor
      
      // se a base é igual ao prox numero de sequencia, comece o timer
      if (0 === this.seqNum)
        this.startTimeout()

      // Incremente o numero de sequencia da proxima mensagem
      this.seqNum++
      this.seqNum %= this.windowSize
    } else print("minha janela ta cheinha")

  }

  // chamado pela camada de transporte (essa classe) quando quiser enviar mensagens para receptor
  send2Net = packet => {
    this.send(packet)
  }
}