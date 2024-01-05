const express = require('express');
const router = express.Router();

const sql = require('../config/postgres.js');

router.get('/', async (req, res, next) => {
	const sequence_rows = await sql`SELECT * FROM sequence_data`;
	res.status(200).json(sequence_rows);
});

module.exports = router;
