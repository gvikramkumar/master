#!/bin/bash

# to call this: scriptPath ssoPassword jobEndpoint

curl -c cookies.txt -L -H "userid:dfaadmin.gen" -H "password:$1" https://sso-nprd.cisco.com/autho/apps/sso/getssosession/LT.html

status_code=$(curl -L -b cookies.txt --write-out %{http_code} --silent --output curl-output.txt $2)
echo $status_code
if [[ "$status_code" -ne 202 ]] ; then
  exit 1
else
  exit 0
fi

