const { Decimal } = require('decimal.js')


function isNumeric(num){
  return !isNaN(num)
}


function splitFetAmount(value){
  return value.split("atestfet")[0]
}


async function queryERC20BalanceFET(contract, address) {
    console.log("balance address: ", address)
    const fncDesc = `queryERC20BalanceFET(${contract.address}, ${address})`

    let balanceFET = new Decimal('0')
    try {
        const balance = await contract.methods.balanceOf(address).call()
        const decimals = await contract.methods.decimals().call()

        const canonicalMultiplier = new Decimal(`1e${decimals.toString()}`)
        const balanceCanonicalFET = new Decimal(balance.toString())

        if (! balanceCanonicalFET.isZero()) {
            balanceFET = balanceCanonicalFET.div(canonicalMultiplier).toString()
        }
    }
    catch(error) {
            console.log(`Error in ${fncDesc}:`, error)
    }

    console.log(`${fncDesc}: ${balanceFET} [FET]`)
    return balanceFET
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
    isNumeric,
    splitFetAmount,
    queryERC20BalanceFET,
    removeDecimalComponent: removeDecimalComponent,
    divideByDecimals: divideByDecimals,
}
