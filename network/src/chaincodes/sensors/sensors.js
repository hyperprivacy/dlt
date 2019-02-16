/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const shim = require('fabric-shim');

let Chaincode = class {

  // The Init method is called when the Smart Contract 'Chat' is instantiated by the blockchain network
  // Best practice is to have any Ledger initialization in separate function -- see initLedger()
  async Init(stub) {
    console.info('=========== Instantiated Sesors chaincode ===========');

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
  // create sensor asset 
  // add into state

  async addSensor(stub, args, thisClass) {

    // define args
    let sensorId = args[0];
    let mac = args[1];
    let type = args[2];
    let name = args[3];
    let description = args[4];


    // check if sensor already exist in state
    let sensorState = await stub.getState(sensorId);
    if (sensorState.toString()) {
      throw new Error("This sensor already exist " + sensorId);
    }

    // create sensor object and marshal to json
    let sensor = {};
    sensor.docType = "sensor";
    sensor.id = sensorId;
    sensor.mac = mac;
    sensor.type = type;
    sensor.name = name;
    sensor.description = description;


    // save marble to state
    await stub.putState(sensorId, Buffer.from(JSON.stringify(sensor)));

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

  // get all sensors
  // check all sensors

  async checkSensors(stub, args, thisClass) {

    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting docType of the sensor to query');
    }

    // define query variable
    //let type = args[0];

    // build the query
    
    let query = `{"selector":{"docType":"sensor"}}`

    // function that return iterator
    const iterator = await stub.getQueryResult(query);


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

  // get one sensor by id
  // check the one sensors status
  async checkSensor(stub, args, thisClass) {

    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting sensorId of the sensor to query');
    }

    // define query variable
    let id = args[0];

    // build the query
    // get the sensor by macadress 
    let query = `{"selector":{"_id":"${id}"}}`

    console.log("query", query);

    // function that return iterator
    const iterator = await stub.getQueryResult(query);

    //to call async function into another, define into invoke function  with "this" third param
    // define function and use thisClass as third param for declaration
    const getAllResults = thisClass['getAllResults'];

    // save data into const results from getAllResults
    const results = await getAllResults(iterator, false);

    var string = JSON.stringify(results);

    return Buffer.from(string);

  }

  // delete sensor from state
  async removeSensor(stub, args, thisClass) {

    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting name of the sensor to delete');
    }
    let sensorsId = args[0];
    if (!sensorsId) {
      throw new Error('sensors id must not be empty');
    }
    //  we need to get sensor from state first and get its id from chaincode state
    // create object json
    let jsonResp = {};
    // get values as bytes
    let valAsbytes = await stub.getState(sensorsId);
    // check if exist 
    if (!valAsbytes) {
      jsonResp.error = 'sensor does not exist: ' + sensorsId;
      throw new Error(jsonResp);
    }
    // save values of bytes into json
    // init var
    let sensorJSON = {};
    try {
      sensorJSON = JSON.parse(valAsbytes.toString());
    } catch (err) {
      jsonResp = {};
      jsonResp.error = 'Failed to decode JSON of: ' + sensorsId;
      throw new Error(jsonResp);
    }

    await stub.deleteState(sensorsId); //remove the sensor from chaincode state

  }

  // update sensor

  async updateSensor(stub, args, thisClass) {

    // get the sensor for update based on the sensorId
    let sensorId = args[0];

    // get sensor at state
    let sensorAsBytes = await stub.getState(sensorId);

    // unmarshal aka json parse
    // from buffer to json
    let updatedSensor = JSON.parse(sensorAsBytes);

    //define updated properties as argument
    // note: check the order for creating the asset
    updatedSensor.status = args[1];
    updatedSensor.type = args[2];
    updatedSensor.macadress = args[3];
    updatedSensor.description = args[4];

    await stub.putState(sensorId, Buffer.from(JSON.stringify(updatedSensor)));

  }

  // invoke event chaincode

  async callCcEvent(stub,args,thisClass){

  let chaincodeName = args[0] 
  let channel = args[1];
  let sensorId = arg[2];
  let method = thisClass['checkSensor'];
  let queryArgs = await method(sensorId);

  let response = stub.InvokeChaincode(chaincodeName, channel, queryArgs);

  console.log("response",response);

  return Buffer.from(JSON.stringify(response));

}
}

shim.start(new Chaincode());