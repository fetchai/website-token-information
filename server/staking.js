const {
    STAKING_CONTRACT_ABI_STRINGIFIED,
    STAKING_CONTRACT_ADDRESS,
    PROJECT_ID,
}  = require('./constants')
const Web3 = require('web3')
const { BN } = require('bn.js')
const { Decimal } = require('decimal.js')
const Prometheus = require('prom-client')


const decimalPrecision = 50
const fetErc20CanonicalMultiplier = new Decimal('1e18', )
const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${PROJECT_ID}`))
const contract = new web3.eth.Contract(JSON.parse(STAKING_CONTRACT_ABI_STRINGIFIED), STAKING_CONTRACT_ADDRESS)

const metrics = {
    usersFundsTransferredInToTheContract: new Prometheus.Gauge({ name: 'usersFundsTransferredInToTheContract', help: 'Funds which users deposited in to the contract (= principal) and have NOT withdrawn them yet' }),
    liquidFundsPrincipal: new Prometheus.Gauge({ name: 'liquidFundsPrincipal', help: 'Users principal funds which are LIQUID (in [FET]). These funds can be withdrawn from the contract, or be staked, at any point in time' }),
    liquidFundsRewards: new Prometheus.Gauge({ name: 'liquidFundsRewards', help: 'Users rewards funds which are LIQUID (in [FET]). These funds can be withdrawn from the contract, or be staked, at any point in time' }),
    lockedFundsPrincipal: new Prometheus.Gauge({ name: 'lockedFundsPrincipal', help: 'Users principal funds which are in LOCKED state (in [FET]). Please be AWARE that some portion of this locked funds, or potentially even ALL of them, can be already LIQUID (this applies for these locked funds for which locked period already expired)'}),
    lockedFundsRewards: new Prometheus.Gauge({ name: 'lockedFundsRewards', help: 'Users rewards funds which are in LOCKED state (in [FET]). Please be AWARE that some portion of this locked funds, or potentially even ALL of them, can be already LIQUID (this applies for these locked funds for which locked period already expired)'}),
    stakedFunds: new Prometheus.Gauge({ name: 'stakedFunds', help: 'Funds which are in staked state (in [FET]). This means that *ALL* of these funds are illiquid for *AT MINIMUM* lock period before they can be taken out of the contract, since they needs to be destaked first'}),
    rewardsPoolBalance: new Prometheus.Gauge({ name: 'rewardsPoolBalance', help: 'Balance in the rewards pool (in [FET])'}),
    rewardsPoolMinimumNecessaryBalance: new Prometheus.Gauge({ name: 'rewardsPoolMinimumNecessaryBalance', help: 'This represents minimal balance theoretically necessary to be present in rewards pool at the this time. The "theoretically necessary" means, that if ALL users would at this point decide to withdraw ALL of their assets they van possibly withdraw (their liquidity & unlocked funds) then in theory this metrics represents absolute MAXIMUM what all users together can possibly withdraw at this very point'}),
    allFundsInTheContract: new Prometheus.Gauge({ name: 'allFundsInTheContract', help: 'This metric represents ALL funds currently present in the contract (in [FET]) = all uses funds together in the the contract at this point(rewards excluded) + amount present in rewards pool. Thus this number must be equal to the contract balance'}),
    lockPeriod: new Prometheus.Gauge({ name: 'lockPeriod', help: 'Balance in the rewards pool (in [FET])'}),
}


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
        return (new Decimal(canonicalVal.toString())).div(fetErc20CanonicalMultiplier)
    }
    finally {
        Decimal.set({ precision: origPrecision })
    }
}


function toDecimalFETAsset(contractAsset) {
    principal = canonicalFetToFet(contractAsset.principal.toString())
    compoundInterest = canonicalFetToFet(contractAsset.compoundInterest.toString())
    return { principal, compoundInterest }
}


function toBNCanonicalFETAsset(contractAsset) {
    principal = new BN(contractAsset.principal.toString())
    compoundInterest = new BN(contractAsset.compoundInterest.toString())
    return { principal, compoundInterest }
}


function getAssetCompositeDecimalFET(assetDecimal) {
    return assetDecimal.principal.add(assetDecimal.compoundInterest)
}


async function pollStakingContractState() {
    const accruedGlobalPrincipalPromise = getAccruedGlobalPrincipal(contract)
    const accruedGlobalLiquidityPromise = getAccruedGlobalLiquidity(contract)
    const accruedGlobalLockedPromise = getAccruedGlobalLocked(contract)
    const rewardsPoolBalancePromise = getRewardsPoolBalance(contract)
    const lockPeriodPromise = getLockPeriod(contract)

    //await Promise.all([accruedGlobalPrincipalPromise, accruedGlobalLiquidityPromise, accruedGlobalLockedPromise, rewardsPoolBalancePromise, lockPeriodPromise])

    const usersFundsTransferredInToTheContract = new BN(await accruedGlobalPrincipalPromise)
    const liquidFunds = toBNCanonicalFETAsset(await accruedGlobalLiquidityPromise)
    const lockedFunds = toBNCanonicalFETAsset(await accruedGlobalLockedPromise)
    const rewardsPoolBalance = new BN(await rewardsPoolBalancePromise)
    const lockPeriod = parseInt(await lockPeriodPromise)

    const stakedFunds = usersFundsTransferredInToTheContract.sub(lockedFunds.principal).sub(liquidFunds.principal)
    const rewardsPoolMinimumNecessaryBalance = lockedFunds.compoundInterest.add(liquidFunds.compoundInterest)
    const allFundsInTheContract = usersFundsTransferredInToTheContract.add(rewardsPoolBalance)

    retval = {
        usersFundsTransferredInToTheContract,
        liquidFunds,
        lockedFunds,
        stakedFunds,
        rewardsPoolBalance,
        rewardsPoolMinimumNecessaryBalance,
        allFundsInTheContract,
        lockPeriod,
    }

    return retval
}


function toDecimalFETState(canonicalContractState) {
    return {
        usersFundsTransferredInToTheContract: canonicalFetToFet(canonicalContractState.usersFundsTransferredInToTheContract),
        liquidFunds: toDecimalFETAsset(canonicalContractState.liquidFunds),
        lockedFunds: toDecimalFETAsset(canonicalContractState.lockedFunds),
        stakedFunds: canonicalFetToFet(canonicalContractState.stakedFunds),
        rewardsPoolBalance: canonicalFetToFet(canonicalContractState.rewardsPoolBalance),
        rewardsPoolMinimumNecessaryBalance: canonicalFetToFet(canonicalContractState.rewardsPoolMinimumNecessaryBalance),
        allFundsInTheContract: canonicalFetToFet(canonicalContractState.allFundsInTheContract),
        lockPeriod: canonicalContractState.lockPeriod,
    }
}


async function updatePrometheusMetrics() {
    const canonicalState = await pollStakingContractState()
    const s = toDecimalFETState(canonicalState)

    console.log(`metrics: `, s)

    // Note(pb): Assumption is that this function is executed in the same
    // thread/worker as Prometheus fetch request itself. If not, then there is
    // risk that prometheus fetch request will read subset of metrics
    // from "old" state set by previous run of this function and rest of them
    // set by the current run.
    metrics.usersFundsTransferredInToTheContract.set(s.usersFundsTransferredInToTheContract.toNumber())
    metrics.liquidFundsPrincipal.set(s.liquidFunds.principal.toNumber())
    metrics.liquidFundsRewards.set(s.liquidFunds.compoundInterest.toNumber())
    metrics.lockedFundsPrincipal.set(s.lockedFunds.principal.toNumber())
    metrics.lockedFundsRewards.set(s.lockedFunds.compoundInterest.toNumber())
    metrics.stakedFunds.set(s.stakedFunds.toNumber())
    metrics.allFundsInTheContract.set(s.allFundsInTheContract.toNumber())
    metrics.rewardsPoolBalance.set(s.rewardsPoolBalance.toNumber())
    metrics.rewardsPoolMinimumNecessaryBalance.set(s.rewardsPoolMinimumNecessaryBalance.toNumber())
    metrics.lockPeriod.set(s.lockPeriod)

    return canonicalState
}


async function isRewardsPoolBalanceSufficient(stakingContractState) {
    return stakingContractState.rewardsPoolCurrentBalance.gte(stakingContractState.rewardsPoolMinimumNecessaryBalance)
}

module.exports = {
    pollStakingContractState,
    isRewardsPoolBalanceSufficient,
    updatePrometheusMetrics,
    toDecimalFETState,
    toBNCanonicalFETAsset,
    getAssetCompositeDecimalFET,
    metrics,
}
