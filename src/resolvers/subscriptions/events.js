const { pubsub } = require('../../../static');

const events = () => {
	return pubsub.asyncIterator([ '[EVENT]', '[CRITICAL-EVENT]' ]);
};

module.exports = { events };
