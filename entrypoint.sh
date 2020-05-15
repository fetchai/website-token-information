#!/bin/bash

# sed -i "s/PGUSER = PGUSER/PGUSER = \"${PGUSER}\"/" server/index.js
# sed -i "s/PGHOST = PGHOST/PGHOST = \"${PGHOST}\"/" server/index.js
# sed -i "s/PGPASSWORD = PGPASSWORD/PGPASSWORD = \"${PGPASSWORD}\"/" server/index.js
# sed -i "s/PGDATABASE = PGDATABASE/PGDATABASE = \"${PGDATABASE}\"/" server/index.js
# sed -i "s/ETHERSCAN_API_KEY = ETHERSCAN_API_KEY/ETHERSCAN_API_KEY = \"${ETHERSCAN_API_KEY}\"/" server/index.js

sed -i "s/\/\/ process.env.PGUSER = PGUSER/process.env.PGUSER = \"${PGUSER}\"/" server/index.js
sed -i "s/\/\/ process.env.PGHOST = PGHOST/process.env.PGHOST = \"${PGHOST}\"/" server/index.js
sed -i "s/\/\/ process.env.PGPASSWORD = PGPASSWORD/process.env.PGPASSWORD = \"${PGPASSWORD}\"/" server/index.js
sed -i "s/\/\/ process.env.PGDATABASE = PGDATABASE/process.env.PGDATABASE = \"${PGDATABASE}\"/" server/index.js
sed -i "s/\/\/ process.env.PGPORT = \"5432\"/process.env.PGPORT = \"5432\"/" server/index.js
sed -i "s/const ETHERSCAN_API_KEY = ETHERSCAN_API_KEY/const ETHERSCAN_API_KEY = \"${ETHERSCAN_API_KEY}\"/" server/index.js


# npm run bc
# the above will not work here beacue it run int hw bacl gorund and simply comples
# we need to find a way to ru nthe main process like node  as CMD

node server/index.js
