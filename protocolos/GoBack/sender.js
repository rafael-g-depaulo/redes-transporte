const { Packet, Checksum } = require('../../util/packet')
const Sender = require('../sender')

module.exports = class RDTSender extends Sender {

 //Para começar teremos uma janela
    windowSize = 4
    ACK = 0 //o ack sempre começara no 0, esse é meu nextseqnum
    base = ACK //base seria o meu expected ACK
    //vamos construir as coisinhas
    sent_noACK = [] //mensagens enviadas mas que nao receberam ACK ainda, é um array de pacotes
    toSend = []//recebe o total de mensagens e fica depois como mensagens a serem enviadas
    
//   callMade = false
//   sentPacket = null


  constructor(channel) {
    super(channel)  // chama a superclasse
  }
  
  // recebe mensagens por esse método
  //Se o ACK = 0 e ele receber 0, muda o estado para ACK = 1 callMade = false. Assim ele pode receber uma nova call. 
  //Se o ACK = 1 e ele receber 1, muda o estado para ACK = 0 callMade = false. Assim ele pode receber nova call
  //Se ACK = 0 e ele receber 1, ou ACK=1 e recebe 0, ele não faz nada até o tempo acabar.
  recieve = packet => {
    // se os ack forem iguais E a call da de cima tiver sido feita, ele pode receber pacotes
    if (this.base === packet.header.ack) {//se o numero que eu to esperando for o do pacote enviado
      // recebeu a resposta, então limpe o timeout
      this.print(`recebi um ACK #${packet.header.ack}, que é o que eu esperava`)
      this.base = packet.header.ack + 1
      if(this.base === this.ACK){
          clearTimeout(this.timeout)
          this.print(`parei o tempo pq ta de boa`)

      }else {//se não for igual ao next seq number, rola timer novo
        this.timeout = setTimeout(() => {
            this.print("estourou o timeout, reenviando pacote", packet)
            for(i=0; i<this.windowSize; i++){
            this.send2Net(this.sent_noACK[base + i]);
            }
          }, 10000)   
          this.ACK = this.ACK + 1//Incremente o ack para usar como numero de sequencia da proxima mensagem.
        }
      

      this.deliver(packet.data)

      // se tem mais mensagens para enviar, faça isso
      this.sendWaitingMessages()
    }
    }
  

  
  sendWaitingMessages = () => {
    // se não tiver pacotes pra enviar, não faça nada
    if (this.toSend.length === 0) return
     //se tiver pacotes pra enviar
    //aqui eu verifico se minha window esta cheia. se meu nextseqnum > base + window, ela esta cheia
    if(this.ACK <= (this.base + this.windowSize)){//se o numero de mensagens enviado for menor que o da banda
        const proxMsg = this.toSend.shift()//anda no array e recebe o elemento que foi retirado
        aux = new Packet(proxMsg, { ack: this.ACK });//cria o pacote com a mensagem e o numero de sequencia
        this.sent_noACK.push(proxMsg)//bota esse pacote na lista de pacotes enviados (vai de 0 a N)
        this.send2Net(aux)//envia o aux para o receptor
        }else print("minha janela ta cheinha");
        
    //Se nao tiver enviando uma mensagem
    // if (!this.callMade) {
    //   const proxMsg = this.toSend.shift()
    //   this.send2Net(this.sentPacket = new Packet(proxMsg, { ack: this.expectedACK }))
    // } else print("fui mandado enviar uma mensagem quando já estou esperando o ack de outro pacote")
    
  }

  // chamado pela camada de aplicação quando quiser enviar mensagens para receptor
  // sendMsg = (...data) => {
  //   //Se nao tiver enviando uma mensagem
  //   if (!this.callMade) {
  //     this.toSend.push(...data) // adicionar a lista de coisas a enviar
  //     this.sendWaitingMessages()
  //   } else print("fui mandado enviar uma mensagem quando já estou esperando o ack de outro pacote")
  // }
  
  // chamado pela camada de transporte (essa classe) quando quiser enviar mensagens para receptor
  send2Net = packet => {
    this.callMade = true
    this.send(packet)
    this.print(`estou enviando um pacote para o receptor. (seqNum: #${packet.header.ack})`)
    if(this.base === this.ACK){
    this.timeout = setTimeout(() => {
      this.print("estourou o timeout, reenviando pacote", packet)
      for(i=0; i<this.windowSize; i++){
      this.send2Net(this.sent_noACK[base + i]);
      }
    }, 10000)   
    this.ACK = this.ACK + 1//Incremente o ack para usar como numero de sequencia da proxima mensagem.
  }
}
}