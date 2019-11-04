const { getPrint } = require('../util/logger') // print bonitinho

module.exports = class Host {
  // ! Não dê override nesse método quando for fazer uma subclasse de Host
  msgHandlers = [() => {}] // o que fazer quando for entregar mensagens para a camada de aplicação

  constructor(channel, configName) {
    // cria o print personalizado
    this.print = getPrint(configName)
    // para mandar mensagens para o outro host pela camada de rede o this.send é usado
    this.send = channel.send  
  }
  
  // configura o que fazer quando for entregar mensagens para a camada de aplicação
  // ! Não dê override nesse método quando for fazer uma subclasse de Host
  onMsg = msgHandler => this.msgHandlers.push(msgHandler)

  // entrega mensagens para a camada de aplicação
  // ! Não dê override nesse método quando for fazer uma subclasse de Host
  deliver = pkt => this.msgHandlers.forEach(x => x(pkt.data))

  // recebe pacotes da camada de rede por esse método
  // o método é chamado quando receber da camada de rede um pacote
  recieve = packet => {}

  // a camada de aplicação mandou mandar uma mensagem para o outro host
  sendMsg = msg => {}

  // chamado pela camada de transporte (essa camada) quando for pra enviar um pacote para...
  // o outro Host pela camada de rede (usando o this.send)
  send2Net = pkt => this.send(pkt)
}