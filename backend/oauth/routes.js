const passport = require('./passport');

module.exports.login = passport.authenticate('google', {
    accessType: 'offline'
  }
);

module.exports.return = passport.authenticate('google', {
  failureRedirect: '/login'
  }
);

module.exports.resolve = function(req, res) {
    console.log('req.user', req.user);
    req.session.user = req.user
    res.send('success!');
};