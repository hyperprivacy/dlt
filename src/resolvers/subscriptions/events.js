var pubsub = require('../../../main');

const events = () => {
	pubsub.asyncIterator([ 'EVENT_PUBLISHED' ]);
};

module.exports = { events };
