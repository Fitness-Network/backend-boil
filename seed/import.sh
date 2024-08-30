#!/bin/bash

uri=mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@mongodb:27017/$MONGO_INITDB_DATABASE?authSource=admin

echo $uri

mongorestore --uri $uri $1 /mongo-seed/$APP_MODE/dump/$MONGO_INITDB_DATABASE
