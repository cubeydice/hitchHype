const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
const { secretOrKey } = require('./keys');
const Car = mongoose.model('Car')


passport.use(new LocalStrategy({
    session: false,
    usernameField: 'email',
    passwordField: 'password',
}, async function (email, password, done) {
    const user = await User.findOne({ email });
    if (user) {
        bcrypt.compare(password, user.hashedPassword, (err, isMatch) => {
            if (err || !isMatch) done(null, false);
            else done(null, user);
        });
    } else
        done(null, false);
}));

exports.loginUser = async function(user) {
    try {
        const userCar = await Car.findById(user.car)
        const userInfo = {
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            email: user.email,
            biography: user.biography,
            address: user.address,
            car: user.car ? user.car : null,
            maxPassengers: userCar ? userCar.maxPassengers : null
        };
    
        const token = await jwt.sign(
            userInfo, // payload
            secretOrKey, // sign with secret key
            { expiresIn: 3600 } // tell the key to expire in one hour
        );
        return {
            user: userInfo,
            token
        };
    } catch (error) {
        console.error('Error during user login:', error);
        throw error;  
    }
};

// JwtStrategy is a Passport extension that will allow your application to use
// JWT as an authentication method after initial log in/sign up
const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = secretOrKey;

passport.use(new JwtStrategy(options, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload._id)
        if (user) {
        // return the user to the frontend
        return done(null, user);
        }
        // return false since there is no user
        return done(null, false);
    }
    catch(err) {
        done(err);
    }
}));

// requireUser is an Express middleware that will not allow a route handler to
// perform its action unless there is a current user logged in (will attach
// current user as req.user, or return an error response if there is no current
// user)
exports.requireUser = passport.authenticate('jwt', { session: false });

// restoreUser is an Express middleware that will load the current user
// on req.user, but will NOT return an error response if there is no current
// user
exports.restoreUser = (req, res, next) => {
    return passport.authenticate('jwt', { session: false }, function(err, user) {
        if (err) return next(err);
        if (user) req.user = user;
        next();
    })(req, res, next);
};