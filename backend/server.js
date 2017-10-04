/*
Run server to persist data
routers in separate files
*/
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

// public file with static routes
app.use(express.static(path.join(__dirname,'../frontend/public')));

// -------------------AUTH------------------------- //
app.get('/logout', checkAuth.logout);
app.post('/user', checkAuth.createAccount);
app.post('/login', checkAuth.attemptLoggin);
app.use(checkAuth.checkUser);
// ------------------------------------------------ //

// handle protected routes
app.all('/slides', slideRoutes);
app.all('/slides/*', slideRoutes);
app.all('/user', userRoutes);
app.all('/user/*', userRoutes);
app.all('/lessons', lessonRoutes);
app.all('/lessons/*', lessonRoutes);
app.all('/lesson', lessonRoutes);
app.all('/lesson/*', lessonRoutes);
app.all('/query', utilRoutes);

// redirect any uncaught routes 
app.use((req, res) => {
  console.log('yo the stupid app.use is triggering EVERYWHERE')
  res.redirect('/');
});

// server listens for requests
let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`<('.'<) Server's up on port ${port}`)
});
