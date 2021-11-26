const passport = require('passport');
const local = require('./localStrategy');
const User = require('../models/User');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id); // 필요할때 찾을 수 있도록 primary key인 user id만 저장. 
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local();
};
