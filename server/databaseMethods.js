const {
   ETHERSCAN_API_KEY,
 CONTRACT_ABI_STRINGIFIED,
  STAKING_CONTRACT_ABI_STRINGIFIED, CONTRACT_ADDRESS,
 STAKING_CONTRACT_ADDRESS,
 CONTRACT_OWNER_ADDRESS ,
 port,
 PROJECT_ID,
DIST_DIR,
  DB_NAME,
  MYSQL_HOST,
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
  DB_PASSWORD,
  DB_USERNAME,
METTALEX_CONTRACT_ABI_STRINGIFIED,
  METTALEX_CONTRACT_ADDRESS
}  = require('./constants')
// const { Pool } = require('pg')

var mysql      = require('mysql');


 class DatabaseMethods {

  pool;

  constructor(){
  }


  async connect() {
    try {
      this.pool =  mysql.createConnection({
        host: MYSQL_HOST,
        user: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
      })
    } catch(error) {
      console.log("Could not connect to database. Error : ", error.message)
    }
}

async createTableIfNotExists(){
   const sql = `CREATE TABLE IF NOT EXISTS fettxs
                             (ID SERIAL PRIMARY KEY,
                             fromaddr  VARCHAR(255)    NOT NULL,
                             toaddr VARCHAR(255) NOT NULL,
                             blocknumber BIGINT NOT NULL,
                             fetValue BIGINT NOT NULL);`
    await this.pool.query(sql)
}

async createDatabaseIfNotExists(){
   const sql = `CREATE DATABASE [IF NOT EXISTS] ${DB_NAME}`;
    await this.pool.query(sql)
}

async getBiggestSavedBlockNumber(){
   const response = await this.pool.query(`SELECT MAX(blocknumber) AS maxBlocknumber FROM fettxs;`)

      if (
        typeof response === "undefined" || response.rows[0].maxblocknumber === null
      ) {
        return 0
      }

  return parseInt(JSON.parse(response.rows));
}


async getSummedFETTransactions (twentyFourHoursAgoEthereumBlockNumber) {
  this.pool.query(
    `SELECT SUM(fetvalue) as TOTAL from fettxs where blocknumber > ${twentyFourHoursAgoEthereumBlockNumber}`,
    (err, res) => {
      return (err || res.rows[0].total !== null) ? '0' : res.rows[0].total
    }
  )
}


async countLargeTransactions (twentyFourHoursAgoEthereumBlockNumber) {
  console.log("twentyFourHoursAgoEthereumBlockNumber" + twentyFourHoursAgoEthereumBlockNumber)

  if (typeof twentyFourHoursAgoEthereumBlockNumber === 'undefined') {
    return
  }

  this.pool.query(
    `SELECT COUNT(fetvalue) from fettxs where blocknumber > ${twentyFourHoursAgoEthereumBlockNumber} AND fetvalue > 25`,
    (err, res) => {
      if (
        typeof res === 'undefined' ||
        typeof res.rows[0] === 'undefined' ||
        typeof res.rows[0].count === 'undefined'
      ) {
        return null
      }
         return res.rows[0].count
    }
  )
}



async insertTransfers(transferEvents){

  if(!transferEvents.length) return

  let sql = `INSERT INTO fettxs (
    fromaddr,
    toaddr,
    blocknumber
    fetValue
)
VALUES
`;

    transferEvents.forEach(el => {
       sql +=  "(" + el.toString() + "),"
  })

  sql = sql.slice(0, -1)

   await pool.query(sql)
}

}

module.exports.DatabaseMethods = DatabaseMethods;