const { Packet } = require('./util/packet')   // criador de pacotes
const emissor = require('./conexao/emissor')  // emissor

// da um warning se não tiver essa linha
process.setMaxListeners(0)

console.log('\n\x1b[90m\x1b[1m--- Começando Programa -------------------------------------------------------------------------------------\x1b[0m')

// mandar uma mensagem para o receptor, para testar que o canal funciona (ISSO NÃO FICA NO TRABALHO, É SÓ PRA TESTAR SE O CANAL FUNCIONA)
setTimeout(() => emissor.send("oi saudades"), 1000)
