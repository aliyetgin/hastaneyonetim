const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Define patient schema
const patientSchema = new mongoose.Schema({
	name: String,
	number: String,
	dob: String,
	city: String,
	roomNo: Number
});

// Define patient model
const Patient = mongoose.model('Patient', patientSchema);

const availableBeds = 2;

mongoose.set('strictQuery', true);

async function main() {
	await mongoose.connect('mongodb://localhost:27017/hospital', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	console.log("Connection Open")
}

main().catch(err => console.log(err));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}))

app.get("/", async function (req, res) {
	try {
		const patients = await Patient.find();
		res.render("home", {
			data: patients
		})
	} catch (err) {
		console.log(err);
		res.send("An error occurred while fetching patients");
	}
})

app.post("/", async (req, res) => {
	const name = req.body.name;
	const number = req.body.number;
	const dob = req.body.dob;
	const city = req.body.city;
	if (await Patient.countDocuments() < availableBeds) {
		const roomNo = await Patient.countDocuments() + 1;

		await Patient.create({
			name: name,
			number: number,
			dob: dob,
			city: city,
			roomNo: roomNo
		});

		const patients = await Patient.find();
		res.render("home", {
			data: patients
		});
	}
	else {
		res.send("No room available");
	}
})

app.post('/discharge', async (req, res) => {
	var name = req.body.name;

	try {
		await Patient.findOneAndDelete({ name: name });
		const patients = await Patient.find();
		res.render("home", {
			data: patients
		})
	} catch (err) {
		console.log(err);
		res.send("An error occurred while discharging the patient");
	}
})

app.listen(3000, () => {
	console.log("App is running on port 3000")
})
