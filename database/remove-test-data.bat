
rem must be called with: host port database

mongo --nodb  --eval "var host='%1', port='%2', _db='%3'" remove-test-data.js

