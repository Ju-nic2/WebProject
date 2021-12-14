const passport = require('passport');
const local = require('./localStrategy');
const User = require('../models/User');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.uid); // 필요할때 찾을 수 있도록 primary key인 user id만 저장. 
  });

  passport.deserializeUser((uid, done) => {
    User.findOne({
      where: { uid },
      include: [{
        model: User,
        attributes: ['uid', 'name'],
        as: 'Followers',
      }, {
        model: User,
        attributes: ['uid', 'name'],
        as: 'Followings',
      }],
    })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local();
};
