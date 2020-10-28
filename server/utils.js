const  removeTrailingZeros =  require('remove-trailing-zeros')

function isNumeric(num){
  return !isNaN(num)

}
function splitFetAmount(value){
  return value.split("atestfet")[0]

}

function divideByDecimals(amount, decimals) {
  // pad to length if short of single actual fet
  amount = amount.padStart(decimals + 1, '0')
  // insert the decimal at the correct position
  const output = [
    amount.slice(0, -decimals),
    '.',
    amount.slice(-decimals)
  ].join('')

  return removeTrailingZeros(output)
}

function removeDecimalComponent(val){
  return val.split(".")[0]
}


module.exports = {
  isNumeric: isNumeric,
  removeDecimalComponent: removeDecimalComponent,
  divideByDecimals: divideByDecimals,
  splitFetAmount: splitFetAmount
}