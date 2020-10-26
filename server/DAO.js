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

const mysql      = require('mysql');


 class DAO {
   Dao;

   /**
    * private usage
    *
    * @returns {Connection}
    */
  async connect(){
    try {
      this.connection =  mysql.createConnection({
        host: MYSQL_HOST,
        user: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
      })

       await this.createDatabaseIfNotExists()

    } catch(error) {
      console.log("Could not connect to database. Error : ", error.message)
    }

    return DAO.connection;
 }

  /**
	 * Singleton ensuring only one database connection in application
	 *
	 * The static method that controls the access to the LedgerNano instance.
	 *
	 * @returns {Promise<DAO>} instance of self
	 */

	static async getInstance() {
		if (!DAO.instance) {
			DAO.instance = new DAO()
			await this.instance.connect()
      await this.instance.createDatabaseIfNotExists
		}

		return DAO.instance
	}


 async createDatabaseIfNotExists(){
   const sql = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;
    await this.connection.query(sql)
}

}

module.exports = DAO;