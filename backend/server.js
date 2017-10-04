/*
Run server to persist data
routers in separate files
*/
const dotenv = require('dotenv').config();
const express = require('express');
const database = require('./db/database.js');
const path = require('path');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const session = require('express-session');

// create express instance
const app = express();

// route handlers
const userRoutes = require('./routes/userRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const slideRoutes = require('./routes/slideRoutes');
const utilRoutes = require('./routes/utilRoutes');
const checkAuth = require('./checkAuth');

// Google Authentication 
const passport = require('./oauth/passport');
const oauthRoutes = require('./oauth/routes');

// Google Classroom
const gclassRoutes = require('./gclass/routes.js');

// morgan for logging and body parser to parse requests
app.use(morgan('tiny'));
app.use(bodyparser.json());

// set cookie for auth
app.use(session({
  secret: 'super secret',
  cookie: { 
    maxAge: 6000000,
    secure: false,
    httpOnly: false
  }
}))

// Add passport middleware to initialize req.user object
app.use(passport.initialize());
app.use(passport.session());

// public file with static routes
const staticRoute = path.join(__dirname, '../frontend/public')

app.use(express.static(staticRoute));

// -------------------OAUTH------------------------- //
app.get('/login/google', oauthRoutes.login);

app.get('/login/google/return', oauthRoutes.return, oauthRoutes.resolve);

app.get('/testing', function(req, res) {
  console.log('req.user', req.user);
  res.send(JSON.stringify(req.user))
});

// -------------------GCLASS------------------------- //
app.post('/gclass/coursework', gclassRoutes.addCourseWork);

// -------------------AUTH------------------------- //
app.get('/logout', checkAuth.logout);
app.post('/users', checkAuth.createAccount);
app.post('/login', checkAuth.attemptLoggin);
app.use(checkAuth.checkUser);

// ------------------------------------------------ //

// handle protected routes
app.all('/slides', slideRoutes);
app.all('/slides/*', slideRoutes);
app.all('/users', userRoutes);
app.all('/users/*', userRoutes);
app.all('/lessons', lessonRoutes);
app.all('/lessons/*', lessonRoutes);
app.all('/lesson', lessonRoutes);
app.all('/lesson/*', lessonRoutes);
app.all('/query', utilRoutes);

// redirect any uncaught routes 
app.use((req, res) => {
  res.redirect('/');
});

// server listens for requests
app.listen(process.env.PORT || 3000);