module.exports = {
  // se é pra printar a linha de pensamento de cada participante disso
  print: {
    canal: {
      log: false,
      nome: 'REDE',
      cor: '92m',
    },
    emissor: {
      log: true,
      nome: 'EMISSOR-APP',
      cor: '36m',
    },
    emissorME: {
      log: true,
      nome: 'EMISSOR-TRANS',
      cor: '93m',
    },
    receptor: {
      log: true,
      nome: 'RECEPTOR-APP',
      cor: '95m',
    },
    receptorME: {
      log: true,
      nome: 'RECEPTOR-TRANS',
      cor: '93m',
    },
    index: {
      log: true,
      nome: 'MAIN',
      cor: '91m',  
    },
  },
  canal: {
    // quantos ms demora para o primeiro byte de um pacote que começou a ser enviado a chegar ao destino
    atraso: 500,
    // quantos bytes podem passar pelo canal por segundo
    bandwidth: 1000,
    // qual a porcentagem (0 a 1) de pacotes que se perdem no caminho
    lossRate: 0,
    // se o canal não tem perda de pacotes (se "true", é equivalente a lossRate = 0)
    noLoss: false,
    // qual a chance (0 a 1) de pacotes (que não são perdidos no caminho) de serem corrompidos
    corruptionRate: 0,
  },
  protocol: "GoBack",
  senderTimeout: 5000,
}