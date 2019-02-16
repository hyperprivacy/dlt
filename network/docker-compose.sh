#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set -e

#### IMPORTANT DELETE IMAGE AND CONTAINER OF PAST CHAINCODE,BEFORE DEPLOYING NEW ONE

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)
LANGUAGE=${1:-"node"}

docker-compose -f ./docker-compose.yaml down

docker-compose -f ./docker-compose.yaml up -d


# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export 
export FABRIC_START_TIMEOUT=10
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}


# Create the channel
cd ..

node operational-create-channel.js

sleep 5

node operational-join-channel.js