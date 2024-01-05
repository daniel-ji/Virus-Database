const postgres = require('postgres');

// TODO: make this env variables
const sql = postgres({
	host: 'localhost',
	port: 5432,
	username: process.env.POSTGRES_USERNAME,
	password: process.env.POSTGRES_PASSWORD,
});

module.exports = sql;