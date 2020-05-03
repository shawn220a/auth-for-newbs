const monk = require('monk');

const db = monk('localhost/auth-for-newbs');

module.exports = db;