const express = require('express');
const router = express.Router();
const User = require('./models/user');

// Login route
router.get('/', (req, res) => {
    res.render('login', { message: '' });
});

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user || user.password !== password) {
            const message = 'Invalid username or password';
            return res.render('login', { message });
        }

        req.session.userType = user.userType;

        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.send('An error occurred while logging in');
    }
});

module.exports = router;
