const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const User = require('./models/user');
const Patient = require('./models/patient');

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

app.get('/', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.render('home', { data: patients });
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
    res.render('home', { data: patients });
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

app.get('/login', (req, res) => {
  res.render('login', { message: '' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });

  if (!user) {
    res.send('Invalid username or password');
  } else {
    req.session.userType = user.userType;
    res.redirect('/');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('App is running on port 3000');
});
