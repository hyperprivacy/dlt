const { gql } = require('apollo-server');
const glob = require('glob');
const fs = require('fs');
const path = require('path');

path.resolve(__dirname, './schema/**/*.gql');

const schemaString = glob
	.sync(path.resolve(__dirname, './schema/**/*.gql'))
	.map((filePath) => {
		return fs.readFileSync(filePath);
	})
	.join('\n');

const typeDefs = gql(schemaString);

module.exports = { typeDefs };
