const Packet = require('./util/packet')
const emissor = require('./emissor')

console.log('\n\x1b[90m\x1b[1m--- Começando Programa -------------------------------------------------------------------------------------\x1b[0m')

// mandar uma mensagem para o receptor, para testar que o canal funciona (ISSO NÃO FICA NO TRABALHO, É SÓ PRA TESTAR SE O CANAL FUNCIONA)
emissor.send(new Packet("oi sdds"))
