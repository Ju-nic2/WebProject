const express = require('express');
const {isLogined,isNotLogined} = require('./checkLogin');
const User = require('../models/User');
const { sequelize } = require('../models');
const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.uid) : [];
  next();
});
router.get('/', (req, res, next) => { //미들웨어 checkLogin에서 처리됨 isLogined
    res.render('index', { title: 'JunicWorld'});
});



router.get('/follow', isLogined, async (req, res, next) => {
  try {
    console.log(req.user.uid);
     const [user, metadata] = await sequelize.query(`SELECT * from users as U where U.uid <> '${req.user.uid}' and  U.uid not in (select followingId from Follow where followerId = '${req.user.uid}') `);
    if (user) {
      console.log(1);
      res.render('follow', { title: 'JunicWorld',where : 'follow', userList: user});
    } else {
      console.log(2);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/new',isLogined, (req, res, next) => {
  res.render('new', { title: 'JunicWorld',where : 'new',flag: 'new'});
});

router.get('/profile',isLogined, (req, res, next) => {
  res.render('profile', { title: 'JunicWorld',where : 'profile'});
});

router.get('/account',(req, res, next) => {
  res.render('signup', { title: 'JunicWorld'});
});
router.get('/msg',(req, res, next) => {
  res.render('message', { title: 'JunicWorld', where: 'msg'});
});


  module.exports = router;
  