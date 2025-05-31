#!/bin/bash
# npm v14
. ~/.nvm/nvm.sh

# Read .env
set -o allexport; source .env; set +o allexport
echo "Using node env: $NODE_ENV";

echo "Switch to npm v20"
nvm use 20

echo "Installing npm libraries"
npm install --production=false

echo "Creating build"
npm run build-local

echo "Checking if postbuild exists"
if [ -d "./postbuild" ]
then
    echo "postbuild folder exists"
else
    mkdir postbuild
fi

echo "Overwrite files to postbuild folder"
cp -R build/* postbuild

pm2 describe $NODE_ENV > /dev/null
RUNNING=$?

if [ "${RUNNING}" -ne 0 ]; then
    echo "Starting build"
    pm2 start pm2.config.js --only "$NODE_ENV"
else
    echo "Restarting build"
    pm2 restart pm2.config.js --only "$NODE_ENV" --update-env
fi;
