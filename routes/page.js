const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('index', { title: 'JunicWorld',isLogined :false });
  });

router.get('/home', (req, res, next) => {
    res.render('home', { title: 'JunicWorld',isLogined : true, where : 'home'});
});

router.get('/signup', (req, res, next) => {
    res.send('회원가입');
});


  module.exports = router;
  