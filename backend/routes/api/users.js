const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const { loginUser, restoreUser, requireUser } = require('../../config/passport');
const { isProduction } = require('../../config/keys');
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');
const validateUserInput = require('../../validations/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({
    message: "GET /api/users"
  });
});

router.get('/current', restoreUser, (req, res) => {
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
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    biography: req.user.biography,
    address: req.user.address
  });
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
      return res.json(user)
  } catch(err) {
    return res.json([]);
  }
})

router.post('/register', validateRegisterInput, async (req, res, next) => {
  // Check to make sure no one has already registered with the proposed email or
  // username.
  const user = await User.findOne({
    $or: [
      { email: req.body.email }
      // { phoneNumber: req.body.phoneNumber }
    ]
  });

  if (user) {
    // Throw a 400 error if the email address, username, or phone number already exists
    const err = new Error("Validation Error");
    err.statusCode = 400;
    const errors = {};
    if (user.email === req.body.email) {
      errors.email = "A user has already registered with this email";
    }
    // if (user.phoneNumber === req.body.phoneNumber) {
    //   errors.phoneNumber = "A user has already registered with this phone number";
    // }
    err.errors = errors;
    return next(err);
  }

    // Otherwise create a new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      // phoneNumber: req.body.phoneNumber,
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

// router.get('/current', restoreUser, (req, res) => {
//   if (!isProduction) {
//     // In development, allow React server to gain access to the CSRF token
//     // whenever the current user information is first loaded into the
//     // React application
//     const csrfToken = req.csrfToken();
//     res.cookie("CSRF-TOKEN", csrfToken);
//   }
//   if (!req.user) return res.json(null);
//   res.json({
//     _id: req.user._id,
//     username: req.user.username,
//     email: req.user.email,
//     firstName: req.user.firstName,
//     lastName: req.user.lastName,
//     biography: req.user.biography,
//     address: req.user.address
//   });
// });

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


    const { biography, profilePicture, trips, rides, car, driverLicense, address } = body;
    

    // Update user properties
    // user.phoneNumber = phoneNumber;
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

module.exports = router;