#!/bin/bash
set -x #enable echo

mongo botf --eval 'db.reasons.drop()'
mongoimport --db botf --collection reasons --jsonArray < reasons.json

mongo botf --eval 'db.offices.drop()'
mongoimport --db botf --collection offices --jsonArray < offices.json

mongo botf --eval 'db.signageads.drop()'
mongoimport --db botf --collection signageads --jsonArray < signage_ads.json

mongo botf --eval 'db.bankers.drop()'
mongoimport --db botf --collection bankers --jsonArray < bankers.json