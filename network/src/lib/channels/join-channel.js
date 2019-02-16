"use strict";

var util = require("util");
var helper = require("../helper");
var logger = helper.getLogger("Join-Channel");

/* 
join org on channel
*/

var joinChannel = async function(channelName, peers, orgName, username) {
  var errorMsg = {
      success: false,
      message: []
    },
    successMsg = {
      success: true,
      message: []
    },
    all_eventhubs = [];

  try {
    // setup the client for the org, basically this can't be broken
    // because we extract this information from token.
    var client = await helper.getClientForOrg(orgName, username);

    var channel = client.getChannel(channelName);

    // get the genesis block from orderer
    // start point where to join(connect)
    // admin based transaction
    let request = {
      txId: client.newTransactionID(true)
    };

    let genesis_block = await channel.getGenesisBlock(request);

    //define promsies array in which we will functions to execute
    var promises = [];
    // first function will be 10 seconds delay which will be resolved and then we will
    // continue with join_promise to execute in that array with await Promise.all()
    promises.push(new Promise(resolve => setTimeout(resolve, 10000)));

    //create join request which will be sent with channel.joinChannel() method
    let join_request = {
      targets: peers,
      txId: client.newTransactionID(true),
      block: genesis_block
    };

    //execute function and return promise
    let join_promise = channel.joinChannel(join_request);
    //push returned promise
    promises.push(join_promise);
    // wait for promise to be executed for joining peers, do not execute another line until all promises are returned
    // advantage of the event loop to run async non blocking functions concurrently.
    let results = await Promise.all(promises);

    //give me last result for adding peers because first element is waiting function on line #46
    //https://medium.freecodecamp.org/avoiding-the-async-await-hell-c77a0fb71c4c
    let peers_results = results.pop();
    logger.debug(peers_results);
    // write each peer results
    for (let i in peers_results) {
      let peers_result = peers_results[i];
      if (peers_result.response && peers_result.response.status === 200) {
        // if peer is added please add it to success array
        successMsg.message.push(
          util.format(
            "Succesfully joined peer %s in organization to the channel: %s",
            peers[i],
            channelName
          )
        );
      } else {
        // if peer is not added please add it to error array
        errorMsg.message.push({
          msg: util.format(
            "Failed to join peer %s to the channel %s",
            peers[i],
            channelName
          ),
          info: peers_result.toString()
        });
      }
    }
    // shoutdown event streams
    all_eventhubs.forEach(eh => {
      eh.disconnect();
    });
  } catch (error) {
    return {
      sucess: false,
      message: "Something is wrong on our side.",
      status: 500,
      info: error.toString()
    };
  }

  if (!errorMsg.message.length) {
    // build a response
    let response = {
      success: true,
      message: successMsg
    };
    return response;
  } else {
    errorMsg.status = "BAD_REQUEST";
    return errorMsg;
  }
};
exports.joinChannel = joinChannel;
