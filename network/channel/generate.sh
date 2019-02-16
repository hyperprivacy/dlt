#!/bin/sh
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
export PATH=/home/davor/Desktop/dlt/network/channel/bin
CHANNEL_NAME=eventchannel

# remove previous crypto material and config transactions
rm -fr artifacts/*
rm -fr crypto-config/*

# generate crypto material
cryptogen generate --config=./crypto-config.yaml
if [ "$?" -ne 0 ]; then
  echo "Failed to generate crypto material..."
  exit 1
fi

# generate genesis block for orderer
configtxgen -profile FourOrgsOrdererGenesis -outputBlock ./artifacts/genesis.block
if [ "$?" -ne 0 ]; then
  echo "Failed to generate orderer genesis block..."
  exit 1
fi

# generate channel configuration transaction
  configtxgen -profile EventChannel -outputCreateChannelTx ./artifacts/eventchannel.tx -channelID $CHANNEL_NAME
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi

# generate anchor peer transaction
configtxgen -profile EventChannel -outputAnchorPeersUpdate ./artifacts/SupervisorMSPanchors.tx -channelID $CHANNEL_NAME -asOrg SupervisorMSP 
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for RegulatorMSP..."
  exit 1
fi

# generate anchor peer transaction
configtxgen -profile EventChannel -outputAnchorPeersUpdate ./artifacts/ProviderMSPanchors.tx -channelID $CHANNEL_NAME -asOrg ProviderMSP 
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for ProviderMSP..."
  exit 1
fi


# generate anchor peer transaction
configtxgen -profile EventChannel -outputAnchorPeersUpdate ./artifacts/IotMSPanchors.tx -channelID $CHANNEL_NAME -asOrg IotMSP 
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for IotMSP..."
  exit 1
fi


# generate anchor peer transaction
configtxgen -profile EventChannel -outputAnchorPeersUpdate ./artifacts/EndUserMSPanchors.tx -channelID $CHANNEL_NAME -asOrg EndUserMSP 
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for EndUserMSP..."
  exit 1
fi
