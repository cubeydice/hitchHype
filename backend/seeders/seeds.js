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

const californiaAddresses = {
    "1 Main St, Los Angeles, CA 90001": 'https://lh3.googleusercontent.com/places/ANXAkqFy9MUKCyd8HKu-PQzBja6a4-pmbstzTjD4pufZ9F96D9m_sZXgdiP9Kx22WZg2eQuFWIsGfc9qybTEh5Kqg84FHRWJ8Dpca2s=s1600-w4000',     
    "368 Elm St, San Francisco, CA 94102": 'https://lh3.googleusercontent.com/places/ANXAkqGaGSRp36MJ8BAh5h7Uly8rzAK5IZjfxP81HwLeQIYg10_iR2vtU4-XsGEbtNfMwAxLyqb-FOhsYLbYniZ5zZxSBH8VSRMRoI8=s1600-h420',
    "7251 Big Oak St, San Diego, CA 92114": 'https://lh3.googleusercontent.com/places/ANXAkqGpuICGVC60hXql2RLmnw1-s-QmfTUixirgg88tR68Ovg1B-JQIHEXmFFQBdjyt0xNMDTtYie5-bqpX6e3fsYybXe3EbK9DeB4=s1600-h420',
    "1609 16th St, Sacramento, CA 95814": 'https://lh3.googleusercontent.com/places/ANXAkqEV5zQLc1syz7cA24U9IoYsAZwGkW3hdTpQStYnrRgWYzuXhvx2F3Bn5T3gTbshQ1qXPcOcx7pPrfvh9l9xxz-r5d3_P6yG5_4=s1600-w3628',
    "595 Cedro St, San Jose, CA 95111": 'https://lh3.googleusercontent.com/places/ANXAkqGr9aqUh7xAwblbO8ctKFm29UZKYOZgYL8nnuLBlGubg1ztDjhg3A2MmUFUZ_xE23aoJCP6LWAn6_eZJVQBfqFXfOH3JmS-IIg=s1600-w800',
    "3275 Maple Ave, Oakland, CA 94602": 'https://lh3.googleusercontent.com/places/ANXAkqHYc2YFJMtxjk3O0zBzUvvhZq1ytl0gSmNNmsPX96Oj5P-sYCrDPIrQhr3yIhpd1Ekx6xaHo5JzGkX71Wn--DaRyKigmfUeECM=s1600-w2448',
    "5752 Redwood St, San Diego, CA 92105": 'https://lh3.googleusercontent.com/places/ANXAkqECmb1rtLW0bMfeWFN39xwhm8KVji4YLc-RJvf5V-iSY446I4VlQMEwFDD8gRrwgdFGEAtyYAtYmf7dWvT4AJodEZPxVGTT8g=s1600-w711',
    "555 W Cypress St, Anaheim, CA 92805": 'https://lh3.googleusercontent.com/places/ANXAkqG6wkr_4POtlDMnOjX9mHGt7NT1Da_9Q4imv61EWpQ3_L1p0DqriCMAKiGgx5t1W2JXNQP3qwLp-VipClfajwf9-RX3TKt7wi0=s1600-w1824',
    "5447 N Sequoia Ave, Fresno, CA 93711": 'https://lh3.googleusercontent.com/places/ANXAkqFEuMCULBn8XFMVHZ1EHu7r30T3JG7QI4yDfhfzdpjXTHUpOc32fry-4wurEt7SHVkOS3kCCDF49XLKuNWGn6ijlWA5P5PH6AU=s1600-w720',
    "5943 Birch St, Riverside, CA 92506": 'https://lh3.googleusercontent.com/places/ANXAkqE04aOSpEDa7nDWaufXQQ3G2Vvi4Gn5673fRAwdoHKdd1KUcUrR-NFLifkBHFhYtul5YQWn2EdRQ0t3istkfiA78-xisP3KgVw=s1600-w2048',
    "888 S Spruce St, Santa Ana, CA 92704": 'https://lh3.googleusercontent.com/places/ANXAkqGU9nIww-JKorqGnl9cmpmx-0Maqs8sLOE8pkAVQBxVHl6hyCXX6PKZ5kOicIl1eO4hPPhmc7DbW9Qv32S4J7Dvb652F7urlEY=s1600-w1440',
    "999 Willow Dr, Bakersfield, CA 93308": 'https://lh3.googleusercontent.com/places/ANXAkqFtfTS7ms7GhPFNR1-rQn5YFjVqvhwmSBOMi5FIitqn9AzBwq8-AssJ_83Qay_MPlXe4gHy7abmwS6J3P1-7du6n3_8sp5f5fg=s1600-w4160',
    "3 W Essex St, Stockton, CA 95204": 'https://lh3.googleusercontent.com/places/ANXAkqGusfA5OlV7Z1XjO4ryS_fLCw1PBqygxDKWJiNTs0tbdxSQ-lnHGiG1zo-YAC83mhHwzm1WSmXa2YWT7WhQ9t7K_cyyTg5IMio=s1600-w4032',
    "3822 Magnolia St, Irvine, CA 92606": 'https://lh3.googleusercontent.com/places/ANXAkqFUQi-IyqF-0L8pRljHgBIe6VBty-NzM_k_KGjPn5hJtfDyDGaHeHp0stSSUBL5D13mGDLWqHf3d-mwxFgOrNIWEVzNvGEZ2W0=s1600-w4032',
    "333 S Juniper St, Escondido, CA 92025": 'https://lh3.googleusercontent.com/places/ANXAkqEA0zxi7CLZYoD4lA_kRgg-Je2B31KG3l1ky7eSm5KOfQqu1iUzS7_bJrighUCJy8BSs6CMg8EzPA4Y5j1vavnrtLJ0JzqHJSs=s1600-w3471',
    "444 W Milford St, Glendale, CA 91203": 'https://lh3.googleusercontent.com/places/ANXAkqHfL3aaLA07ifoe03w4gsXj3QTVVwuSkSqeWa9iN03dQgNEjGQs7GH7ojxFe7hfJKTRogWf83VVye7X0IExctb6qEt9z-pcp5M=s1600-w4032',
    "16352 Redlands Ln, Huntington Beach, CA 92647": 'https://lh3.googleusercontent.com/places/ANXAkqEhbMahizrnFZY24q8yB4dk6yNUatQXA1wS1n55G7_ETSZQNAsVDdMKjKkXcdrC86brbLvaVjdYNLQ8CuK4VrmyrpWBRfR1IJg=s1600-w3312',
    "5324 Ontario St, Oceanside, CA 92056": 'https://lh3.googleusercontent.com/places/ANXAkqFTQAjBgf2mDEmw6b_n0rj8f8FMoO_aWo-mEya0j4lljCLO157PeifX8Y5RXHedPpdgOzFMHHgaGLGsfTI5DuhJAbfLjKCcdvI=s1600-w4032',
    "777 Piezzi Rd, Santa Rosa, CA 95401": 'https://lh3.googleusercontent.com/places/ANXAkqEQYMHircTu3C4NIUcFOSCO6iWi3hFWJL1uAW_GQcoTzfLwgYN-MdgT2Wgjm7qBRSTl4yDSkHZjiy7WbgKEK5wyG4qgIZHQOjw=s1600-w1200',
    "24425 Eucalyptus Ave, Moreno Valley, CA 92553": 'https://lh3.googleusercontent.com/places/ANXAkqHsV1Ffjwf3VBMC76GuNweUL8gOruZys6pHUqLxkiHgted8ECzZ4RFaFV7PSTRIgOPHYwqV5bgTcxINIMnEDOGvBidFlx-kA-k=s1600-w5714'
};

