#!/usr/bin/env bash

# must be called with: host port database

./seed.sh $1 $2 $3
mongo --nodb  --eval "var host='$1', port='$2', _db='$3'" remove-test-data.js
mongo --nodb  --eval "var host='$1', port='$2', _db='$3'" load-test-data.js

