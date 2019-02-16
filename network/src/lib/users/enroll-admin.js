'use strict';

require('../../../../config');

//HINT
// console.log(admin_user.getIdentity()._publicKey.getPublicKey().toBytes());
// console.log(admin_user.getIdentity());


let hfc = require('fabric-client'),
    helper = require('../helper'),
    util = require('util'),
    admins = hfc.getConfigSetting('admins'),
    adminUser = null;

var enrollAdmin = async function(orgName) {

    if (!admins[orgName]) {
        console.log(util.format('Admin for organisation %s is not defined in config.json', orgName));
    }

    let client = await helper.getClientForOrg(orgName)

    client.getUserContext(admins[orgName].username, true)
    .then(async admin => {

        if (admin && admin.isEnrolled()) {
            console.log("Successfully loaded admin from persistence");
            adminUser = admin;
            return null;
        }

        let caClient = client.getCertificateAuthority();

        return caClient.enroll({
            enrollmentID: admins[orgName].username,
            enrollmentSecret: admins[orgName].secret
          })
          .then( enrollment => {
            return client.createUser({
                username: admins[orgName].username,
                mspid: orgName + 'MSP',
                type: 'admin',
                cryptoContent: {
                    privateKeyPEM: enrollment.key.toBytes(),
                    signedCertPEM: enrollment.certificate
                  }
            });

          })
          .then( user => {
              console.log("admin enrolled", orgName);
          })

    })
    .then(() => {
        console.log("admin loaded from persistance", orgName);
    });

}

exports.enrollAdmin = enrollAdmin;