#!/usr/bin/env bash

mongo --eval "var mongoUri='$1', database='$2'" create-collections.js
load('load-data.js');

print 'database seed complete'
