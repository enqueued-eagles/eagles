/*
Run server to persist data
routers in separate files
*/
require('dotenv').config();
const express = require('express');
const database = require('./db/database.js');
const path = require('path');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const session = require('express-session');
const compression = require('compression');

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
  secret: process.env.SESSION_SECRET,
  cookie: { 
    maxAge: 6000000,
    secure: false,
    httpOnly: false
  }
}))

// compress outgoing files
app.use(compression());

// Add passport middleware to initialize req.user object
app.use(passport.initialize());
app.use(passport.session());

// public file with static routes
app.use(express.static(path.join(__dirname,'../frontend/public')));

// -------------------OAUTH------------------------- //
app.get('/login/google', oauthRoutes.login);

app.get('/login/google/return', oauthRoutes.return, oauthRoutes.resolve);

app.get('/testing', function(req, res) {
  console.log('req.user', req.user);
  res.send(JSON.stringify(req.user))
});

// -------------------GCLASS------------------------- //
app.post('/gclass/coursework', gclassRoutes.addCourseWork);
app.get('/gclass/coursework/student', (req, res) => gclassRoutes.getCourseWorkStudent(req, res, false));
app.get('/gclass/coursework/teacher', (req, res) => gclassRoutes.getCourseWorkTeacher(req, res, true));
app.get('/gclass/submissions/:lessonId', gclassRoutes.getSubmissionsAsStudent);
app.post('/gclass/submissions/:lessonId', gclassRoutes.submitAssignment);

// -------------------AUTH------------------------- //
app.get('/api/checklogin', checkAuth.checkLogin);
app.get('/api/logout', checkAuth.logout);
app.post('/api/user', function(req, res) {checkAuth.createAccount(req, res, false)});
app.post('/api/login', checkAuth.attemptLoggin);
app.use(checkAuth.checkUser);

// ------------------------------------------------ //

// handle protected routes
app.all('/api/slides', slideRoutes);
app.all('/api/slides/*', slideRoutes);
app.all('/api/user', userRoutes);
app.all('/api/user/*', userRoutes);
app.all('/api/lessons', lessonRoutes);
app.all('/api/lessons/*', lessonRoutes);
app.all('/api/lesson', lessonRoutes);
app.all('/api/lesson/*', lessonRoutes);
app.all('/api/query', utilRoutes);

// redirect any uncaught routes 
app.use((req, res) => {
  console.log('session is NOT destroyed')

  res.sendFile(path.join(__dirname, './../frontend/public/index.html'));
});

// server listens for requests
let port = process.env.PORT;

app.listen(port, () => {
  console.log(`<('.'<) Server's up on port ${port}`)
});