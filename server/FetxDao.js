class FetxDAO {
   DAO

   constructor (DAO) {
     this.DAO = DAO;
   }

   async createTableIfNotExists () {
     let res;
     const sql = `CREATE TABLE IF NOT EXISTS fettxs
                             (ID int NOT NULL AUTO_INCREMENT,
                             fromaddr  VARCHAR(255) NOT NULL,
                             toaddr VARCHAR(255) NOT NULL,
                             blocknumber BIGINT NOT NULL,
                             fetValue  VARCHAR(255) NOT NULL,
                             PRIMARY KEY (ID));`
     try {
        await this.DAO.connection.query(sql)
     } catch(error){
       console.log("error creating table ", error.message)
     }
     }


   async getBiggestSavedBlockNumber () {
     return new Promise(async  (resolve, reject) => {

       try {
         this.DAO.connection.query(`SELECT MAX(blocknumber) AS maxBlocknumber FROM fettxs`,
           (err, results) => {
             debugger;

             if (err) {
               console.error(err.stack);
               return reject(err);
             }

             if (results.length > 0) {
               resolve(results[0].maxBlocknumber)
             } else {
               reject(new Error('no results'))
             }
           })
       } catch (e) {
         reject (e)
       }
     })
   }

   async getSummedFETTransactions (twentyFourHoursAgoEthereumBlockNumber) {
     this.DAO.connection.query(
       `SELECT SUM(fetvalue) as TOTAL from fettxs where blocknumber > ${twentyFourHoursAgoEthereumBlockNumber}`,
       (err, res) => {
         return (err || res.rows[0].total !== null) ? '0' : res.rows[0].total
       }
     )
   }

   async countLargeTransactions (twentyFourHoursAgoEthereumBlockNumber) {
     if (typeof twentyFourHoursAgoEthereumBlockNumber === 'undefined') {
       return
     }

     try {
       this.DAO.connection.query(
         `SELECT COUNT(fetvalue) from fettxs where blocknumber > ${twentyFourHoursAgoEthereumBlockNumber} AND fetvalue > 25`,
         (err, res) => {
           if (
             typeof res === 'undefined' ||
             typeof res.rows === 'undefined' ||
             typeof res.rows[0].count === 'undefined'
           ) {
             return null
           }
           return res.rows[0].count
         }
       )
     } catch (e) {
       console.log("countLargeTransactions query failed with error", e.message)
     }
   }

   async insertTransfers (transferEvents) {

     if (!transferEvents.length) return

     let sql = `INSERT INTO fettxs ( fromaddr, toaddr, blocknumber, fetValue ) VALUES `;

     transferEvents.forEach((el, i) => {
       sql += `('${el[0]}', '${el[1]}', '${el[2]}', '${el[3]}' ),`
     })

     sql = sql.slice(0, -1)

     try {
       await this.DAO.connection.query(sql)
     } catch (e) {
       console.log("Error in inserting row into database with error message ", e.message)
     }

   }
 }
module.exports = FetxDAO