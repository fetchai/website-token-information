const {
   ETHERSCAN_API_KEY,
 CONTRACT_ABI_STRINGIFIED,
  STAKING_CONTRACT_ABI_STRINGIFIED, CONTRACT_ADDRESS,
 STAKING_CONTRACT_ADDRESS,
 CONTRACT_OWNER_ADDRESS ,
 port,
 PROJECT_ID,
DIST_DIR,
 ONE_HOUR,
 TOTAL_LOCKED,
 TOTAL_FET_SUPPLY,
 CANONICAL_FET_MULTIPLIER ,
 FETCH_AGENTS,
TOTAL_SUPPLY_METTALEX ,
 LCD_URL,
RPC_URL ,
 NETWORK_NAME_OF_LCD_URL,
 METTALEX_FOUNDATION_ADDRESS,
METTALEX_STAKING_ADDRESS,
METTALEX_CONTRACT_ABI_STRINGIFIED,
  METTALEX_CONTRACT_ADDRESS
}  = require('./constants')
const { Decimal } = require('decimal.js')
const { queryERC20BalanceFET } = require('./utils')
const staking = require('./staking')
const Web3 = require('web3')
const {setup, getCurrentBlockData} = require('./scraper');
const { removeDecimalComponent, divideByDecimals  }  = require('./utils')
const  DAO  = require('./DAO')
const  FetxDAO  = require('./FetxDao')

const express = require('express')
const axios = require('axios')
const BN = require('bn.js')
const Prometheus = require('prom-client')

const parseString = require('xml2js').parseString

const app = express()

let unreleasedAmount = ''
let twentyFourHoursAgoEthereumBlockNumber
let fetTransferedInLastTwentyFourHours = ''
let largeTransferCountInLastTwentyFourHours = ''
let currentCirculatingSupply = ''
let circulatingSupplyMettalex = ''

let totalAgentsEver = ''
let totalAgentsOnlineRightNow = ''
let peakAgentsOnlineNow = ''
let totalSearchQueriesForAgentsToFindOtherAgents = ''
let totalAgentsFound = ''

let activeValidators = ''
let inactiveValidators = ''
let averageBlockTime = ''

let stakingState = null
let stakingStateUI = null

setup()

String.prototype.insertCommas = function () {
  return this.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
}

function getEthereumBlockNumberFrom24HoursAgo () {
  const twentyFourHoursAgoUnixTimestamp =
    Math.floor(Date.now() / 1000) - 24 * 3600
  axios
    .get(
      `https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${twentyFourHoursAgoUnixTimestamp}&closest=before&apikey=${ETHERSCAN_API_KEY}`
    )
    .then(resp => {
      if (resp.status !== 200 || typeof resp.data === 'undefined') return
      twentyFourHoursAgoEthereumBlockNumber = parseInt(resp.data.result)
    })
    .catch(err => {
      console.log('Ethereum block number request rejected with status : ', err)
    })
}

getEthereumBlockNumberFrom24HoursAgo()
setInterval(getEthereumBlockNumberFrom24HoursAgo, 15000)

async function getSummedFETTransactions(){
  const dao = await DAO.getInstance()
 const fetxDAO = new FetxDAO(dao)
  fetTransferedInLastTwentyFourHours = await fetxDAO.getSummedFETTransactions()
}

setInterval(getSummedFETTransactions, 5000)

async function countLargeTransactions(){
      const dao = await DAO.getInstance()
     const fetxDAO = new FetxDAO(dao)
      largeTransferCountInLastTwentyFourHours = await fetxDAO.countLargeTransactions(twentyFourHoursAgoEthereumBlockNumber)
}

setInterval(countLargeTransactions, 5000)

async function FETRemainingInContract () {
    const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + PROJECT_ID))
    const contract = new web3.eth.Contract(JSON.parse(CONTRACT_ABI_STRINGIFIED), CONTRACT_ADDRESS)
    unreleasedAmount = await queryERC20BalanceFET(contract, CONTRACT_OWNER_ADDRESS)
    contract.address
}

 FETRemainingInContract()
 setInterval(FETRemainingInContract, ONE_HOUR)

function getActiveValidators() {
    axios
    .get(`${LCD_URL}/staking/validators`)
    .then(resp => {
      activeValidators = resp.data.result.filter((validator) => {
        return validator.status === 2
      }).length
      inactiveValidators = resp.data.result.filter((validator) => {
        return validator.status !== 2
      }).length
    })
}

getActiveValidators()
setInterval(getActiveValidators, ONE_HOUR)


function calculateAverageBlockTime() {
  let currentBlockTime;
  let pastBlockTime;
  const blocksOverWhichToAverage = 100

   getCurrentBlockData(getPastBlockData, (time) => currentBlockTime = time)

  function getPastBlockData(height) {

      const pastHeight = height - blocksOverWhichToAverage

      if(pastHeight <= 0) {
        console.log("this program cannot calc average block time until at least a 100 block 100")
      }

      axios
      .get(`${RPC_URL}/block?height=${pastHeight}`)
      .then(resp => {
            console.log("currentBlockTimeTime", resp.data.result.block.header.time)
            pastBlockTime = resp.data.result.block.header.time
            calcAverage()
      })
  }

  function calcAverage(){
     const past = new Date(pastBlockTime).getTime()
     const current = new Date(currentBlockTime).getTime()
     const diff = current - past;
     const diffSeconds = diff/1000

    averageBlockTime = diffSeconds/blocksOverWhichToAverage
  }
}

