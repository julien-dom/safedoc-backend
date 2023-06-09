var express = require('express');
var router = express.Router();

const Doctor = require('../models/doctors');
const { checkBody } = require('../modules/checkBody');

// GET /doctors

router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json({ result: true, length: doctors.length, doctors: doctors });
    } catch (error) {
        res.json({ result: false, error: "An error occurred while retrieving doctors" });
    }
});

// GET /doctors/search/:id

router.get('/search/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ _id: req.params.id });
        if (doctor) {
            res.json({ result: true, doctor: doctor });
        } else {
            res.json({ result: false, error: "Doctor not found" });
        }
    } catch (error) {
        res.json({ error: "An error occurred while retrieving the doctor" });
    }
});

// POST /doctors/search/address

router.post('/search/address', async (req, res) => {
    try {
        const address = req.body.address;
        const url = `https://api-adresse.data.gouv.fr/search/?q=${address}&limit=5`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.features && data.features.length > 0) {

            const addresses = data.features.map(feature => feature.properties.label);
            const modifiedAddresses = [];

            for (const address of addresses) {
                const addressArray = address.split(" ");
                const modifiedAddressArray = [addressArray.slice(0, -2).join(" "), addressArray.slice(-2).join(" ")];
                const modifiedAddress = modifiedAddressArray.join(", ");
                modifiedAddresses.push(modifiedAddress);
            }

            const latitude = data.features.map(latitude => latitude.geometry.coordinates[1]);
            const longitude = data.features.map(longitude => longitude.geometry.coordinates[0]);

            const results = [];
            for (let i = 0; i < addresses.length; i++) {
                results.push({ address: modifiedAddresses[i], latitude: latitude[i], longitude: longitude[i] });
            }

            res.json({ result: true, results: results });

        } else {
            res.status(404).json({ error: "No results found for this address" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while searching for this address" });
    }
});

// POST /doctors/search

router.post('/search', async (req, res) => {
    try {
        const { lastname, specialties, department } = req.body;
        const query = {};

        if (lastname) {
            query.lastname = lastname;
        }
        if (specialties) {
            query.specialties = specialties;
        }
        if (department) {
            query.address = { $regex: new RegExp(`\\b${department}\\d{3}\\b`, 'i') };
        }

        const doctors = await Doctor.find(query);

        if (doctors.length > 0) {
            res.json({ result: true, length: doctors.length + " résultats trouvés", doctors: doctors });
        } else {
            res.json({ result: false, error: "No doctor found" });
        }
    } catch (error) {
        res.json({ error: "An error occurred while searching for doctors" });
    }
});

// POST /doctors/add/verify

router.post('/add/verify', async (req, res) => {
    if (!checkBody(req.body, ['firstname', 'lastname', 'email'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }
    try {
        const doctor = await Doctor.findOne({ email: req.body.email });
        if (doctor) {
            res.json({ result: false, error: "email already in use" });
        } else {
            res.json({ result: true, message: "no doctor found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// POST /doctors/add

router.post('/add', async (req, res) => {
    if (!checkBody(req.body, ['firstname', 'lastname', 'email', 'phone', 'address'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    if (!emailRegex.test(req.body.email)) {
        res.json({ result: false, error: 'Invalid email format' });
        return;
    }
    if (!phoneRegex.test(req.body.phone)) {
        res.json({ result: false, error: 'Invalid phone format' });
        return;
    }

    try {
        const { firstname,
            lastname,
            email,
            phone,
            address,
            latitude,
            longitude,
            sector,
            specialties,
            languages,
            tags,
        } = req.body;

        if (!sector) {
            res.json({ result: false, error: 'Sector not found' });
            return;
        }

        if (req.body.specialties.length !== specialties.length) {
            res.json({ result: false, error: 'One or more specialties not found' });
            return;
        }

        if (req.body.languages.length !== languages.length) {
            res.json({ result: false, error: 'One or more languages not found' });
            return;
        }

        if (req.body.tags.length !== tags.length) {
            res.json({ result: false, error: 'One or more tags not found' });
            return;
        }

        const newDoctor = new Doctor({
            firstname: firstname,
            lastname: lastname,
            email: email,
            phone: phone,
            address: address,
            latitude: latitude,
            longitude: longitude,
            sector: {
                value: sector.value,
                description: sector.description
            },
            specialties: specialties,
            languages: languages,
            tags: tags,
            confidentiality: {
                value: 3,
                description: "no display"
            }
        });

        newDoctor.save()
            .then(doctor => {
                res.json({ result: true, newDoctor: doctor });
            });

    } catch (error) {
        console.error(error);
        res.json({ result: false, error: 'Server error' });
    }
});

// PUT /doctors/tags/:id

router.put('/tags/:id', async (req, res) => {
    const { tags } = req.body;
    const { id } = req.params;

    try {
        const doctor = await Doctor.findById(id);

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        if (Array.isArray(tags)) {
            for (const tag of tags) {
                if (!doctor.tags.includes(tag)) {
                    doctor.tags.push(tag);
                }
            };
        } else {
            if (!doctor.tags.includes(tags)) {
                doctor.tags.push(tags);
            }
        }

        await doctor.save();

        res.json({ result: true, updatedDoctor: doctor });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /doctors/confidentiality/:id

router.put('/confidentiality/:id', async (req, res) => {
    try {
        const doctorId = req.params.id;
        const confidentialityValue = req.body.value;
        const confidentialityDescription = req.body.description;

        const doctor = await Doctor.findById(doctorId);

        doctor.confidentiality.value = confidentialityValue;
        doctor.confidentiality.description = confidentialityDescription;

        const updatedDoctor = await doctor.save();

        res.json({ doctorId: doctorId, confidentiality: updatedDoctor.confidentiality });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// DELETE /doctors 

router.delete('/', (req, res) => {
    Doctor.deleteMany({})
        .then(data => {
            if (data) {
                res.json({ result: true, message: "Collection doctors successfully deleted" });
            } else {
                res.json({ result: false, error: "Failed to delete collection doctors" });
            }
        })
});

module.exports = router;
