const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const {isLogined,isNotLogined} = require('./checkLogin');
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => { // 'local 전략'
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`); // -> index.html에 <script>에서 처리됨.
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/home');
    });
  })(req, res, next); //그 다음 미들웨어 호출 -> page.js 에 있음 
});

router.get('/logout', isLogined, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

router.post('/signup',async (req, res, next) => {
  const { uid, password,email,name } = req.body;
  console.log(uid+' '+password+' '+email+' '+name)
  try {
    const exId = await User.findOne({ where: { uid } });
    const exEmail = await User.findOne({ where: { email } });
    if (exId) { //id 중복체크
      return res.redirect('/account?error=existId');
    } //email 중복체크 
    if (exEmail) {
      return res.redirect('/account?error=existEmail');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      uid,
      password: hash,
      email,
      name,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
  