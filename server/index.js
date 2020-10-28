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
 NUMERATOR ,
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


const Web3 = require('web3')
const {setup, getCurrentBlockData} = require('./scraper');
const { removeDecimalComponent, divideByDecimals  }  = require('./utils')
const  DAO  = require('./DAO')
const  FetxDAO  = require('./FetxDao')

const express = require('express')
const axios = require('axios')
const BN = require('bn.js')


const parseString = require('xml2js').parseString
const app = express()

let unreleasedAmount = ''
let twentyFourHoursAgoEthereumBlockNumber
let fetTransferedInLastTwentyFourHours = ''
let largeTransferCountInLastTwentyFourHours = ''
let currentCirculatingSupply = ''

let totalAgentsEver = ''
let totalAgentsOnlineRightNow = ''
let peakAgentsOnlineNow = ''
let totalSearchQueriesForAgentsToFindOtherAgents = ''
let totalAgentsFound = ''

let activeValidators = ''
let inactiveValidators = ''
let averageBlockTime = ''

let lockedPeriodBlocks = ""
let totalUnstaked = ""
let totalLocked = ""
let totalStaked = ""
let circulatingSupplyMettalex = ''

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

function FETRemainingInContract () {
  const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + PROJECT_ID))
  const contract = new web3.eth.Contract(JSON.parse(CONTRACT_ABI_STRINGIFIED), CONTRACT_ADDRESS)


  console.log("CONTRACT_OWNER_ADDRESS ", CONTRACT_OWNER_ADDRESS)

  contract.methods.balanceOf(CONTRACT_OWNER_ADDRESS).call((error, balance) => {


      if (error || balance === null)
      {
      console.log("error in FETRemainingInContract", error)
      console.log("balance is ")
    return
      }

    contract.methods.decimals().call((error, decimals) => {
      if (error || balance === null) return

      const denominator = new BN(balance.toString())
      if(denominator.isZero()){
        unreleasedAmount = "0"
      } else {
              unreleasedAmount = new BN(balance.toString()).div(NUMERATOR).toString()
      }

      console.log("unreleasedAmount", unreleasedAmount)
    })
  })
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


function getTotals() {

     function getAccruedGlobalPrincipal(contract) {
    return  contract.methods._accruedGlobalPrincipal().call()
  }

   function getAccruedGlobalLiquidity(contract) {
    return  contract.methods._accruedGlobalLiquidity().call()
  }

   function getLocked(contract) {
    return contract.methods._accruedGlobalLocked().call()
  }
   function getLockPeriod(contract) {
    return contract.methods._lockPeriodInBlocks().call()
  }

  const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/52a657432c274299a973790b857c5d2c'))
  const contract = new web3.eth.Contract(JSON.parse(STAKING_CONTRACT_ABI_STRINGIFIED), STAKING_CONTRACT_ADDRESS)

  const promise1 = getAccruedGlobalPrincipal(contract)
  const promise2 = getAccruedGlobalLiquidity(contract)
  const promise3 = getLocked(contract)
  const promise4 = getLockPeriod(contract)

  Promise.all([promise1, promise2, promise3, promise4]).then((arrayOfPromises) => {
    totalLocked = arrayOfPromises[1].principal;
    totalStaked = new BN(arrayOfPromises[0]).sub(new BN(arrayOfPromises[1].principal)).sub(new BN(arrayOfPromises[2].principal)).toString()
    totalUnstaked = arrayOfPromises[2].principal
    lockedPeriodBlocks =  arrayOfPromises[3]
  }).catch(err => {
      console.log('FAILURE contract balanceof api request rejected with status : ', err)
    })
}

getTotals()
 setInterval(getTotals, ONE_HOUR)

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

function MettalexCirculatingSupply () {

  const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + PROJECT_ID))
  const contract = new web3.eth.Contract(JSON.parse(METTALEX_CONTRACT_ABI_STRINGIFIED), METTALEX_CONTRACT_ADDRESS)

  const promise1 = balance(contract, METTALEX_STAKING_ADDRESS)
  const promise2 = balance(contract, METTALEX_FOUNDATION_ADDRESS)

  Promise.all([promise1, promise2]).then((arrayOfPromises) => {
   const toDeduct =  arrayOfPromises[0].add(arrayOfPromises[1])
     circulatingSupplyMettalex = TOTAL_SUPPLY_METTALEX.sub(toDeduct).toString()
  }).catch(err => {
      console.log('Mettalex contract balanceof api request rejected with status : ', err)
  })

  function balance(contract, address){
    return new Promise(function(resolve, reject) {
      let res
      contract.methods.balanceOf(address).call((error, balance) => {
        contract.methods.decimals().call((error, decimals) => {
          if (error) return reject()
          console.log("ettalex contract balanceof api request re")
          let denominator = new BN(balance.toString())

                if(denominator.isZero()){
        res = new BN("0")
                            console.log("denominator1111111")
      } else {
                            console.log("denominator2222222", denominator.toString())
                  debugger;
        res = denominator.div(NUMERATOR)
                                    debugger;
                                              console.log("denominator999999", denominator.toString())

      }
          console.log("denominator33333")
          resolve(res)
        })
      })
    })
  }
}

 MettalexCirculatingSupply()
 setInterval(MettalexCirculatingSupply, ONE_HOUR)

function calcCurrentCirculatingSupply () {
  if (totalStaked === '' || unreleasedAmount === '') return
  // Total - locked - staked - remaining == current circulating supply.
  // Un-released tokens are understood to be the "remaining" part of this calculation

  const totalStakedNonCanonical = removeDecimalComponent(divideByDecimals(totalStaked, 18))

  currentCirculatingSupply = TOTAL_FET_SUPPLY.sub(new BN(totalStakedNonCanonical)).sub(new BN(TOTAL_LOCKED)).sub(new BN(unreleasedAmount)).abs().toString()
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

app.use(express.static(DIST_DIR))

app.get('/token_information_api', (req, res) => {
  res.send({
    totalStaked: removeDecimalComponent(divideByDecimals(totalStaked, 18)),
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


app.get('/staking', (req, res) => {
  res.send({
    lockedPeriodBlocks: lockedPeriodBlocks,
    totalUnstaked: totalUnstaked,
    totalLocked: totalLocked,
    totalStaked: totalStaked,
  })
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


app.listen(port, function () {
  console.log('App listening on port: ' + port)
})
