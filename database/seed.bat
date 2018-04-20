
mongo --eval "var mongoUri='%1', mongoDatabase='%2'" create-collections.js

mongoimport --uri mongodb://%1 --db %2  --collection dfa_allocation_rules --type=csv --headerline --file data/dfa_allocation_rules.csv

mongoimport --uri mongodb://%1 --db %2 --collection dfa_modules --type=csv --headerline --file data/dfa_modules.csv
mongoimport --uri mongodb://%1 --db %2 --collection dfa_submeasure_list --type=csv --headerline --file data/dfa_submeasure_list.csv
mongoimport --uri mongodb://%1 --db %2 --collection dfa_submeasure_rule_map --type=csv --headerline --file data/dfa_submeasure_rule_map.csv

echo database load complete
