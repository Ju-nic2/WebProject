const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/User');

module.exports = () => {
  passport.use(new LocalStrategy({ 
    usernameField: 'uid', //html input tag  id 인거 (req.body 에서 가져옴)
    passwordField: 'password',//html input tag  password 인거 
  }, async (uid, password, done) => {
    try {
      const exUser = await User.findOne({ where: { uid } }); //사용자 DB에서 가져옴 
      if (exUser) {
        const result = await bcrypt.compare(password, exUser.password); //비밀번호 비교 
        if (result) {
          done(null, exUser); // authenticate 함수 로 리턴 
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });// authenticate 함수 로 리턴 
        }
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' });// authenticate 함수 로 리턴 
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
