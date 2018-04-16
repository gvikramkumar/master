
mongo create-collections.js

mongoimport --db fin-dfa --collection dfa_allocation_rules --type=csv --headerline --file data/dfa_allocation_rules.csv
mongoimport --db fin-dfa --collection dfa_modules --type=csv --headerline --file data/dfa_modules.csv
mongoimport --db fin-dfa --collection dfa_submeasure_list --type=csv --headerline --file data/dfa_submeasure_list.csv
mongoimport --db fin-dfa --collection dfa_submeasure_rule_map --type=csv --headerline --file data/dfa_submeasure_rule_map.csv
