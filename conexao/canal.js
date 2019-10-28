const delay = require('../util/delay')            // adiciona delay
const corrupt = require('../util/corrupt')        // corrompe pacotes
const { print: { canal } } = require('../config') // configuração do canal
const print = require('../util/logger')(canal)    // print bonitinho 

module.exports = class Channel {
  
  sender = null
  aEnviar = []

  constructor({ atraso, bandwidth, lossRate, noLoss, corruptionRate}) {
    this.atraso = atraso
    this.bandwidth = bandwidth
    this.lossRate = lossRate
    this.noLoss = noLoss
    this.corruptionRate = corruptionRate
  }

  // enquanto tiver um pacote a ser enviado, transmite eles para serem enviados
  // OBS: manda 1 pacote por vez, e demora pacote.size / bandwith segundos para transmitir o pacote
  sendLoop = () => {
    // se não tem pacote a ser enviado, retorna
    if (this.aEnviar.length === 0) return

    // pegar o pacote a ser enviado
    const { data, header } = this.aEnviar.shift()
    const packet = { data, header }

    // transima o pacote
    delay(1000 * header.size / this.bandwidth)
      .then(() => print("terminei de transmitir o pacote", packet, ", agora a rede vai levar ele até o meu remetente"))
      .then(() => print("a lista de pacotes que faltam ser enviados é", this.aEnviar))
      .then(() => this.sendPacket(packet))
      .then(() => this.aEnviar.length !== 0 && this.sendLoop())  // mande o próx pacote, se existir
  }
  
  // manda um pacote pela conexão (que demora this.atraso ms para chegar)
  sendPacket = packet => {
    print("a rede está transportando o pacote:", packet, `mas a rede tem um delay de ${this.atraso}ms (${this.atraso/1000}s)`)
    delay(this.atraso)
    .then(() => Math.random() <= this.lossRate && !this.noLoss              // O pacote se perdeu no canal?
      ? print(`oops, a rede perdeu o pacote`, packet, ` no caminho`)        // sim, se perdeu no canal
      : Math.random() <= this.corruptionRate                                // O pacote foi corrimpido no caminho?
          ? print(`o pacote foi entregue, mas foi corrompido!!!`) || this.sender(corrupt(packet)) // sim, foi entregue corrompido
          : print(`o pacote foi entregue!`, packet) || this.sender(packet)  // não, foi entregue intacto
      )
  }

  // por onde mandar mensagens
  setSender = sender => this.sender = sender

  // transmitir para a camada de rede o que a camada de transporte mandar
  send = (...pacotes) => {

    // se não está enviando pacotes (lista de envio vazia)
    const comeceLoop = this.aEnviar.length === 0

    // adicione os pacoter para serem enviados
    this.aEnviar.push(...pacotes)

    // se não está enviando pacotes, envie pacotes
    if (comeceLoop) this.sendLoop()
  }

}