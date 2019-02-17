const { pubsub } = require('../../../main');

const events = () => {
	pubsub.asyncIterator([ '[EVENT]', '[CRITICAL-EVENT]' ]);
};

module.exports = { events };
