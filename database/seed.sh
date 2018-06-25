#!/usr/bin/env bash

# must be called with: host port database

mongo --nodb  --eval "var host='$1', port='$2', _db='$3'" create-collections.js

mongoimport --host $1 --port $2 --db $3  --collection dfa_allocation_rule --type=csv --headerline --file data/allocation_rule.csv
mongoimport --host $1 --port $2 --db $3 --collection dfa_module --type=csv --headerline --file data/module.csv

echo database load complete

mongo --nodb  --eval "var host='$1', port='$2', _db='$3'" post-data-load.js

node load-files.js $1 $2 $3
