require('./config');

var users = require('./network/src/lib/users/signin');

users.signIn('Supervisor', 'supervisor_admin', 'supervisor2019');