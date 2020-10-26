function isNumeric(num){
  return !isNaN(num)
}

function splitFetAmount(value){
  return value.split("atestfet")[0]
}

module.exports = {
  isNumeric: isNumeric,
  splitFetAmount: splitFetAmount
}