
rem must be called with: host port database

mongo --nodb  --eval "var host='%1', port='%2', _db='%3'" create-collections.js
mongoimport --host %1 --port %2 --db %3 --collection dfa_module --file data/modules.json
mongoimport --host %1 --port %2 --db %3  --collection dfa_data_source --file data/sources.json
mongoimport --host %1 --port %2 --db %3 --collection dfa_measure --file data/measures.json
echo database load complete

mongo --nodb  --eval "var host='%1', port='%2', _db='%3'" post-data-load.js
mongo --nodb  --eval "var host='%1', port='%2', _db='%3'" post-data-load-unit.js

