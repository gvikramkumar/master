#!/bin/bash

# must be called with: host port database

mongo --nodb  --eval "var host='$1', port='$2', _db='$3', user='$4', pass='$5'" remove-test-data.js
