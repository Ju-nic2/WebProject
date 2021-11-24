const express = require('express');
const router = express.Router();

router.post('/login', (req, res, next) => {
    res.send('로그인 성공!');
  });


  module.exports = router;
  