calculateAverageBlockTime()
setInterval(calculateAverageBlockTime, ONE_HOUR)

async function MettalexCirculatingSupply () {

    try {
        const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + PROJECT_ID))
        const contract = new web3.eth.Contract(JSON.parse(METTALEX_CONTRACT_ABI_STRINGIFIED), METTALEX_CONTRACT_ADDRESS)
        const mettalexStakingBalancePromise = queryERC20BalanceFET(contract, METTALEX_STAKING_ADDRESS)
        const mettalexFoundationBalancePromise = queryERC20BalanceFET(contract, METTALEX_FOUNDATION_ADDRESS)
        circulatingSupplyMettalex = TOTAL_SUPPLY_METTALEX.sub(await mettalexStakingBalancePromise).sub(await mettalexFoundationBalancePromise)
    }
    catch(ex) {
        console.log('Mettalex contract balanceof api request rejected with status : ', ex)
    }
}

 MettalexCirculatingSupply()
 setInterval(MettalexCirculatingSupply, ONE_HOUR)

function calcCurrentCirculatingSupply () {
  if (!stakingState || unreleasedAmount === '') return
  // Total - locked - staked - remaining == current circulating supply.
  // Un-released tokens are understood to be the "remaining" part of this calculation
  currentCirculatingSupply = TOTAL_FET_SUPPLY.sub(stakingState.allFundsInTheContract).sub(new Decimal(unreleasedAmount)).abs().trunc().toString()
}

calcCurrentCirculatingSupply()
setInterval(calcCurrentCirculatingSupply, 5000)

function AgentInformation () {
  axios
    .get(FETCH_AGENTS)
    .then(resp => {
      if (resp.status !== 200) return
      // parse the xml
      parseString(resp.data, function (err, result) {
        const response = result.response

        console.log("response 777777", response)

        totalAgentsEver = response.statistics[0].total_agents_ever[0]
        totalAgentsOnlineRightNow = new BN(response.statistics[0].total_agents_ever[0]).sub(new BN(response.statistics[0].expired_agents[0])).toString()
        peakAgentsOnlineNow = response.statistics[0].peaks[0].peak[0]._
        totalSearchQueriesForAgentsToFindOtherAgents = response.statistics[0].total_search_queries[0]
        totalAgentsFound = response.statistics[0].total_agents_found[0]
      })

    })
}

AgentInformation()
setInterval(AgentInformation, 15000)



async function updateStakingInfo() {
    stakingState = staking.toDecimalFETState(await staking.updatePrometheusMetrics())
    const lockedPeriodBlocks = stakingState.lockPeriod.toString()
    const totalUnstaked = stakingState.liquidFunds.principal.trunc().toString() //staking.getAssetCompositeDecimalFET(stakingState.liquidFunds).toString(),
    const totalLocked = stakingState.lockedFunds.principal.trunc().toString() //staking.getAssetCompositeDecimalFET(stakingState.lockedFunds).toString(),
    const totalStaked = stakingState.stakedFunds.trunc().toString()

    stakingStateUI = {
        lockedPeriodBlocks,
        totalUnstaked,
        totalLocked,
        totalStaked,
    }

    console.log("staking response:", stakingStateUI)
}

let stakingPollIntervalHandle = setInterval(updateStakingInfo, 30000);

app.use(express.static(DIST_DIR))

app.get('/token_information_api', (req, res) => {
  res.send({
    totalStaked: stakingStateUI ? stakingStateUI.totalStaked : "0",
    //totalLocked: stakingStateUI ? stakingStateUI.totalLocked : "0",
    unreleasedAmount: unreleasedAmount,
    recentlyTransfered: fetTransferedInLastTwentyFourHours,
    recentLargeTransfers: largeTransferCountInLastTwentyFourHours,
    currentCirculatingSupply: currentCirculatingSupply,
    totalAgentsEver: totalAgentsEver,
    totalAgentsOnlineRightNow: totalAgentsOnlineRightNow,
    peakAgentsOnlineNow: peakAgentsOnlineNow,
    totalSearchQueriesForAgentsToFindOtherAgents: totalSearchQueriesForAgentsToFindOtherAgents,
    totalAgentsFound: totalAgentsFound,
  })
})


app.get('/staking', async (req, res) => {
    if (! stakingStateUI) {
        await updateStakingInfo()
    }

    res.send(stakingStateUI)
})

app.get(`/status/${NETWORK_NAME_OF_LCD_URL}`, (req, res) => {
  res.send({
     activeValidators: activeValidators,
    inactiveValidators: inactiveValidators,
    averageBlockTime: averageBlockTime
  })
})




app.get('/mettalex_circulating_supply', (req, res) => {
  res.send(circulatingSupplyMettalex)
})

app.get('/metrics', (req, res) => {
  res.set('Content-Type', Prometheus.register.contentType)
  res.end(Prometheus.register.metrics())
})

app.listen(port, function () {
  console.log('App listening on port: ' + port)
})
