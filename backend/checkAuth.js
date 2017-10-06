const bcrypt = require('bcrypt');
const schema = require('./db/schema.js');
let User = schema.User;

exports.attemptLoggin = (req, res) => {
  console.log('req.user during login', req.user);
  let username = req.body.username || '';
  let password = req.body.password || '';
  // query db for user with password
  User.find({ username: username })
    .then((users) => {
      if(users.length === 0) throw new Error('no Users');
      let user = users[0];
      
      bcrypt.compare(password, user.password, function(err, valid) {
        if (valid) {
          user.password = '';
          req.session.username = username;
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({
            loggedIn: true,
            userData: user
          }));
        } else {
          console.log('failed logging in: ', err);
          res.send({ loggedIn: false });
        }
      });
    })
    .catch((err) => {
      console.log('failed logging in: ', err);
      res.send({ loggedIn: false });
    });
}

exports.logout = (req, res) => {
  console.log('destroying your session');
  console.log('req.session before destroy', req.session)
  req.session.destroy();
  console.log('req.session after destroy', req.session)
  res.redirect('/');
}

exports.createAccount = (req, res, redirect) => {
  console.log('req.user during create account', req.user);
  console.log('req.body', req.body)
  const saltRounds = 2;
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var lessons = req.body.lessons || [];
  var favorites = req.body.favorites || [];
  var googleID = req.body.googleID;
  var avatarURL = req.body.avatarURL;

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      User.create({
        username: username, 
        password: hash,
        lessons: lessons, 
        favorites: favorites, 
        email: email,
        avatarURL: avatarURL,
        googleID: googleID
      })
      .then(function(result) {
        console.log('created the user')
        req.session.username = result.username;
        result.password = '';
        if (redirect) {
          res.redirect('/');
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({
            loggedIn: true,
            userData: result
          }));
        }
      })
      .catch(function(err) {
        console.log('failed to create user', err);
        res.send(err);
      })   
    });
  });
}

exports.checkUser = (req, res, next) => {
  // make sure the person making requests is logged in
  if (!req.session.username) {
    console.log('stopped: ', req.session.username);
    res.redirect('/api/logout');
  } else {
    console.log('sent along: ', req.session.username);
    next();
  }
}

exports.checkLogin = (req, res) => {
  let username = req.session.username;

  res.setHeader('Content-Type', 'application/json');

  if (username) {
    User.findOne({ username: username })
    .then(user => {
      if (user) {
        res.send(JSON.stringify({
          loggedIn: true,
          userData: user
        }));
      } else {
        throw new Error('username is not found in db! this should never occur. highly fatal error')
      }
    })
    .catch(err => res.status(404).send(err))
  } else {
    res.send(JSON.stringify({
      loggedIn: false
    }));
  }
}