const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Trip = mongoose.model('Trip');
const Review = mongoose.model('Review');
const passport = require('passport');
const { loginUser, restoreUser, requireUser } = require('../../config/passport');
const { isProduction } = require('../../config/keys');
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');
const validateUserInput = require('../../validations/user');
const Car = mongoose.model('Car')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({
    message: "GET /api/users"
  });
});

router.get('/current', restoreUser, async (req, res) => {
  try{
    if (!isProduction) {
      // In development, allow React server to gain access to the CSRF token
      // whenever the current user information is first loaded into the
      // React application
      const csrfToken = req.csrfToken();
      res.cookie("CSRF-TOKEN", csrfToken);
    }
    if (!req.user) return res.json(null);
    res.json({
      _id: req.user._id,
      username: req.user.username,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      phoneNumber: req.user.phoneNumber,
      email: req.user.email,
      biography: req.user.biography,
      address: req.user.address,
      car: req.user.car ? req.user.car : null
    });
  } catch(error) {
    console.error('Error fetching user car:', error);
    res.status(500).send("Internal Server Error");
  }
});

// Retrieve one user
router.get('/:id', async (req, res, next) => {
  let user;
  try {
      user = await User.findById(req.params.id).select("-address");

      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        error.errors = { message: "No user found with that id" };
        return next(error);
      }

      const driverTrips = await Trip.find({driver: user._id})
                              .sort({ createdAt: -1 })
                              .populate("driver", "_id firstName lastName")
                              .populate("car", "make model year licensePlateNumber insurance mpg fueleconomyId" )
                              .populate("passengers.passenger", "_id firstName lastName")
                              .lean();
      const riderTrips = await Trip.find({"passengers.passenger": user._id})
                              .sort({ createdAt: -1 })
                              .populate("driver", "_id firstName lastName")
                              .populate("car", "make model year licensePlateNumber insurance mpg fueleconomyId" )
                              .populate("passengers.passenger", "_id firstName lastName")
                              .lean();
      const reviewer = await Review.find({reviewer: user._id})
                              .sort({ createdAt: -1 })
                              .populate("reviewee", "_id firstName lastName")
                              .populate("trip", "origin destination")
                              .lean();
      const reviewee = await Review.find({reviewee: user._id})
                              .sort({ createdAt: -1 })
                              .populate("reviewer", "_id firstName lastName")
                              .populate("trip", "origin destination")
                              .lean()
      let ratingTotal = 0;
      let avgRating = 0;
      if (reviewee.length > 0) {
        for (const review of reviewee) {
          ratingTotal += review.rating
        }
        avgRating = ratingTotal / reviewee.length
      }

      return res.json({
        user, 
        driverTrips: driverTrips || [],
        riderTrips: riderTrips || [],
        reviewer: reviewer || [],
        reviewee: reviewee || [],
        avgRating,
      })
  } catch(err) {
    return res.json({});
  }
})

router.post('/register', validateRegisterInput, async (req, res, next) => {
  // Check to make sure no one has already registered with the proposed email or
  // phoneNumber.
  const user = await User.findOne({
    $or: [
      { email: req.body.email },
      { phoneNumber: req.body.phoneNumber }
    ]
  });

  if (user) {
    // Throw a 400 error if the email address or phone number already exists
    const err = new Error("Validation Error");
    err.statusCode = 400;
    const errors = {};
    if (user.email === req.body.email) {
      errors.email = "A user has already registered with this email";
    }
    if (user.phoneNumber === req.body.phoneNumber) {
      errors.phoneNumber = "A user has already registered with this phone number";
    }
    err.errors = errors;
    return next(err);
  }

    // Otherwise create a new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    });

    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(req.body.password, salt, async (err, hashedPassword) => {
        if (err) throw err;
        try {
          newUser.hashedPassword = hashedPassword;
          const user = await newUser.save();
          return res.json(await loginUser(user));
        }
        catch(err) {
          next(err);
        }
      })
    });
});

// POST /api/users/login
router.post('/login', validateLoginInput, async (req, res, next) => {
  passport.authenticate('local', async function(err, user) {
    if (err) return next(err);
    if (!user) {
      const err = new Error('Invalid credentials');
      err.statusCode = 400;
      err.errors = { email: "Invalid credentials" };
      return next(err);
    }
    return res.json(await loginUser(user));
  })(req, res, next);
});

router.patch('/:id', requireUser, validateUserInput, async (req, res, next) => {
  try {
    const userExist = await User.findById(req.params.id)
    if (!userExist) {
      const error = new Error("User not found");
      error.status = 404;
      error.errors = { message: "No user found with that id" };
      return next(error);
    }
    const { user, body } = req;

    // Check if the user is the user of this page
    if (req.params.id.toString() !== user._id.toString()) {
        const error = new Error("Unauthorized: You are not the user of this page");
        error.status = 403;
        error.errors = { message: "You are not the user of this page" }
        return next(error);
    }


    const { 
      phoneNumber,
      biography, 
      profilePicture, 
      trips, 
      rides, 
      car, 
      driverLicense, 
      address 
    } = body;
    

    // Update user properties
    user.phoneNumber = phoneNumber;
    user.biography = biography;
    user.profilePicture = profilePicture;
    user.trips = trips;
    user.rides = rides;
    user.car = car;
    user.driverLicense = driverLicense;
    user.address = address;

    // Save the updated user data
    const updatedUser = await user.save();

    res.json(updatedUser);
  }
  catch(err) {
    next(err);
  }
})

router.delete('/:id', requireUser, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    console.log(user)
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      error.errors = { message: "No user found with that id" };
      return next(error);
    }

    // Check if the user is the user of this page
    if (req.params.id.toString() !== req.user._id.toString()) {
        const error = new Error("Unauthorized: You are not the user of this page");
        error.status = 403;
        error.errors = { message: "You are not the user of this page" }
        return next(error);
    }

    // Move user trips, reviews, car
    // const deletedUser = await User.find({firstName: "[deleted]"})
    // for (const trip of user.trips) {
    //   trip.driver = deletedUser._id;
    //   await trip.save();
    // }
    // for (const trip of user.review) {
    //   trip.driver = deletedUser._id;
    //   awai

    // Remove the user from the database
    await user.remove();
    res.json({ message: 'User deleted successfully' });
  }
  catch(err) {
    next(err);
  }
})

module.exports = router;