// Create users
const users = [];

const demoRider = new User ({
    email: 'demo-user@appacademy.io',
    hashedPassword: bcrypt.hashSync('starwars', 10),
    firstName: 'Itsuki ',
    lastName: 'Takeuchi',
    phoneNumber: '1234567890',
    biography: faker.lorem.sentences(5),
    address: Object.keys(californiaAddresses)[Math.floor(Math.random() *  Object.keys(californiaAddresses).length)],
    profilePicture: 'https://i.imgur.com/TNLIG9U.png'
})

users.push(demoRider)
// Used to add demo rider to trips
const demoInfo = {
    passenger: demoRider._id,
    dropoffPoint: Object.keys(californiaAddresses)[Math.floor(Math.random() *  Object.keys(californiaAddresses).length)]
}

const hondaCivic = {
    "1984": "29",
    "1985": "28",
    "1986": "27",
    "1987": "27",
    "1988": "30",
    "1989": "26",
    "1990": "26",
    "1991": "26",
    "1992": "28",
    "1993": "28",
    "1994": "28",
    "1995": "28",
    "1996": "31",
    "1997": "30",
    "1998": "28",
    "1999": "27",
    "2000": "25",
    "2001": "30",
    "2002": "25",
    "2003": "25",
    "2004": "25",
    "2005": "25",
    "2006": "23",
    "2007": "23",
    "2008": "24",
    "2009": "24",
    "2010": "24",
    "2011": "24",
    "2012": "25",
    "2013": "31",
    "2014": "31",
    "2015": "25"
    }

