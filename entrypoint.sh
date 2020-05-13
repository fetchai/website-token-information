#!/bin/bash

echo "process.env.PGUSER = \"${GPUSER}\";" >> server/index.js
echo "process.env.PGHOST = \"${PGHOST}\";" >> server/index.js
echo "process.env.PGPASSWORD = \"${PGPASSWOR}\";" >> server/index.js
echo "process.env.PGDATABASE = \"${PGDATABASE}\";" >> server/index.js
echo "process.env.PGPORT = \"5432\";" >> server/index.js

npm run start
