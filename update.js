const express = require('express');
const router = express.Router();
const Patient = require('./models/patient');

// Update patient route
router.get('/:id', async (req, res) => {
    if (!req.session.userType) {
        return res.redirect('/login');
    }

    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.send('Patient not found');
        }

        res.render('update', { patient });
    } catch (err) {
        console.log(err);
        res.send('An error occurred while fetching the patient');
    }
});

router.post('/:id', async (req, res) => {
    const { name, number, dob, city } = req.body;
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
        return res.send('Patient not found');
    }

    try {
        patient.name = name;
        patient.number = number;
        patient.dob = dob;
        patient.city = city;

        await patient.save();

        const patients = await Patient.find();
        const userType = req.session.userType;

        res.render('adminHome', { data: patients, userType });
    } catch (err) {
        console.error(err);
        res.send('An error occurred while updating patient data');
    }
});

module.exports = router;
