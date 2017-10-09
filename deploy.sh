#!/bin/bash
version=`git tag -l --points-at HEAD`
echo $version

if [ ! -z "$version" ]; then
	echo "Deploying..."
    cd extension && yarn install && vsce publish -p $1
else
	echo "Nothing to deploy - not a release version"
fi