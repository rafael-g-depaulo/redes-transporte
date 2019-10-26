const { parentPort } = require('worker_threads')          // por onde o canal pode mandar mensagens para o emissor
const config = require('./canalConfig')                   // configuração do canal
const Channel = require('./util/canal')                   // canal de comunicação com o emissor
const print = require('./util/logger')('RECEPTOR', '95m') // print bonitinho
const Packet = require('./util/packet')                   // criador de pacotes

const emissor = parentPort                        // pegar referencia do emissor
const canal = new Channel(config)                 // criando o canal de comunicação com o emissor
canal.setSender(msg => emissor.postMessage(msg))  // configurando para onde o canal deve mandar mensagens saindo do receptor (para o emissor)

// quando receber mensagens da camada de rede, mandar para a camada de transporte
emissor.on('message', message => {
  print("caraca, olha o que eu recebi", message)
  print("Agora olha lá oh emissor, que eu vou te retornar uma mensagem idiota")
  canal.send(new Packet("kkk, olha o idiota"))
}) 