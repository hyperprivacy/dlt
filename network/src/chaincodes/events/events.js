/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

"use strict";
const shim = require("fabric-shim");
const clientIdentity = shim.ClientIdentity;
const util = require("util");
const uuidV1 = require("uuid/v1");

let Chaincode = class {
  // The Init method is called when the Smart Contract 'Chat' is instantiated by the blockchain network
  // Best practice is to have any Ledger initialization in separate function -- see initLedger()
  async Init(stub) {
    console.info("=========== Instantiated Sesors chaincode ===========");

    return shim.success();
  }

  // The Invoke method is called as a result of an application request to run the Smart Contract
  // 'Chat'. The calling application program has also specified the particular smart contract
  // function to be called, with arguments
  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);

    let method = this[ret.fcn];
    if (!method) {
      console.error("no function of name:" + ret.fcn + " found");
      throw new Error("Received unknown function " + ret.fcn + " invocation");
    }
    try {
      let payload = await method(stub, ret.params, this);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  // create shared private conversation collection org1
  async createEvent(stub, args) {

    let transient = stub.getTransient(),
      buffer = new Buffer(transient.map.data.value.toArrayBuffer());

    await stub.putPrivateData("defaultEvent", args[0], buffer);
  }

    // create shared private conversation collection org1 
    async createCriticalEvent(stub, args) {
      let transient = stub.getTransient(),
        buffer = new Buffer(transient.map.data.value.toArrayBuffer());
  
      await stub.putPrivateData("criticalEvent", args[0], buffer);
    }
};

shim.start(new Chaincode());
