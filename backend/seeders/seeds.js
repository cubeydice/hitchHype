const mongoose = require("mongoose");
const { mongoURI: db } = require('../config/keys.js');
const User = require('../models/User');
const Tweet = require('../models/Tweet');
const Trip = require('../models/Trip');
const Car = require('../models/Car');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const NUM_SEED_USERS = 10;
// const NUM_SEED_TWEETS = 10;
const NUM_SEED_TRIPS = 10;
const NUM_SEED_CARS = 10;

// Create users
const users = [];

const demoRider = new User ({
    email: 'demo-user@appacademy.io',
    hashedPassword: bcrypt.hashSync('starwars', 10),
    firstName: 'demo',
    lastName: 'rider',
    // phoneNumber: '1234567890',
    biography: faker.lorem.sentences(5),
    address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.state()} ${faker.address.zipCode()}`
})
users.push(demoRider)
// Used to add demo rider to trips
const demoInfo = {
    passenger: demoRider._id,
    dropoffPoint: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.state()} ${faker.address.zipCode()}`
}

for (let i = 1; i < NUM_SEED_USERS; i++) {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    users.push(
        new User ({
            email: faker.internet.email(firstName, lastName),
            hashedPassword: bcrypt.hashSync(faker.internet.password(), 10),
            firstName: firstName,
            lastName: lastName,
            // phoneNumber: Math.floor(1000000000 + Math.random() * 9000000000),
            address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.state()} ${faker.address.zipCode()}`
        })
    )
}

// Can be refactored for reviews
// Create tweets
// const tweets = [];

// for (let i = 0; i < NUM_SEED_TWEETS; i++) {
//     tweets.push(
//         new Tweet ({
//         text: faker.hacker.phrase(),
//         author: users[Math.floor(Math.random() * NUM_SEED_USERS)]._id
//         })
//     )
// }

const cars = [];
const sampleInsuranceCompanies = [
    "Company A",
    "Company B",
    "Company C",
    // Add more company names here
];

for (let i = 0; i < NUM_SEED_CARS; i++) {
    const randomOwner = users[Math.floor(Math.random() * NUM_SEED_USERS)]._id;

    cars.push(
        new Car ({
            owner: randomOwner,
            make: faker.vehicle.manufacturer(),
            model: faker.vehicle.model(),
            year: faker.datatype.number({ min: 2000, max: 2022 }),
            maxPassengers: faker.datatype.number({ min: 2, max: 5 }),
            licensePlateNumber: faker.random.alphaNumeric(7).toUpperCase(),
            insurance: sampleInsuranceCompanies[Math.floor(Math.random() * sampleInsuranceCompanies.length)],
            mpg: faker.datatype.number({ min: 10, max: 50 }),
            fueleconomyId: faker.datatype.number({ min: 1000, max: 9999 }),
        })
    )
}

// Create trips
const trips = [];

for (let i = 0; i < NUM_SEED_TRIPS; i++) {
    const usersDup = users.slice(1, users.length);
    const randomDriver = usersDup[Math.floor(Math.random() * usersDup.length)]._id;
    const randomCarId = cars[Math.floor(Math.random() * NUM_SEED_CARS)]._id
    const randomPassengers = []
    const randomBoolean = Math.random() < 0.3;
    // Choose two random passengers and generate two dropoff points from the users array
    for (let j = 0; j < 2; j++) {
        const randomPassenger = users[Math.floor(Math.random() * NUM_SEED_USERS)]._id

        const passengerInfo = {
            passenger: randomPassenger,
            dropoffPoint: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.state()} ${faker.address.zipCode()}`
        };

        randomPassengers.push(passengerInfo);
    }
    if (randomBoolean) randomPassengers.push(demoInfo);

    trips.push(
        new Trip ({
            driver: randomDriver,
            car: randomCarId,
            passengers: randomPassengers,
            departureDate: faker.date.future(),
            origin: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.state()} ${faker.address.zipCode()}`,
            destination: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.state()} ${faker.address.zipCode()}`,
            availableSeats: Math.floor(Math.random() * 6) + 1
        })
    )
}


// Create demo driver, needs trips and cars to be initialized beforehand
let driverTrips = []
const driverCar = cars[Math.floor(Math.random() * NUM_SEED_CARS)]._id

const demoDriver = new User ({
        email: 'demo-user2@appacademy.io',
        hashedPassword: bcrypt.hashSync('starwars', 10),
        firstName: 'demo',
        lastName: 'driver',
        // phoneNumber: '1234567890',
        biography: faker.lorem.sentences(5),
        trips: driverTrips,
        car: driverCar,
        address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.state()} ${faker.address.zipCode()}`
});



for (let i = 0; i < 3; i++) {
    const randomPassengers = []

    // Choose two random passengers and generate two dropoff points from the users array
    for (let j = 0; j < 2; j++) {
        const randomPassenger = users[Math.floor(Math.random() * NUM_SEED_USERS)]._id

        const passengerInfo = {
            passenger: randomPassenger,
            dropoffPoint: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.state()} ${faker.address.zipCode()}`
        };

        randomPassengers.push(passengerInfo);
    }
    // Add demo rider to passengers
    randomPassengers.push(demoInfo);

    const trip = new Trip ({
        driver: demoDriver._id,
        car: driverCar,
        passengers: randomPassengers,
        departureDate: faker.date.future(),
        origin: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.state()} ${faker.address.zipCode()}`,
        destination: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.state()} ${faker.address.zipCode()}`,
        availableSeats: Math.floor(Math.random() * 6) + 1
    })
    demoDriver.trips.push(trip)
    trips.push(trip)
}
users.push(demoDriver);




mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => {
        // console.log('Connected to MongoDB successfully');
        insertSeeds();
    })
    .catch(err => {
        console.error(err.stack);
        process.exit(1);
    });

// Reset and seed db
const insertSeeds = () => {
    // console.log("Resetting db and seeding users and tweets...");

    User.collection.drop()
                    .then(() => Trip.collection.drop())
                    .then(() => Car.collection.drop())
                    .then(() => User.insertMany(users))
                    // .then(() => Tweet.insertMany(tweets))
                    .then(() => Trip.insertMany(trips))
                    .then(() => Car.insertMany(cars))
                    .then(() => {
                        // console.log("Done!");
                        mongoose.disconnect();
                    })
                    .catch(err => {
                        console.error(err.stack);
                        process.exit(1);
                    });
}
