"use strict";

require("./config");
var path = require("path");

var upgradeChaincode = require("./network/src/lib/chaincodes/upgrade-chaincode");
var version = "v1";

var collectionPath = path.join(
  __dirname,
  "network/src/chaincodes/events/collection_config.json"
);

upgradeChaincode
  .upgradeChaincode(
    ["peer0.supervisor.hyperprivacy.network.com"],
    "events",
    "node",
    version,
    ["init"],
    [""],
    "Supervisor",
    "eventchannel",
    "supervisor_admin",
    collectionPath
  )
  .then(res => {
    console.log(res);
  });