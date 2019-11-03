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
const protocolName = 'Stop-&-Wait'
const totalMsg = 3        // numero total de mensagens a serem enviadas
let atualMsgs = totalMsg  // numero de mensagens que faltam serem enviadas


print(`eu vou calcular quanto tempo demora para o protocolo ${protocolName} enviar ${totalMsg} mensagens`)

const msgs = Array.from({length: totalMsg}).map((_, i) => `mensagem #${i+1}`)

setTimeout(() => startTimer() && emissor.send(...msgs), 1000)
emissor.onMsg(msg => {
  // se ainda não é a resposta da última mensagem, não faça nada
  if (--atualMsgs > 0) return

  // se recebeu a resposta para a última mensagem, termine o timer e pare o programa
  endTimer()
  const totalTime = getTotalTime()

  print(`todas as ${totalMsg} mensagens foram enviadas e recebidas. O tempo gasto foi ${totalTime}ms (${totalTime / 1000}s)`)
  emissor.endConnection()
})

