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


module.exports = {
    isNumeric,
    splitFetAmount,
    queryERC20BalanceFET,
}
