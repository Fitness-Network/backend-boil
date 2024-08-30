#!/bin/bash

uri=mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@mongodb:27017/$MONGO_INITDB_DATABASE?authSource=admin

echo $MONGO_INITDB_DATABASE
mkdir -p /mongo-seed/$APP_MODE/dump
mongodump --uri $uri --out /mongo-seed/$APP_MODE/dump --collection templates -d $MONGO_INITDB_DATABASE
mongodump --uri $uri --out /mongo-seed/$APP_MODE/dump --collection products -d $MONGO_INITDB_DATABASE
mongodump --uri $uri --out /mongo-seed/$APP_MODE/dump --collection users -d $MONGO_INITDB_DATABASE
mongodump --uri $uri --out /mongo-seed/$APP_MODE/dump --collection referrals -d $MONGO_INITDB_DATABASE
mongodump --uri $uri --out /mongo-seed/$APP_MODE/dump --collection referralrewards -d $MONGO_INITDB_DATABASE
mongodump --uri $uri --out /mongo-seed/$APP_MODE/dump --collection orders -d $MONGO_INITDB_DATABASE
