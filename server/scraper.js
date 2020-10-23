const axios = require('axios')
const { LCD_URL, DB_NAME }  = require('./constants')
const { splitFetAmount }  = require('./utils')
const  DatabaseMethods  = require('./databaseMethods').DatabaseMethods;

/**
 * @filedesc This goes through the transactions in history and adds them to database.
 * */


/**
 *  we check if database exists, if not we create it.
 *
 *  we check how far we have looked to
 *
 * @returns {Promise<void>}
 */
async function setup() {

  debugger;
   const databaseMethods =  new DatabaseMethods()
 await databaseMethods.connect()

  await databaseMethods.createDatabaseIfNotExists()
 await databaseMethods.createTableIfNotExists()
  await getTransactionsToCurrentBlock()
  setInterval(getTransactionsToCurrentBlock, 50000)
}

async function getTransactionsToCurrentBlock() {
  const maxprocessedBlocknumber = await getBiggestSavedBlockNumber()
  const { height } = await getCurrentBlockData()

  console.log("maxprocessedBlocknumber", maxprocessedBlocknumber)
  console.log("height ", height)

  const transferEvents = await scrape(maxprocessedBlocknumber, height)
  console.log("before insertRows")
  await insertTransfers(transferEvents)
}



async function getCurrentBlockData() {
    // lets get current block first
   const response = await axios
      .get(`${RPC_URL}/block`)
              .catch(error => {console.log("getCurrentBlockData error")})
          return { height: response.data.result.block.header.height, currentBlockTime: response.data.result.block.header.time }
  }

async function scrape(fromBlockNumber, toBlockNumber) {

const query = `${LCD_URL}/txs?tx.minheight=${fromBlockNumber}&tx.maxheight=${toBlockNumber}`

  let error = false;
  let response;

try {
    response = await axios
    .get(query)
} catch {
          // console.log("scrape error caught99999!!!!!", error.message)
        error = true;
}

  let pageTotal = response.data.page_total
  let pageNumber = response.data.page_number
  let transferEvents = []
  // if it is paginated then get them all
  while(pageNumber < pageTotal){
            // console.log("scraperLoopCount", pageNumber++)
    pageNumber++;
    query + `&page=${pageNumber}`;
    const response = await  axios
    .get(query)
     transferEvents = [transferEvents, ...getTransferEvents(response)]
  }
  return transferEvents;
}


function getTransferEvents(response){
  const transferEvents = []
 let height;
 let logs;
  // find all the transfer events
 response.data.txs.forEach(el => {
   height = el.height

   if (typeof el["raw_log"] === "undefined"){
       // console.log("transferEvents UNDEFINED")
       return
   }

   logs = JSON.parse(el["raw_log"])

   logs.forEach(el => el.events.forEach(el => {
     if(el.type === "transfer"){
       transferEvents.push([el.attributes.filter(el => el.key === "recipient").map(el => el.value),
        el.attributes.filter(el => el.key === "sender").map(el => el.value),
     height,
    el.attributes.filter(el => el.key === "amount").map(el => splitFetAmount(el.value))
       ])}
     }))
   })

  return transferEvents
}






exports.setup = setup