// Create cars
const cars = [];
const sampleInsuranceCompanies = [
    "Company A",
    "Company B",
    "Company C",
    // Add more company names here
];

for (let i = 1; i < NUM_SEED_USERS; i++) {
    const randomImage = images[Math.floor(Math.random() * images.length)]
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()

    const user = new User ({
        email: faker.internet.email(firstName, lastName),
        hashedPassword: bcrypt.hashSync(faker.internet.password(), 10),
        firstName: firstName,
        lastName: lastName,
        phoneNumber: Math.floor(1000000000 + Math.random() * 9000000000),
        biography: faker.lorem.sentences(5),
        address: Object.keys(californiaAddresses)[Math.floor(Math.random() *  Object.keys(californiaAddresses).length)],
        profilePicture: randomImage
    })

    const car = new Car ({
        owner: user._id,
        // make: faker.vehicle.manufacturer(),
        // model: faker.vehicle.model(),
        make: "Honda",
        model: "Civic",
        // year: faker.datatype.number({ min: 2000, max: 2022 }),
        year: Object.keys(hondaCivic)[i],
        licensePlateNumber: faker.random.alphaNumeric(7).toUpperCase(),
        insurance: sampleInsuranceCompanies[Math.floor(Math.random() * sampleInsuranceCompanies.length)],
        // mpg: faker.datatype.number({ min: 10, max: 50 }),
        mpg: Object.values(hondaCivic)[i],
        fueleconomyId: faker.datatype.number({ min: 1000, max: 9999 }),
    })
    cars.push(car)
    user.car = car._id
    users.push(user)
}


// for (let i = 0; i < NUM_SEED_CARS; i++) {
//     const randomOwner = users[Math.floor(Math.random() * NUM_SEED_USERS)]._id;
//     cars.push(
//         new Car ({
//             owner: randomOwner,
//             make: faker.vehicle.manufacturer(),
//             model: faker.vehicle.model(),
//             year: faker.datatype.number({ min: 2000, max: 2022 }),
//             licensePlateNumber: faker.random.alphaNumeric(7).toUpperCase(),
//             insurance: sampleInsuranceCompanies[Math.floor(Math.random() * sampleInsuranceCompanies.length)],
//             mpg: faker.datatype.number({ min: 10, max: 50 }),
//             fueleconomyId: faker.datatype.number({ min: 1000, max: 9999 }),
//         })
//     )
// }

// Create trips
const trips = [];

for (let i = 0; i < NUM_SEED_TRIPS; i++) {
    const usersDup = users.slice(1, users.length);
    const randomUser = usersDup[Math.floor(Math.random() * usersDup.length)]
    const randomDriver = randomUser._id;
    const randomCarId = randomUser.car
    const randomPassengers = []
    const randomBoolean = Math.random() < 0.3;
    const randomBoolean2 = Math.random() < 0.3;

    // Choose two random passengers and generate two dropoff points from the users array
    for (let j = 0; j < 2; j++) {
        // const randomPassenger = users[Math.floor(Math.random() * NUM_SEED_USERS)]._id
        // Generate unique passenger for the trip
        function randomPassenger() {
            while (true) {
                let passengerId = users[Math.floor(Math.random() * NUM_SEED_USERS)]._id
                if (passengerId !== randomDriver || !randomPassengers.includes(passengerId)) {
                    return passengerId
                }
            }
        }

        const passengerInfo = {
            passenger: randomPassenger(),
            dropoffPoint: Object.keys(californiaAddresses)[Math.floor(Math.random() *  Object.keys(californiaAddresses).length)]
        };

        randomPassengers.push(passengerInfo);
    }
    if (randomBoolean) randomPassengers.push(demoInfo);
    const date = randomBoolean ? randomBoolean2 ? faker.date.future() : faker.date.past() : faker.date.future()

    const destinationIndex = Math.floor(Math.random() *  Object.keys(californiaAddresses).length)
    trips.push(
        new Trip ({
            driver: randomDriver,
            car: randomCarId,
            passengers: randomPassengers,
            departureDate: date,
            origin: Object.keys(californiaAddresses)[Math.floor(Math.random() *  Object.keys(californiaAddresses).length)],
            destination: Object.keys(californiaAddresses)[destinationIndex],
            photoUrl: Object.values(californiaAddresses)[destinationIndex],
            availableSeats: Math.min(Math.max(Math.floor(Math.random() * 6) + 1, 3), 5)
        })
    )
}


// Create demo driver, needs trips and cars to be initialized beforehand
let driverTrips = []

