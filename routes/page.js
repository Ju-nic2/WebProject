const express = require('express');
const {isLogined,isNotLogined} = require('./checkLogin');

const router = express.Router();

router.use((req, res, next) => { // 객체를 전역에 저장. //다른 라우터에서도 사용가능.  
  res.locals.user = req.user;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followerIdList = [];
  next();
});
router.get('/', (req, res, next) => { //미들웨어 checkLogin에서 처리됨 isLogined
    res.render('index', { title: 'JunicWorld'});
  });

router.get('/home',isLogined, (req, res, next) => {
    res.render('home', { title: 'JunicWorld',where : 'home'});
});

router.get('/new',isLogined, (req, res, next) => {
  res.render('new', { title: 'JunicWorld',where : 'new'});
});

router.get('/profile',isLogined, (req, res, next) => {
  res.render('profile', { title: 'JunicWorld',where : 'profile'});
});

router.get('/account',(req, res, next) => {
  res.render('signup', { title: 'JunicWorld'});
});


  module.exports = router;
  