const delay = require('./delay')                  // adiciona delay
const print = require('./logger')('CANAL', '92m') // print bonitinho

module.exports = class Channel {
  
  sender = null

  constructor({ atraso, bandwidth, lossRate, noLoss }) {
    this.atraso = atraso
    this.bandwidth = bandwidth
    this.lossRate = lossRate
    this.noLoss = noLoss
  }
  
  // por onde mandar mensagens
  setSender = sender => this.sender = sender

  // mandar para a camada de rede o que a camada de transporte mandar
  send = ({ data, size }) => {
    
    print("emissor/receptor me mandou mandar uma mensagem:", { data, size })
    
    // se a mensagem se perdeu no canal, e não é pra ser mandada
    if (Math.random() < this.lossRate && !this.noLoss)
      return print(`mas eu "perdi" a mensagem no meio do caminho kkkk`)

    // aqui da pra botar condição de corromper a mensagem tbm, da mesma forma
    
    print(`mas eu vou dar um delay de ${this.atraso}ms (${this.atraso/1000}s)`)
    delay(this.atraso)
      .then(() => this.sender({ data, size, merda: "o canal adicionou lixo" }))
  }

}