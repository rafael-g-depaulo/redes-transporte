const { Worker } = require('worker_threads')              // biblioteca para criar uma thread paralela que serve como o receptor
const Channel = require('./util/canal')                   // canal
const config = require('./canalConfig')                   // configuração do canal
const print = require('./util/logger')('EMISSOR', '36m')  // print bonitinho
const Packet = require('./util/packet')

console.log('\n\x1b[90m\x1b[1m--- Começando Programa -------------------------------------------------------------------------------------\x1b[0m')

const receptor = new Worker('./receptor.js')      // criar o receptor
const canal = new Channel(config)                 // criar o canal que simula atraso, perda de pacotes e limite de banda
canal.setSender(msg => receptor.postMessage(msg)) // configurando para onde o canal deve mandar mensagens saindo do emissor (para o receptor)

// o que fazer quando a camada de transporte recebe uma mensagem
receptor.on('message', message => {
  print("eu recebi a seguinte mensagem:", message)
})

// mandar uma mensagem para o receptor, para testar que o canal funciona (ISSO NÃO FICA NO TRABALHO, É SÓ PRA TESTAR SE O CANAL FUNCIONA)
const mensagem = new Packet("oi sdds")
print("eu vou mandar uma mensagem para o receptor", mensagem)
canal.send(mensagem)