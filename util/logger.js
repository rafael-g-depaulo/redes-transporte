module.exports = (nome, color) => (...logs) => console.log(`\x1b[${color}[${nome}]\x1b[0m`, ...logs)