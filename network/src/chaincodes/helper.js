'use strict'


var getAllResults = async function(iterator,isHistory) {
 // array of results
 let allResults = [];
 while (true) {
   // go trought response value
   let res = await iterator.next();

   // convert value(bytes json) into string
   if (res.value && res.value.value.toString()) {
     let jsonRes = {};
     console.log(res.value.value.toString('utf8'));

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
     console.info(allResults);
     return allResults;
   }
 }
}
module.exports = getAllResults;