/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

"use strict";
const shim = require("fabric-shim");
const JSON = require("circular-json");

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
      console.error('no function of name:' + ret.fcn + ' found');
      throw new Error('Received unknown function ' + ret.fcn + ' invocation');
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

    async getEvents(stub, args, thisClass) {

      let query = `{"selector":{"type":"event"}}`

      // function that return iterator
      const iterator = await stub.getPrivateDataQueryResult("defaultEvent", query);

      console.log(iterator);
  
      //to call async function into another, define into invoke function  with "this" third param
      // define function and use thisClass as third param for declaration
      const getAllResults = thisClass['getAllResults'];
  
      // save data into const results from getAllResults
      const results = await getAllResults(iterator, false);
  
      // convert from buffer bytes array to string
      // also define that into query script response_payload to string
      var string = JSON.stringify(results);
  
      return Buffer.from(string);
    }

    async getCriticalEvents(stub, args, thisClass) {

      let query = `{"selector":{"type":"event"}}`

      // function that return iterator
      const { iterator } = await stub.getPrivateDataQueryResult("criticalEvent", query);
  
  
      //to call async function into another, define into invoke function  with "this" third param
      // define function and use thisClass as third param for declaration
      const getAllResults = thisClass['getAllResults'];
  
      // save data into const results from getAllResults
      const results = await getAllResults(iterator, false);
  
      // convert from buffer bytes array to string
      // also define that into query script response_payload to string
      var string = JSON.stringify(results);
  
      return Buffer.from(string);
    }


     // get allResults
  async getAllResults(iterator, isHistory) {
    // array of results
    let allResults = [];
    while (true) {
      // go trought response value
      let res = await iterator.next();

      // convert value(bytes json) into string
      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log("TO string", res.value.value.toString('utf8'));

        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.value.tx_id;
          jsonRes.Timestamp = res.value.timestamp;
          jsonRes.IsDelete = res.value.is_delete.toString();
          // convert from string into json object
          try {
            jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Value = res.value.value.toString('utf8');
          }
        } else {
          // create struct(key, value)
          // key= conversation id, value is properties of conversation object(grants, history, etc)
          jsonRes.Key = res.value.key;
          try {
            jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Record = res.value.value.toString('utf8');
          }
        }
        // push json response into array allResults
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        // close iterator
        await iterator.close();
        console.info("INFOO", allResults);
        return allResults;
      }
    }
  }
};

shim.start(new Chaincode());
