exports.makePrint = ({ log = true, nome = "SEMNOME", cor = "37m" }) => !log
  ? () => true
  : (...logs) => console.log(`\x1b[${cor}[${nome}]\x1b[0m`, ...logs) || true

exports.getPrint = configName => exports.makePrint(require('../config').print[configName])

