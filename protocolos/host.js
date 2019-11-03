const { getPrint } = require('../util/logger') // print bonitinho

module.exports = class Host {
  // ! Não dê override nesse método quando for fazer uma subclasse de Host
  msgHandler = () => {} // o que fazer quando for entregar mensagens para a camada de aplicação

  constructor(channel, configName) {
    // cria o print personalizado
    this.print = getPrint(configName)
    // para mandar mensagens para o outro host, mande pelo this.send
    this.send = channel.send  
  }
  
  // configura o que fazer quando for entregar mensagens para a camada de aplicação
  // ! Não dê override nesse método quando for fazer uma subclasse de Host
  onMsg = msgHandler => this.msgHandler = msgHandler

  // entrega mensagens para a camada de aplicação
  // ! Não dê override nesse método quando for fazer uma subclasse de Host
  deliver = pkt => this.msgHandler(pkt.data)

  // recebe pacotes da camada de rede por esse método
  // o método é chamado quando receber da camada de rede um pacote
  recieve = packet => {}

  // a camada de aplicação mandou mandar uma mensagem para o outro host
  sendMsg = msg => {}
}