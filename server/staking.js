const {
    STAKING_CONTRACT_ABI_STRINGIFIED,
    STAKING_CONTRACT_ADDRESS,
    PROJECT_ID,
}  = require('./constants')
const { Decimal } = require('decimal.js')


const decimalPrecision = 32
const fetErc20CanonicalMultiplier = new Decimal('1e18')
const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${PROJECT_ID}`))
const contract = new web3.eth.Contract(JSON.parse(STAKING_CONTRACT_ABI_STRINGIFIED), STAKING_CONTRACT_ADDRESS)


function getAccruedGlobalPrincipal(contract) {
  return  contract.methods._accruedGlobalPrincipal().call()
}

function getAccruedGlobalLiquidity(contract) {
  return  contract.methods._accruedGlobalLiquidity().call()
}

function getAccruedGlobalLocked(contract) {
  return contract.methods._accruedGlobalLocked().call()
}

function getRewardsPoolBalance(contract) {
  return contract.methods._rewardsPoolBalance().call()
}

function getLockPeriod(contract) {
  return contract.methods._lockPeriodInBlocks().call()
}


function canonicalFetToFet(canonicalVal) {
    const origPrecision = Decimal.precision
    Decimal.set({ precision: decimalPrecision })
    try {
        return (new Decimal(canonicalVal)).div(fetErc20CanonicalMultiplier)
    }
    finally {
        Decimal.set({ precision: origPrecision })
    }
}


function assetFromContractAsset(contractAsset) {
    principal = canonicalFetToFet(contractAsset.principal)
    compoundInterest = canonicalFetToFet(contractAsset.compoundInterest)
    return { principal, compoundInterest }
}


async function pollStakingContractState() {
    const accruedGlobalPrincipalPromise = getAccruedGlobalPrincipal(contract)
    const accruedGlobalLiquidityPromise = getAccruedGlobalLiquidity(contract)
    const accruedGlobalLockedPromise = getAccruedGlobalLocked(contract)
    const rewardsPoolBalancePromise = getRewardsPoolBalance(contract)
    const lockPeriodPromise = getLockPeriod(contract)

    //await Promise.all([accruedGlobalPrincipalPromise, accruedGlobalLiquidityPromise, accruedGlobalLockedPromise, rewardsPoolBalancePromise, lockPeriodPromise])

    const userFundsTransferredInToTheContract = canonicalFetToFet(await accruedGlobalPrincipalPromise)
    const liquidFunds = assetFromContractAsset(await accruedGlobalLiquidityPromise)
    const lockedFunds = assetFromContractAsset(await accruedGlobalLockedPromise)
    const rewardsPoolCurrentBalance = canonicalFetToFet(await rewardsPoolBalancePromise)
    const lockPeriod = parseInt(await lockPeriodPromise)

    const stakedFunds = accruedGlobalPrincipalPromise.sub(accruedGlobalLockedPromise.principal).sub(accruedGlobalLiquidityPromise.principal)
    const rewardsPoolMinimumNecessaryBalance = accruedGlobalLockedPromise.compoundInterest.add(accruedGlobalLiquidityPromise.compoundInterest)
    const allFundsInTheContract = accruedGlobalPrincipalPromise.add(rewardsPoolCurrentBalance)

    retval = {
        userFundsTransferredInToTheContract,
        liquidFunds,
        lockedFunds,
        rewardsPoolCurrentBalance,
        lockPeriod,
        stakedFunds,
        rewardsPoolMinimumNecessaryBalance,
        allFundsInTheContract
    }

    return retval
}

async function isRewardsPoolBalanceSufficient(stakingContractState) {
    return stakingContractState.rewardsPoolCurrentBalance >= stakingContractState.rewardsPoolMinimumNecessaryBalance
}
