#!/usr/bin/env bash

REGION="us"
ITEMID="$1"
NAMESPACE="static-classic-us"
LOCALE="en_US"

if [ "$ACCESSTOKEN" == "" ]; then
  echo "Usage: $0 <item_id>"
  echo ""
  echo "ACCESSTOKEN environment must be set"
  exit 1
fi

if [ "$ITEMID" == "" ]; then
  echo "Usage: $0 <item_id>"
  echo ""
  echo "<item_id> required"
  exit 1
fi

set -ex
curl "https://us.api.blizzard.com/data/wow/item/$ITEMID?namespace=$NAMESPACE&locale=en_US&access_token=$ACCESSTOKEN"
