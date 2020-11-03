#!/bin/bash

sed -i "s/\/\/ process.env.PGUSER = PGUSER/process.env.PGUSER = \"${PGUSER}\"/" server/index.js
sed -i "s/\/\/ process.env.PGHOST = PGHOST/process.env.PGHOST = \"${PGHOST}\"/" server/index.js
sed -i "s/\/\/ process.env.PGPASSWORD = PGPASSWORD/process.env.PGPASSWORD = \"${PGPASSWORD}\"/" server/index.js
sed -i "s/\/\/ process.env.PGDATABASE = PGDATABASE/process.env.PGDATABASE = \"${PGDATABASE}\"/" server/index.js
sed -i "s/\/\/ process.env.runScraper = runScraper/process.env.runScraper = \"false\"" server/index.js
sed -i "s/\/\/ process.env.PGPORT = \"5432\"/process.env.PGPORT = \"5432\"/" server/index.js
sed -i "s/const ETHERSCAN_API_KEY = ETHERSCAN_API_KEY/const ETHERSCAN_API_KEY = \"${ETHERSCAN_API_KEY}\"/" server/index.js

npm run prod
