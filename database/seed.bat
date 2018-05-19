
rem must be called with: host port database

mongo --eval "var host='%1', port='%2', _db='%3'" create-collections.js

mongoimport --host %1 --port %2 --db %3  --collection allocation_rule --type=csv --headerline --file data/allocation_rule.csv
mongoimport --host %1 --port %2 --db %3 --collection module --type=csv --headerline --file data/module.csv
mongoimport --host %1 --port %2 --db %3 --collection submeasure_rule --type=csv --headerline --file data/submeasure_rule.csv

echo database load complete

mongo --eval "var host='%1', port='%2', _db='%3'" post-data-load.js

node load-files.js
