const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const Patient = require('./models/patient');
const User = require('./models/user');

const availableBeds = 2;

mongoose.set('strictQuery', true);

async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/hospital', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connection Open");
  } catch (err) {
    console.log(err);
  }
}

main();

app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true,
}));

// Login route
app.get('/login', (req, res) => {
  res.render('login', { message: '' }); // define the "message" variable as an empty string
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      const message = 'Invalid username or password';
      return res.render('login', { message });
    }

    if (user.password !== password) {
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


// Homepage route
app.get('/', async (req, res) => {
  if (!req.session.userType) {
    return res.redirect('/login');
  }

  try {
    const patients = await Patient.find();
    const userType = req.session.userType;

    res.render('home', { data: patients, userType });
  } catch (err) {
    console.log(err);
    res.send('An error occurred while fetching patients');
  }
});
app.post('/', async (req, res) => {
  const { name, number, dob, city } = req.body;
  const patientCount = await Patient.countDocuments();

  if (patientCount < availableBeds) {
    const roomNo = patientCount + 1;

    await Patient.create({ name, number, dob, city, roomNo });

    const patients = await Patient.find();
    const userType = req.session.userType;

    res.render('home', { data: patients, userType });
  } else {
    res.send('No room available');
  }
});

app.post('/discharge', async (req, res) => {
  const { name } = req.body;

  try {
    await Patient.findOneAndDelete({ name });
    const patients = await Patient.find();
    res.render('home', { data: patients });
  } catch (err) {
    console.log(err);
    res.send('An error occurred while discharging the patient');
  }
});

// Update patient route
app.get('/update/:id', async (req, res) => {
  if (!req.session.userType) {
    return res.redirect('/login');
  }

  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.send('Patient not found');
    }

    res.render('update', { patient: patient });
  } catch (err) {
    console.log(err);
    res.send('An error occurred while fetching the patient');
  }
});


app.post('/update/:id', async (req, res) => {
  const { name, number, dob, city } = req.body;

  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.send('Patient not found');
    }

    patient.name = name;
    patient.number = number;
    patient.dob = dob;
    patient.city = city;

    await patient.save();

    const patients = await Patient.find();
    const userType = req.session.userType;

    res.render('home', { data: patients, userType });
  } catch (err) {
    console.log(err);
    res.send('An error occurred while updating patient data');
  }
});



app.listen(3000, () => {
  console.log('App is running on port 3000');
});
