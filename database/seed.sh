#!/usr/bin/env bash

mongo --eval "var host='$1', port='$2', _db='$3'" create-collections.js

mongoimport --host $1 --port $2 --db $3  --collection dfa_allocation_rules --type=csv --headerline --file data/dfa_allocation_rules.csv

mongoimport --host $1 --port $2 --db $3 --collection dfa_modules --type=csv --headerline --file data/dfa_modules.csv
mongoimport --host $1 --port $2 --db $3 --collection dfa_submeasure_list --type=csv --headerline --file data/dfa_submeasure_list.csv
mongoimport --host $1 --port $2 --db $3 --collection dfa_submeasure_rule_map --type=csv --headerline --file data/dfa_submeasure_rule_map.csv

echo database load complete
