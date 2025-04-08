const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// GET all applicants
router.get('/', async (req, res) => {
    console.log('GET /api/applicants');
    try {
        const result = await pool.query('SELECT * FROM applicant_information');
        res.json(result.rows);
    } catch (error) {
        console.error('Error in GET /api/applicants:', error);
        res.sendStatus(500);
    }
});

// GET single applicant by ID
router.get('/:id', async (req, res) => {
    console.log('GET /api/applicants/:id');
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM applicant_information WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Applicant not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error in GET /api/applicants/:id:', error);
        res.sendStatus(500);
    }
});

// POST (Create a new applicant)
router.post('/', async (req, res) => {
    console.log('POST /api/applicants');
    try {
        const { first_name, middle_initial, last_name, date_of_birth, gender, marital_status,
            street_address, city, state, zip_code, us_citizen, ssn, home_phone, other_phone } = req.body;
        const result = await pool.query(
            `INSERT INTO applicant_information (
            first_name, middle_initial, last_name, date_of_birth, gender, marital_status,
            street_address, city, state, zip_code, us_citizen, ssn, home_phone, other_phone) 
             VALUES ($1, $2, $3, $4, $5, $6,
             $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
            [first_name, middle_initial, last_name, date_of_birth, gender, marital_status,
                street_address, city, state, zip_code, us_citizen, ssn, home_phone, other_phone]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error in POST /api/applicants:', error);
        res.sendStatus(500);
    }
});

// PUT (Update an applicant)
router.put('/:id', async (req, res) => {
    console.log('PUT /api/applicants/:id');
    try {
        const { id } = req.params;
        const { first_name, middle_initial, last_name, date_of_birth, gender, marital_status,
            street_address, city, state, zip_code, us_citizen, ssn, home_phone, other_phone } = req.body;
        const result = await pool.query(
            `UPDATE applicant_information 
             SET first_name = $1, middle_initial = $2, last_name = $3, date_of_birth = $4, gender = $5, marital_status = $6,
                street_address = $7, city = $8, state = $9, zip_code = $10, us_citizen = $11, ssn = $12, home_phone = $13, other_phone = $14
             WHERE id = $15 RETURNING *`, 
            [first_name, middle_initial, last_name, date_of_birth, gender, marital_status,
                street_address, city, state, zip_code, us_citizen, ssn, home_phone, other_phone, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Applicant not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error in PUT /api/applicants/:id:', error);
        res.sendStatus(500);
    }
});

// DELETE an applicant
router.delete('/:id', async (req, res) => {
    console.log('DELETE /api/applicants/:id');
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM applicant_information WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Applicant not found" });
        }
        res.json({ message: "Applicant deleted successfully" });
    } catch (error) {
        console.error('Error in DELETE /api/applicants/:id:', error);
        res.sendStatus(500);
    }
});

module.exports = router;
