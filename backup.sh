#!/bin/bash

DT=$(date +%Y-%m-%d-%H-%M)
DIR=.bak
FILE="$DIR/$DT.tgz"
FILE_EXCLUDE=exclude.tag
mkdir $DIR -p
touch node_modules/$FILE_EXCLUDE
touch packages/backend/node_modules/$FILE_EXCLUDE
touch .bak/$FILE_EXCLUDE

tar -zcvf $FILE \
  --exclude-tag-all=$FILE_EXCLUDE \
	.
