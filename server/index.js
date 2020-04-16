const express = require('express');
const path = require('path'); // NEW
const axios = require('axios');
const BN = require("bn.js")
const app = express();
const port = process.env.PORT || 8000;
const DIST_DIR = path.join(__dirname, '../dist'); // NEW
const ONE_HOUR = 1000*60*60
const STAKING_API = "http://staking.fetch.ai/api/auction_status?lastBlock=0"
const TOKEN_CONTRACT = "0x1d287cc25dad7ccaf76a26bc660c5f7c8e2a05bd";
const ETHERSCAN_API_KEY = "2WQZAX9F42ZFGXPBCKHXTTGYGU2A6CD6VG";
const INFURA_SECRET = "d92428310dfd4ee4a9f82d6fc35a6ed0";
const PROJECT_ID = "cab205e574974e6d903844cb7da7537d";
const TEN_TO_EIGHTEEN = "1" + "0".repeat(18)
const NUMERATOR = new BN(TEN_TO_EIGHTEEN)

const { Pool, Client } = require('pg')
// pools will use environment variables
// for connection information
const pool = new Pool()
// string representing amount staked.
let staked = "";
let unreleasedAmount = "";
let currentEthereumBlockNumber;
let twentyFourHoursAgoEthereumBlockNumber;

String.prototype.insertCommas = function () {
    return this.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

// const options = {
//   hostname: "localhost",
//   database: "douglas",
//     user: "douglas",
//     pass: 'myPassword'
// }




function calculateTotalStaked(phase, finalisationPrice, slotsSold){
  // if phase 0 there is nothing staked.
  if(phase === 0)  return "";
 const erc20StakedAmount =  new BN(finalisationPrice).mul(new BN(slotsSold))
 const amount = erc20StakedAmount.div(NUMERATOR)
 return amount.toString().insertCommas();
}

function getCurrentEthereumBlockNumber(){
  const currentUnixTimestamp = Math.floor(Date.now() / 1000)
   axios.get(`https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${currentUnixTimestamp}&closest=before&apikey=${ETHERSCAN_API_KEY}`).then(resp => {

 if(resp.status !== 200 || typeof resp.data === "undefined") return;
        currentEthereumBlockNumber = resp.data.result;
   })
}



getCurrentEthereumBlockNumber()
function getEthereumBlockNumberFrom24HoursAgo(){
  const twentyFourHoursAgoUnixTimestamp = (Math.floor(Date.now() / 1000)) - (24 * 3600);
   axios.get(`https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${twentyFourHoursAgoUnixTimestamp}&closest=before&apikey=${ETHERSCAN_API_KEY}`).then(resp => {

 if(resp.status !== 200 || typeof resp.data === "undefined") return;
       twentyFourHoursAgoEthereumBlockNumber = resp.data.result;
   })
}
getEthereumBlockNumberFrom24HoursAgo()



function getTransactions(){
pool.query('SELECT NOW()', (err, res) => {
  debugger;
  console.log(err, res)
  pool.end()
})
}




setTimeout(getTransactions, 5000)



function FETRemainingInContract(){
  axios.post('https://node3.web3api.com/',
    {
      "jsonrpc":"2.0",
      "id":2,
      "method":"eth_call",
      "params":[{"from":"0x0000000000000000000000000000000000000000",
        "data":"0x70a082310000000000000000000000001d287cc25dad7ccaf76a26bc660c5f7c8e2a05bd",
        "to":"0x1d287cc25dad7ccaf76a26bc660c5f7c8e2a05bd"},
        "latest"]}).then(resp => {
       if(resp.status !== 200) return;
      let amount =  new BN(resp.result, "hex").div(NUMERATOR)
    unreleasedAmount = amount.toString().insertCommas();
  })
}

function ethereumTransactions(){
axios.post(`https://mainnet.infura.io/v3/${PROJECT_ID}`,
    {
            "jsonrpc": "2.0",
            "method": "eth_getLogs",
            "params": [{"address":TOKEN_CONTRACT, "fromBlock": 10, "toBlock": 20, "topics": []}],
            "id": 2
        }).then(resp => {
       if(resp.status !== 200) return;

})}
ethereumTransactions()

/**
 * gets staking data and saves it to text file as json string.
 */
function totalStaked() {
   axios.get(STAKING_API).then(resp => {
  if(resp.status !== 200) return;
   staked = calculateTotalStaked(resp.data.payload.phase, resp.data.payload.finalisationPrice, resp.data.payload.slotsSold)
});
}


let ts = Math.round(new Date().getTime() / 1000);
let tsYesterday = ts - (24 * 3600);



// calc the total amount staked
totalStaked();
// re-calc every hour.
setInterval(totalStaked, ONE_HOUR);

FETRemainingInContract()
// re-calc every hour.
setInterval(FETRemainingInContract, ONE_HOUR);

app.use(express.static(DIST_DIR));

app.get('/token_information_api', (req, res) => {
  res.send({totalStaked: staked, unreleasedAmount: unreleasedAmount});
});

app.listen(port, function () {
 console.log('App listening on port: ' + port);
});