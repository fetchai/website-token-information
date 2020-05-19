const express = require("express");
const path = require("path"); // NEW
const axios = require("axios");
const BN = require("bn.js");
const app = express();
const port = process.env.PORT || 8000;

const DIST_DIR = path.join(__dirname, "../dist");
const ONE_HOUR = 1000 * 60 * 60;
const STAKING_API = "http://staking.fetch.ai/api/auction_status?lastBlock=0";
const ETHERSCAN_API_KEY = ETHERSCAN_API_KEY;
// const ETHERSCAN_API_KEY = "2WQZAX9F42ZFGXPBCKHXTTGYGU2A6CD6VG";
const TOTAL_LOCKED = "109534769";
const TOTAL_FET_SUPPLY = new BN("1152997575")
const TEN_TO_EIGHTEEN = "1" + "0".repeat(18);
const NUMERATOR = new BN(TEN_TO_EIGHTEEN);

// process.env.PGUSER = PGUSER;
// process.env.PGHOST = PGHOST;
// process.env.PGPASSWORD = PGPASSWORD;
// process.env.PGDATABASE = PGDATABASE;
// process.env.PGPORT = "5432";

const { Pool } = require("pg");
const pool = new Pool();
let staked = "";
let unreleasedAmount = "";
let twentyFourHoursAgoEthereumBlockNumber;
let fetTransferedInLastTwentyFourHours = "";
let largeTransferCountInLastTwentyFourHours = "";
let currentCirculatingSupply = "";

String.prototype.insertCommas = function() {
  return this.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

function calculateTotalStaked(phase, finalisationPrice, slotsSold) {
  // if phase 0 there is nothing staked.
  if (phase === 0) return "0";
  const erc20StakedAmount = new BN(finalisationPrice).mul(new BN(slotsSold));
  const amount = erc20StakedAmount.div(NUMERATOR);
  return amount.toString();
}

function getEthereumBlockNumberFrom24HoursAgo() {
  const twentyFourHoursAgoUnixTimestamp =
    Math.floor(Date.now() / 1000) - 24 * 3600;
  axios
    .get(
      `https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${twentyFourHoursAgoUnixTimestamp}&closest=before&apikey=${ETHERSCAN_API_KEY}`
    )
    .then(resp => {
      if (resp.status !== 200 || typeof resp.data === "undefined") return;
      twentyFourHoursAgoEthereumBlockNumber = parseInt(resp.data.result);
    })
    .catch(err => {
      console.log("Ethereum block number request rejected with status : ", err)
    });
}

getEthereumBlockNumberFrom24HoursAgo();
setInterval(getEthereumBlockNumberFrom24HoursAgo, 15000);

function getSummedFETTransactions() {
  if (typeof twentyFourHoursAgoEthereumBlockNumber === "undefined") return;

  pool.query(
    `SELECT SUM(fetvalue) as TOTAL from fettxs where blocknumber > ${twentyFourHoursAgoEthereumBlockNumber}`,
    (err, res) => {
      if (
        typeof res === "undefined" ||
        typeof res.rows[0] === "undefined" ||
        typeof res.rows[0].total === "undefined"
      ){
        return;
      }

      if(res.rows[0].total === null) {
        fetTransferedInLastTwentyFourHours = "0";
      } else {
        fetTransferedInLastTwentyFourHours = res.rows[0].total;
      }
    }
  );
}

setInterval(getSummedFETTransactions, 5000);

function countLargeTransactions() {
  if (typeof twentyFourHoursAgoEthereumBlockNumber === "undefined") return;

  pool.query(
    `SELECT COUNT(fetvalue) from fettxs where blocknumber > ${twentyFourHoursAgoEthereumBlockNumber} AND fetvalue > 250000`,
    (err, res) => {
      if (
        typeof res === "undefined" ||
        typeof res.rows[0] === "undefined" ||
        typeof res.rows[0].count === "undefined"
      ){
           return;
      }
      largeTransferCountInLastTwentyFourHours = res.rows[0].count;
    }
  );
}
setInterval(countLargeTransactions, 5000);

function FETRemainingInContract() {
  // https://etherscan.io/readContract?m=normal&a=0x1d287cc25dad7ccaf76a26bc660c5f7c8e2a05bd&v=0x1d287cc25dad7ccaf76a26bc660c5f7c8e2a05bd#readCollapse8
  // Taken from the actual api request performed by this Etherscan page
  axios
    .post("https://node3.web3api.com/", {
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [
        {
          from: "0x0000000000000000000000000000000000000000",
          data:
            "0x70a082310000000000000000000000007cd9497b3da5de1eba948fa574c4de771124f1d9",
          to: "0x1d287cc25dad7ccaf76a26bc660c5f7c8e2a05bd"
        },
        "latest"
      ]
    })
    .then(resp => {
      if (resp.status !== 200) return;
      let amount = new BN(
        Buffer.from(resp.data.result.substring(2), "hex")
      ).div(NUMERATOR);
      unreleasedAmount = amount.toString()
    })
    .catch(err => {
      console.log("web3 api request rejected with status : ", err)
    });
}
FETRemainingInContract();
setInterval(FETRemainingInContract, ONE_HOUR);

/**
 * gets staking data and saves it to text file as json string.
 */
function totalStaked() {
  axios
    .get(STAKING_API)
    .then(resp => {
      if (resp.status !== 200) return;
      staked = calculateTotalStaked(
        resp.data.payload.phase,
        resp.data.payload.finalisationPrice,
        resp.data.payload.slotsSold
      );
    })
    .catch(err => {
      console.log("staking api request rejected with status : ", err)
    });
}

// calc the total amount staked
totalStaked();
setInterval(totalStaked, 5000);

function calcCurrentCirculatingSupply() {
    if(staked === "" || unreleasedAmount === "") return;
    // Total - locked - staked - remaining == current circulating supply.
    // Un-released tokens are understood to be the "remaining" part of this calculation
    currentCirculatingSupply = TOTAL_FET_SUPPLY.sub(new BN(staked)).sub(new BN(TOTAL_LOCKED)).sub(new BN(unreleasedAmount)).toString()
  }

calcCurrentCirculatingSupply();
setInterval(calcCurrentCirculatingSupply, 5000);

app.use(express.static(DIST_DIR));

app.get("/token_information_api", (req, res) => {
  res.send({
    totalStaked: staked,
    unreleasedAmount: unreleasedAmount,
    recentlyTransfered: fetTransferedInLastTwentyFourHours,
    recentLargeTransfers: largeTransferCountInLastTwentyFourHours,
    currentCirculatingSupply: currentCirculatingSupply,
  });
});

app.listen(port, function() {
  console.log("App listening on port: " + port);
});
