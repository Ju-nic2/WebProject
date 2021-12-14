const express = require('express');
const User = require('../models/User');
const {isLogined,isNotLogined} = require('./checkLogin');
const { sequelize } = require('../models');
const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
  next();
});

router.post('/:uid/delete', isLogined, async (req, res, next) => {
    console.log(req.user.uid);
    console.log(req.body);
    console.log(req.params.uid);
    const follow = await sequelize.query(`delete from Follow where followingId = '${req.params.uid}' and followerId = '${req.user.uid}'`);
    console.log(follow);
    res.redirect('/follow')  
  });
  
router.post('/:uid/add', isLogined, async (req, res, next) => {
    console.log(req.user.uid);
    console.log(req.body);
    console.log(req.params.uid);
    const follow = await sequelize.query(`insert into Follow  values(NOW(),NOW(),'${req.params.uid}','${req.user.uid}')`);
    console.log(follow);
    res.redirect('/follow')  
  });
  
  module.exports = router;
  