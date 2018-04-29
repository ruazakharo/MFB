#!/bin/bash
set -x #enable echo

mongo botf --eval 'db.reasons.drop()'
mongo botf --eval 'db.offices.drop()'

mongoimport --db botf --collection reasons --jsonArray < reasons.json
mongoimport --db botf --collection offices --jsonArray < offices.json