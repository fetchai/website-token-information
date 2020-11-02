const {
  DB_NAME,
  MYSQL_HOST,
  DB_PASSWORD,
  DB_USERNAME,
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

    console.log(" DB_NAME MYSQL_HOST DB_PASSWORD DB_NAME",  DB_NAME)
    console.log(" DB_NAME MYSQL_HOST DB_PASSWORD MYSQL_HOST",  MYSQL_HOST)
    console.log(" DB_NAME MYSQL_HOST DB_PASSWORD DB_PASSWORD",   DB_PASSWORD)
    console.log(" DB_NAME MYSQL_HOST DB_PASSWORD DB_USERNAME",   DB_USERNAME)

    let error = false
    try {
      this.connection =  mysql.createConnection({
        host: MYSQL_HOST,
        user: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
      })

       await this.createDatabaseIfNotExists()

          console.log(" did not throw xxx")



    } catch(error) {
      error = true
      console.log("Could not connect to database. Error : ", error.message)

        if(error) {
       throw new Error(error.message)
     }
    }
   console.log("error status is : ", error)



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