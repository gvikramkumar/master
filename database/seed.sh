#!/bin/bash

## must be called with: host port database

mongo --nodb  --eval "var host='$1', port='$2', _db='$3', user='$4', pass='$5'" create-collections.js

mongoimport --host $1 --port $2 --db $3  --collection dfa_allocation_rule --file data/rules.json
mongoimport --host $1 --port $2 --db $3  --collection dfa_submeasure --file data/submeasures.json
mongoimport --host $1 --port $2 --db $3 --collection dfa_module --file data/modules.json
mongoimport --host $1 --port $2 --db $3  --collection dfa_data_source --file data/sources.json
mongoimport --host $1 --port $2 --db $3  --collection dfa_module_data_source --file data/module_data_source.json
mongoimport --host $1 --port $2 --db $3 --collection dfa_measure --file data/measures.json

echo database load complete

mongo --nodb  --eval "var host='$1', port='$2', _db='$3', user='$4', pass='$5'" post-data-load.js

node load-files.js $1 $2 $3 $4 $5
