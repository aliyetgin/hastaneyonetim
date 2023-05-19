const express = require('express');
const router = express.Router();
const Patient = require('./models/patient');

const availableBeds = 50;

// Homepage route
router.get('/', async (req, res) => {
    if (!req.session.userType) {
        return res.redirect('/login');
    }

    try {
        const patients = await Patient.find();
        const userType = req.session.userType;

        if (userType === 'admin') {
            res.render('adminHome', { data: patients });
        } else if (userType === 'user') {
            res.render('userHome', { data: patients });
        } else {
            res.send('Invalid user type');
        }
    } catch (err) {
        console.log(err);
        res.send('An error occurred while fetching patients');
    }
});

router.post('/', async (req, res) => {
    const { name, number, dob, city } = req.body;
    const patientCount = await Patient.countDocuments();

    if (patientCount < availableBeds) {
        const roomNo = patientCount + 1;

        await Patient.create({ name, number, dob, city, roomNo });

        const patients = await Patient.find();
        const userType = req.session.userType;

        res.render('adminHome', { data: patients, userType });
    } else {
        res.send('No room available');
    }
});

module.exports = router;
