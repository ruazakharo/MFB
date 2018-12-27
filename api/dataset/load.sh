#!/bin/bash
set -x #enable echo

mongo mfb --eval 'db.reasons.drop()'
mongoimport --db mfb --collection reasons --jsonArray < reasons.json

mongo mfb --eval 'db.offices.drop()'
mongoimport --db mfb --collection offices --jsonArray < offices.json

mongo mfb --eval 'db.signageads.drop()'
mongoimport --db mfb --collection signageads --jsonArray < signage_ads.json

mongo mfb --eval 'db.bankers.drop()'
mongoimport --db mfb --collection bankers --jsonArray < bankers.json