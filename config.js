module.exports = {
  // se é pra printar a linha de pensamento de cada participante disso
  print: {
    canal: {
      log: false,
      nome: 'CANAL',
      cor: '92m',
    },
    emissor: {
      log: true,
      nome: 'EMISSOR',
      cor: '36m',
    },
    emissorME: {
      log: false,
      nome: 'EMISSOR-ME',
      cor: '93m',
    },
    receptor: {
      log: true,
      nome: 'RECEPTOR',
      cor: '95m',
    },
    receptorME: {
      log: false,
      nome: 'RECEPTOR-ME',
      cor: '93m',
    },
  },
  canal: {
    // quantos ms demora para o primeiro byte de um pacote que começou a ser enviado a chegar ao destino
    atraso: 1,
    // quantos bytes podem passar pelo canal por segundo
    bandwidth: 1000,
    // qual a porcentagem (0 a 1) de pacotes que se perdem no caminho
    lossRate: 0,
    // se o canal não tem perda de pacotes (se "true", é equivalente a lossRate = 0)
    noLoss: false,
    // qual a chance (0 a 1) de pacotes (que não são perdidos no caminho) de serem corrompidos
    corruptionRate: 0.2,
  },
}