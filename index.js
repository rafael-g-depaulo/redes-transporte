const emissor = require('./conexao/emissor')              // emissor
const print = require('./util/logger').getPrint("index")  // print bonitinho
const {
  startTimer,
  endTimer,
  getTotalTime,
 } = require('./util/timer')                              // helpers para temporizar a eficiência da comunicação

// da um warning se não tiver essa linha
process.setMaxListeners(0)

console.log('\n\x1b[90m\x1b[1m--- Começando Programa -------------------------------------------------------------------------------------\x1b[0m')

// testar quanto tempo demora para mandar 10 mensagens para o emissor
const totalMsg = 10       // numero total de mensagens a serem enviadas
let atualMsgs = totalMsg  // numero de mensagens que faltam serem enviadas

setTimeout(() => startTimer() && emissor.send(`mensagem #${atualMsgs--}`), 1000)
emissor.onMsg(msg => atualMsgs > 0
  ? emissor.send(`mensagem #${atualMsgs--}`)
  : endTimer() && print(`todas as ${totalMsg} mensagens foram enviadas e recebidas. O tempo gasto foi ${getTotalTime()}ms (${getTotalTime() / 1000}s)`)
)

