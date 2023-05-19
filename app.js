const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const Patient = require('./models/patient');
const User = require('./models/user');

const loginRoutes = require('./login');
const homeRoutes = require('./home');
const dischargeRoutes = require('./discharge');
const updateRoutes = require('./update');
const logoutRouter = require('./logout');

mongoose.set('strictQuery', true);

async function connectToDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/hospital', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to database');
  } catch (err) {
    console.log(err);
  }
}

connectToDB();

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
app.use('/login', loginRoutes);
app.use('/logout', logoutRouter);
app.use('/', homeRoutes);
app.use('/discharge', dischargeRoutes);
app.use('/update', updateRoutes);

app.listen(3000, () => {
  console.log('App is running on port 3000');
});