#! /bin/bash

TARGET=$1;
BUILD_CHROME=0;
BUILD_FF=0;
webpack=node_modules/webpack-cli/bin/cli.js 

if [ -z $TARGET ]; then
  echo "Specify target 'npm run build:dev {chrome,firefox}.";  
fi;

case "${TARGET[@]}" in  *"chrome"*) 
  BUILD_CHROME=1;
esac

case "${TARGET[@]}" in  *"firefox"*) 
  BUILD_FF=1;
esac

if [ $BUILD_CHROME -eq 1 ]; then
  echo "Building Chrome Plugin...";
  NODE_ENV=production node ./node_modules/webpack-cli/bin/cli.js -p --mode=production --config webpack.chrome.js --watch
  echo "OK";
fi

if [ $BUILD_FF -eq 1 ]; then
  echo "Building Firefox Extension...";
  NODE_ENV=production node ./node_modules/webpack-cli/bin/cli.js -p --mode=production --config webpack.firefox.js --watch
  echo "OK";
fi