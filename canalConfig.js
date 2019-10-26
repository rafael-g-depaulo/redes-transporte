module.export = {
  // quantos ms demora para o primeiro byte de um pacote que começou a ser enviado a chegar ao destino
  atraso: 1000,
  // quantos bytes podem passar pelo canal por segundo
  bandwidth: 500,
  // qual a porcentagem (0 a 1) de pacotes que se perdem no caminho
  lossRate: 0.5,
  // se o canal não tem perda de pacotes (se "true", é equivalente a lossRate = 0)
  noLoss: false,
}