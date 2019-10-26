module.exports = pkt => {
  const randInd = Math.ceil(Math.random() * pkt.data.length) - 1
  const changedByte = String.fromCharCode(pkt.data.charCodeAt(randInd) ^ 1)
  pkt.data = pkt.data.substr(0, randInd) + changedByte + pkt.data.substr(randInd + 1)
  return pkt
}