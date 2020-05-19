## Intructions

## Prerequisites

- Node (version >=10)
- NPM 
- Python3

## Postgres setup

- Install Postgres

- Create database name, user name and a password for your created user (optionally you can see the below tutorial. The credentials creation part is the same
on any operating system)

- https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-18-04

## Running Ethereum Gas monitor (required)

- Ethereum Gas monitor ( a separate Fetch.ai project https://github.com/fetchai/ethereum_gas_monitor ) is used to get information on number of tokens transferred in the last 24 hours, and number 
  of large Transactions
  
  - git clone this branch https://github.com/fetchai/ethereum_gas_monitor/tree/TOKENINFORMATIONPAGE
  
  - Note: This branch is modified to not write results to slack, and to use different datatypes for data in Postgres. 
  
  - In file common/contractmon_funcs.py change (see below) lines 66 through 69 to your own (earlier created) Postgres credentials: 
  
  ```db_name = "douglas"``` 
   ``` db_password = "myPassword"```
   ``` db_username = "douglas"```
  
  - If not running on localhost change instances of string ```host="localhost"``` in common/visualize.py and common/funcs.py 
  
  - From root dir run  ```pipenv install```  ```pipenv shell``` ```python3 contractmon.py``` 
  
  - Note: This program writes current transactions to Postgres, so needs to be running for 24 hours before data in the Token Information Page will be correct. 
  
##  Running this Node.js application 
  
- Note: The above Ethereum Gas Monitor script must have been run at least once to create database tables, and must be running continuously for correct data. 
  
- Git clone this repository
- CD to root directory 

```
npm install
``` 

- Running for development (with your own Postgres credentials created earlier inserted)

```webpack --mode development && PGUSER=test   PGHOST=localhost   PGPASSWORD=myPassword   PGDATABASE=douglas   PGPORT=5432 node server/index.js```

- Or Alternatively (advised for ease of use) you can change the below line in the package.json to add your credentials in and then run ``npm run dev``

```"dev": "webpack --mode development && PGUSER=test \\\n  PGHOST=localhost \\\n  PGPASSWORD=myPassword \\\n  PGDATABASE=douglas \\\n  PGPORT=5432 \\node server/index.js",```

- Note: After starting the server it takes around ten seconds of running before results will be correct, but they should then remain correct permanently. 

- Note: for production change line 11 ```const ETHERSCAN_API_KEY = "2WQZAX9F42ZFGXPBCKHXTTGYGU2A6CD6VG";``` in server/index.js to company Etherscan API key. 

- Note: for production run with ``npm run start`` (add your Postgres credentials to the start command in Package.json) which runs as daemon 
  (called forever) which restarts server if it crashes. 
  
  - To stop forever run 

    `` forever list``

   - Then get number from results (usually 0) and then run: 

    ``forever stop <your number here>``

 
### Deployment 

git clone https://github.com/fetchai/website-token-information
cd website-token-information
skaffold delete -p sandbox && skaffold run -p sandbox




