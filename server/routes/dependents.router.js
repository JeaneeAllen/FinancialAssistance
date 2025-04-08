const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// GET all dependents
router.get('/', async (req, res) => {
    console.log('GET /api/dependents');
    try {
        const result = await pool.query('SELECT * FROM dependent_information');
        res.json(result.rows);
    } catch (error) {
        console.error('Error in GET /api/dependents:', error);
        res.sendStatus(500);
    }
});

// GET single dependent by ID
router.get('/:id', async (req, res) => {
    console.log('GET /api/dependents/:id');
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM dependent_information WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "dependent not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error in GET /api/dependents/:id:', error);
        res.sendStatus(500);
    }
});

// POST (Create a new dependent)
router.post('/', async (req, res) => {
    console.log('POST /api/dependents');
    try {
        const { applicant_id, lives_with_applicant, d_first_name, d_middle_initial, d_last_name,
            d_date_of_birth, d_relationship, d_us_citizen, d_immigration, d_sponsor_name } = req.body;
        const result = await pool.query(
            `INSERT INTO dependent_information (
                applicant_id, lives_with_applicant, d_first_name, d_middle_initial,
                d_last_name, d_date_of_birth, d_relationship, d_us_citizen,
                d_immigration, d_sponsor_name 
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [ applicant_id, lives_with_applicant, d_first_name, d_middle_initial, d_last_name,
                d_date_of_birth, d_relationship, d_us_citizen, d_immigration, d_sponsor_name ]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error in POST /api/dependents:', error);
        res.sendStatus(500);
    }
});

// PUT (Update an dependent)
router.put('/:id', async (req, res) => {
    console.log('PUT /api/dependents/:id');
    try {
        const { id } = req.params;
        const { applicant_id, lives_with_applicant, d_first_name, d_middle_initial, d_last_name,
            d_date_of_birth, d_relationship, d_us_citizen, d_immigration, d_sponsor_name } = req.body;
        const result = await pool.query(
            `UPDATE dependent_information
            SET applicant_id = $1, lives_with_applicant = $2, d_first_name = $3, d_middle_initial = $4,
                d_last_name = $5, d_date_of_birth = $6, d_relationship = $7, d_us_citizen = $8,
                d_immigration = $9, d_sponsor_name = $10
             WHERE id = $11 RETURNING *`,
            [ applicant_id, lives_with_applicant, d_first_name, d_middle_initial, d_last_name,
                d_date_of_birth, d_relationship, d_us_citizen, d_immigration, d_sponsor_name, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "dependent not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error in PUT /api/dependents/:id:', error);
        res.sendStatus(500);
    }
});

// DELETE an dependent
router.delete('/:id', async (req, res) => {
    console.log('DELETE /api/dependents/:id');
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM dependent_information WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "dependent not found" });
        }
        res.json({ message: "dependent deleted successfully" });
    } catch (error) {
        console.error('Error in DELETE /api/dependents/:id:', error);
        res.sendStatus(500);
    }
});

module.exports = router;
