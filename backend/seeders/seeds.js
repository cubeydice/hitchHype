const mongoose = require("mongoose");
const { mongoURI: db } = require('../config/keys.js');
const User = require('../models/User');
const Trip = require('../models/Trip');
const Car = require('../models/Car');
const Review = require('../models/Review');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const NUM_SEED_USERS = 10;
const NUM_SEED_TRIPS = 10;
const NUM_SEED_CARS = 10;


const images = [
    "https://i.imgur.com/IQ1jIms.jpg",
    "https://i.imgur.com/Vvloh4k.jpg",
    "https://i.imgur.com/wqrZnL0.jpg",
    "https://i.imgur.com/Iyf3OjN.jpg",
    "https://i.imgur.com/cbF3pdG.jpg",
    "https://i.imgur.com/byhJpky.jpg",
    "https://i.imgur.com/QeLYhPo.jpg",
    "https://i.imgur.com/Zi33294.jpg",
    "https://i.imgur.com/1ATg0SM.png",
    "https://i.imgur.com/PJase7X.jpg",
    "https://i.imgur.com/wwj1ABD.jpg",
    "https://i.imgur.com/zrAWDKG.jpg"
]

// Create users
const users = [];

const demoRider = new User ({
    email: 'demo-user@appacademy.io',
    hashedPassword: bcrypt.hashSync('starwars', 10),
    firstName: 'demo',
    lastName: 'rider',
    phoneNumber: '1234567890',
    biography: faker.lorem.sentences(5),
    address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.state()} ${faker.address.zipCode()}`,
    profilePicture: 'https://i.imgur.com/3EES7Zo.jpg'
})

users.push(demoRider)
// Used to add demo rider to trips
const demoInfo = {
    passenger: demoRider._id,
    dropoffPoint: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.state()} ${faker.address.zipCode()}`
}

for (let i = 1; i < NUM_SEED_USERS; i++) {
    const randomImage = images[Math.floor(Math.random() * images.length)]
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    users.push(
        new User ({
            email: faker.internet.email(firstName, lastName),
            hashedPassword: bcrypt.hashSync(faker.internet.password(), 10),
            firstName: firstName,
            lastName: lastName,
            phoneNumber: Math.floor(1000000000 + Math.random() * 9000000000),
            address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.state()} ${faker.address.zipCode()}`,
            profilePicture: randomImage
        })
    )
}

// Create cars
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
            availableSeats: Math.min(Math.max(Math.floor(Math.random() * 6) + 1, 3), 5)
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
        phoneNumber: '2345678901',
        biography: faker.lorem.sentences(5),
        trips: driverTrips,
        car: driverCar,
        address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.state()} ${faker.address.zipCode()}`,
        profilePicture: 'https://i.imgur.com/XQYR7uu.jpg'
});


// Create demo drivers trips
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
        availableSeats: Math.min(Math.max(Math.floor(Math.random() * 6) + 1, 3), 5)
    })
    demoDriver.trips.push(trip)
    trips.push(trip)
}
users.push(demoDriver);

// Create trip where demo driver is a passenger
trips.push(
    new Trip ({
        driver: users[Math.floor(Math.random() * users.length)]._id,
        car: cars[Math.floor(Math.random() * NUM_SEED_CARS)]._id,
        passengers: [
            {
                passenger: demoDriver._id,
                dropoffPoint: `${faker.address.streetAddress()}, ${faker.address.city()}`
            },
            {
                passenger: users[Math.floor(Math.random() * users.length)]._id,
                dropoffPoint: `${faker.address.streetAddress()}, ${faker.address.city()}`
            }
        ],
        departureDate: faker.date.future(),
        origin: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.state()} ${faker.address.zipCode()}`,
        destination: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.state()} ${faker.address.zipCode()}`,
        availableSeats: Math.min(Math.max(Math.floor(Math.random() * 6) + 1, 3), 5)
    })
)


// Create reviews
// Generate mock review titles and bodies for the driver
const  passengerReviewTitles= [
    "Excellent Driver",
    "Smooth Ride",
    "Great Experience",
    "Highly Recommended",
    "Pleasant Journey",
    "Terrible Driver",
    "Worst Experience",
    "Unpleasant Journey",
    "Late and Reckless",
    "Avoid this Driver"
    // Add more driver review titles here
];

const passengerReviewBodies = [
    "The driver was punctual and professional. I had a great trip with them.",
    "I highly recommend this driver. The ride was comfortable, and I reached my destination on time.",
    "The driver provided a smooth and safe journey. I would ride with them again.",
    "It was an excellent experience. The driver was friendly, and the car was clean.",
    "The driver was terrible. They were late, and the ride was uncomfortable.",
    "This was the worst ride I've ever had. The driver was reckless, and I felt unsafe.",
    "The journey was very unpleasant. I do not recommend this driver.",
    "The driver was late and drove recklessly. It was a stressful experience."
    // Add more driver review bodies here
];

// Generate mock review titles and bodies for the passengers
const driverReviewTitles = [
    "Grateful Passenger",
    "Friendly Rider",
    "Five Stars!",
    "Amazing Journey",
    "Best Carpool Ever",
    "Horrible Passenger",
    "Nightmare Ride",
    "Unruly Behavior",
    "Rude and Inconsiderate",
    "Avoid this Passenger",
    "The passenger was horrible. They were rude and made the ride uncomfortable.",
    "This was a nightmare ride. The passenger's behavior was unruly and disruptive.",
    "The passenger exhibited rude and inconsiderate behavior throughout the journey.",
    "It was a terrible experience with this passenger. I would not recommend them."
    // Add more passenger review titles here
];

const driverReviewBodies = [
    "I had a great time as a passenger. The driver was courteous and the ride was enjoyable.",
    "This passenger was friendly and punctual. I would ride with them again.",
    "I gave this ride five stars. It was a fantastic experience.",
    "The journey was amazing, and the driver was very accommodating.",
    // Add more passenger review bodies here
];


const reviews = []

// Iterate through the trips and create reviews
for (const trip of trips) {
    // Get the driver and passengers for the current trip
    const driverId = trip.driver;
    const passengers = trip.passengers;
    
    // Create a review where the driver reviews a passenger
    reviews.push(
        new Review({
            reviewer: driverId,
            reviewee: passengers[0].passenger,
            trip: trip._id, // Use the trip's _id
            isDriver: true, // Since the driver is the reviewer
            rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
            title: driverReviewTitles[Math.floor(Math.random() * driverReviewTitles.length)], 
            body: driverReviewBodies[Math.floor(Math.random() * driverReviewBodies.length)], 
        })
    );
    // Create a review where a passenger reviews the driver
    reviews.push(
        new Review({
            reviewer: passengers[0].passenger,
            reviewee: driverId,
            trip: trip._id, // Use the trip's _id
            isDriver: false, // Since the passenger is the reviewer
            rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
            title: passengerReviewTitles[Math.floor(Math.random() * passengerReviewTitles.length)], 
            body: passengerReviewBodies[Math.floor(Math.random() * passengerReviewBodies.length)], 
        })
    );
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
    User.collection.drop()
                    .then(() => Trip.collection.drop())
                    .then(() => Review.collection.drop())
                    .then(() => Car.collection.drop())
                    .then(() => User.insertMany(users))
                    .then(() => Trip.insertMany(trips))
                    .then(() => Review.insertMany(reviews))
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
