module.exports = {
  // se é pra printar a linha de pensamento de cada participante disso
  print: {
    canal: {
      log: false,
      nome: 'REDE',
      cor: '92m',
    },
    emissor: {
      log: false,
      nome: 'EMISSOR-APP',
      cor: '36m',
    },
    emissorME: {
      log: false,
      nome: 'EMISSOR-TRANS',
      cor: '93m',
    },
    receptor: {
      log: false,
      nome: 'RECEPTOR-APP',
      cor: '95m',
    },
    receptorME: {
      log: false,
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
    atraso: 100,
    // quantos bytes podem passar pelo canal por segundo
    bandwidth: 100,
    // qual a porcentagem (0 a 1) de pacotes que se perdem no caminho
    lossRate: 0.05,
    // se o canal não tem perda de pacotes (se "true", é equivalente a lossRate = 0)
    noLoss: false,
    // qual a chance (0 a 1) de pacotes (que não são perdidos no caminho) de serem corrompidos
    corruptionRate: 0.003,
  },
  protocol: "Go Back N",
  senderTimeout: 5000,
  windowSize: 12,
}