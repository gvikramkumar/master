#!/bin/bash

if [$5 = ""]
then
echo "must pass in: buildno, environment (sdev, stage, prod) mongoPass, pgPass, artPass"
exit 1
fi

echo "deploying fin-dfa build $1"
echo "create dfa directories"
mkdir -p /apps/sparkadm/dfa/dfa_ui
mkdir -p /apps/sparkadm/dfa/mongodump
echo "dump current databse version into dfa/mongodump/build_$1.gz"
mongodump --host=findp-stg-01 --port=27017 --db=fin-dfa --username=mongodfa --password=$3 --gzip --archive=/apps/sparkadm/dfa/mongodump/build_$1.archive.gz
rm -rf /apps/sparkadm/dfa/dfa_ui/*
echo "copy fin-dfa_$1.tar.gz from sparkadm"
cd /apps/sparkadm/dfa/dfa_ui/
cp /apps/sparkadm/fin-dfa_$1.tar.gz ./
echo "Unzip and untar"
tar xvfz fin-dfa_$1.tar.gz
echo "Run Seedsh dev"
#cd database
#NODE_ENV=stage ./seed.sh findp-dev-01.cisco.com 27017 fin-dfa
echo "NPM Start"
BUILD_NUMBER=$1 NODE_ENV=$2 MONGODB_USER=mongodfa MONGODB_PASSWORD=$3 POSTGRES_USER=pgdfa POSTGRES_PASSWORD=$4 ART_USER=cepm-dfadoption.gen ART_PASSWORD=$5 npm start


