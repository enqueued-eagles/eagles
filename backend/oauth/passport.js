const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const gclass = require('./../gclass/gclass');

const host = process.env.HOST || '127.0.0.1';

const port = process.env.PORT || 3000;

const scope = [
  'https://www.googleapis.com/auth/classroom.courses',
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.students',
  'profile'
];

const callbackURL = `http://${host}:${port}/login/google/return`

console.log('hey',process.env.CLIENT_ID)

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: callbackURL,   
    scope: scope
  },

  function(accessToken, refreshToken, profile, done) {
    console.log('oauth arguments', arguments);

    profile.access = accessToken;

    gclass.getCourses(profile)
    .then((results) => {
      console.log('classes gotten', results.data.courses)
      profile.courses = results.data.courses;
      return done(null, profile);
    })
    .catch((err) => {
      console.log('error in getting classes:', err)
      return done(err, null);
    });
  })
);

passport.serializeUser(function(user, cb) {
  console.log('serializing user')
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  console.log('deserializing user')
  cb(null, obj);
});

module.exports = passport;