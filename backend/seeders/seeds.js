const mongoose = require("mongoose");
const { mongoURI: db } = require('../config/keys.js');
const User = require('../models/User');
const Tweet = require('../models/Tweet');
const Trip = require('../models/Trip');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const NUM_SEED_USERS = 10;
const NUM_SEED_TWEETS = 10;
const NUM_SEED_TRIPS = 10;

// Create users
const users = [];

users.push(
    new User ({
        email: 'demo-user@appacademy.io',
        hashedPassword: bcrypt.hashSync('starwars', 10),
        firstName: 'demo',
        lastName: 'user',
        phoneNumber: '1234567890'
    })
)

for (let i = 1; i < NUM_SEED_USERS; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    users.push(
        new User ({
            email: faker.internet.email(firstName, lastName),
            hashedPassword: bcrypt.hashSync(faker.internet.password(), 10),
            firstName: firstName,
            lastName: lastName,
            phoneNumber: Math.floor(1000000000 + Math.random() * 9000000000)
        })
    )
}

// Create tweets
const tweets = [];

for (let i = 0; i < NUM_SEED_TWEETS; i++) {
    tweets.push(
        new Tweet ({
        text: faker.hacker.phrase(),
        author: users[Math.floor(Math.random() * NUM_SEED_USERS)]._id
        })
    )
}

// Create trips
const trips = [];

for (let i = 0; i < NUM_SEED_TRIPS; i++) {
    const randomDriver = users[Math.floor(Math.random() * NUM_SEED_USERS)]._id;
    const randomPassengers = [];

    // Choose two random passengers and generate two dropoff points from the users array
    for (let j = 0; j < 2; j++) {
        const randomPassenger = users[Math.floor(Math.random() * NUM_SEED_USERS)]._id;
        const dropoffPoint = faker.address.city(); 

        const passengerInfo = {
            passenger: randomPassenger,
            dropoffPoint: dropoffPoint,
        };

        randomPassengers.push(passengerInfo);
    }
    trips.push(
        new Trip ({
            driver: randomDriver,
            passengers: randomPassengers,
            departureTime: faker.date.future(),
            startPoint: faker.address.city(), 
            endPoint: faker.address.city(), 
            availableSeats: Math.floor(Math.random() * 6) + 1
        })
    )
}

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
                    .then(() => Tweet.collection.drop())
                    .then(() => User.insertMany(users))
                    .then(() => Tweet.insertMany(tweets))
                    .then(() => Trip.insertMany(trips))
                    .then(() => {
                        // console.log("Done!");
                        mongoose.disconnect();
                    })
                    .catch(err => {
                        console.error(err.stack);
                        process.exit(1);
                    });
}
