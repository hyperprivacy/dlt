var { viewer } = require('./viewer');
var { devices } = require('./devices');
var { organization } = require('./organization');
var { events } = require('./events');

const Query = {
	viewer: viewer,
	devices: devices,
	organization: organization,
	events: events
};

module.exports = { Query };
