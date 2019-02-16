var enrollAdmin = require('./network/src/lib/users/enroll-admin');

async function enrollAdmins() {

    await enrollAdmin.enrollAdmin('Supervisor');
    await enrollAdmin.enrollAdmin('Provider');
    await enrollAdmin.enrollAdmin('EndUser');
    await enrollAdmin.enrollAdmin('Iot');
}

enrollAdmins();