const demoDriver = new User ({
        email: 'demo-user2@appacademy.io',
        hashedPassword: bcrypt.hashSync('starwars', 10),
        firstName: 'Speed',
        lastName: 'Racer',
        phoneNumber: '2345678901',
        biography: faker.lorem.sentences(5),
        trips: driverTrips,
        car: null,
        address: Object.keys(californiaAddresses)[Math.floor(Math.random() *  Object.keys(californiaAddresses).length)],
        profilePicture: 'https://i.imgur.com/wNLNSwk.jpg'
});

const driverCar = new Car ({
    owner: demoDriver._id,
    // make: faker.vehicle.manufacturer(),
    // model: faker.vehicle.model(),
    make: "Honda",
    model: "Civic",
    year: "2015",
    mpg: "25",
    // year: faker.datatype.number({ min: 2000, max: 2022 }),
    licensePlateNumber: faker.random.alphaNumeric(7).toUpperCase(),
    insurance: sampleInsuranceCompanies[Math.floor(Math.random() * sampleInsuranceCompanies.length)],
    // mpg: faker.datatype.number({ min: 10, max: 50 }),
    fueleconomyId: faker.datatype.number({ min: 1000, max: 9999 }),
})

demoDriver.car = driverCar._id
cars.push(driverCar)


// Create demo drivers trips
for (let i = 0; i < 3; i++) {
    const randomPassengers = []

    // Choose two random passengers and generate two dropoff points from the users array
    for (let j = 0; j < 2; j++) {
        // const randomPassenger = users[Math.floor(Math.random() * NUM_SEED_USERS)]._id
        // Generate unique passenger for the trip
        function randomPassenger() {
            while (true) {
                let passengerId = users[Math.floor(Math.random() * NUM_SEED_USERS)]._id
                if (passengerId !== randomDriver || !randomPassengers.includes(passengerId)) {
                    return passengerId
                }
            }
        }

        const passengerInfo = {
            passenger: randomPassenger(),
            dropoffPoint: Object.keys(californiaAddresses)[Math.floor(Math.random() *  Object.keys(californiaAddresses).length)]
        };

        randomPassengers.push(passengerInfo);
    }
    // Add demo rider to passengers
    randomPassengers.push(demoInfo);

    const randomBoolean = Math.random() < 0.5;
    const date = randomBoolean ? faker.date.future() : faker.date.past()

    const destinationIndex = Math.floor(Math.random() *  Object.keys(californiaAddresses).length)
    const trip = new Trip ({
        driver: demoDriver._id,
        car: demoDriver.car,
        passengers: randomPassengers,
        departureDate: date,
        origin: Object.keys(californiaAddresses)[Math.floor(Math.random() *  Object.keys(californiaAddresses).length)],
        destination: Object.keys(californiaAddresses)[destinationIndex],
        photoUrl: Object.values(californiaAddresses)[destinationIndex],
        availableSeats: Math.min(Math.max(Math.floor(Math.random() * 6) + 1, 3), 5)
    })
    demoDriver.trips.push(trip)
    trips.push(trip)
}
users.push(demoDriver);

// Create trip where demo driver is a passenger
const randomUser = users[Math.floor(Math.random() * users.length)]
const destinationIndex = Math.floor(Math.random() *  Object.keys(californiaAddresses).length)
trips.push(
    new Trip ({
        driver: randomUser._id,
        car: randomUser.car,
        passengers: [
            {
                passenger: demoDriver._id,
                dropoffPoint: Object.keys(californiaAddresses)[Math.floor(Math.random() *  Object.keys(californiaAddresses).length)]
            },
            {
                passenger: users[Math.floor(Math.random() * users.length)]._id,
                dropoffPoint: Object.keys(californiaAddresses)[Math.floor(Math.random() *  Object.keys(californiaAddresses).length)]
            }
        ],
        departureDate: faker.date.past(),
        origin: Object.keys(californiaAddresses)[Math.floor(Math.random() *  Object.keys(californiaAddresses).length)],
        destination: Object.keys(californiaAddresses)[destinationIndex],
        photoUrl: Object.values(californiaAddresses)[destinationIndex],
        availableSeats: Math.min(Math.max(Math.floor(Math.random() * 6) + 1, 3), 5)
    })
)

users.push(
    new User({
        email: 'deleteduser@example.com',
        hashedPassword: bcrypt.hashSync('deleted', 10),
        firstName: '[deleted]',
        firstName: '[deleted]',
        lastName: 'user',
        phoneNumber: '9999999999',
        trips: [],
        reviews: [],
        car: null // cannot be an array as it will conflict with schema car type
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
                        mongoose.disconnect();
                    })
                    .catch(err => {
                        console.error(err.stack);
                        process.exit(1);
                    });
}
