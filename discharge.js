const express = require('express');
const router = express.Router();
const Patient = require('./models/patient');

router.post('/', async (req, res) => {
    const { name } = req.body;

    try {
        await Patient.findOneAndDelete({ name });
        const patients = await Patient.find();
        res.render('adminHome', { data: patients });
    } catch (err) {
        console.log(err);
        res.send('An error occurred while discharging the patient');
    }
});

module.exports = router;
