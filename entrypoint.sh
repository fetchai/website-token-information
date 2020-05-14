#!/bin/bash

sed -i "s/PGUSER=test/PGUSER=${PGUSER}/" package.json
sed -i "s/PGHOST=localhost/PGHOST=${PGHOST=}/" package.json
sed -i "s/PGPASSWORD=myPassword/PGPASSWORD=${PGPASSWORD}/" package.json
sed -i "s/PGDATABASE=douglas/PGDATABASE=${PGDATABASE}/" package.json

npm run start
