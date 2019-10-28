module.exports = ({ log = true, nome = "SEMNOME", cor = "37m" }) => !log
  ? () => {}
  : (...logs) => console.log(`\x1b[${cor}[${nome}]\x1b[0m`, ...logs)