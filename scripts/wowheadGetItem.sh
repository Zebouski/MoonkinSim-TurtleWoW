#!/usr/bin/env bash

ITEMNAME="$1"
if [ "$ITEMNAME" == "" ]; then
  echo "Usage: $0 <itemname>"
  echo ""
  exit 1
fi


set -xe
curl "https://www.wowhead.com/item=$ITEMNAME&xml" 
