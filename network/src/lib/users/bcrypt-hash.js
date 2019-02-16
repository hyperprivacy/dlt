'use strict';

const bcrypt = require('bcrypt'),
password = process.argv[2];

let hash = bcrypt.hashSync(password, 10);

console.log(hash);