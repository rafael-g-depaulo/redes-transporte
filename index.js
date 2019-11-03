const emissor = require('./conexao/emissor')              // emissor
const print = require('./util/logger').getPrint("index")  // print bonitinho
const { protocol } = require('./config')                  // configurações da questão
const delay = require('./util/delay')                     // delay
const {
  startTimer,
  endTimer,
  getTotalTime,
 } = require('./util/timer')                              // helpers para temporizar a eficiência da comunicação

// da um warning se não tiver essa linha
process.setMaxListeners(0)

console.log('\n\x1b[90m\x1b[1m--- Começando Programa -------------------------------------------------------------------------------------\x1b[0m')

// testar quanto tempo demora para mandar 10 mensagens para o emissor
<<<<<<< Updated upstream
const totalMsg = 10        // numero total de mensagens a serem enviadas
=======
const totalMsg = 8        // numero total de mensagens a serem enviadas
>>>>>>> Stashed changes
let atualMsgs = totalMsg  // numero de mensagens que faltam serem enviadas
const msgs = Array        // cria as mensagens a serem enviadas
  .from({length: totalMsg})
  .map((_, i) => `mensagem #${i+1}`)


print(`eu vou calcular quanto tempo demora para o protocolo ${protocol} enviar ${totalMsg} mensagens`)

delay(1000).then(() => startTimer() && emissor.send(...msgs))

 emissor.onMsg(msg => {
  // se ainda não é a resposta da última mensagem, não faça nada
  if (--atualMsgs > 0) return
  
  // se recebeu a resposta para a última mensagem, termine o timer e pare o programa
  endTimer()

  // espere 1 segundo e mostre os resultados para o usuário
  delay(1000).then(() => {

    const totalTime = getTotalTime()

    print(`todas as ${totalMsg} mensagens foram enviadas e recebidas. O tempo gasto foi ${totalTime}ms (${totalTime / 1000}s)`)

    // termina tudo
    emissor.endConnection()
  })
})

