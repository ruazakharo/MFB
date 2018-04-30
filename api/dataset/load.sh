#!/bin/bash
set -x #enable echo

mongo botf --eval 'db.reasons.drop()'
mongo botf --eval 'db.offices.drop()'
mongo botf --eval 'db.signageads.drop()'

mongoimport --db botf --collection reasons --jsonArray < reasons.json
mongoimport --db botf --collection offices --jsonArray < offices.json
mongoimport --db botf --collection signageads --jsonArray < signage_ads.json