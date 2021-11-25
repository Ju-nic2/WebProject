const express = require('express');
const router = express.Router();

router.post('/login', (req, res, next) => {
    res.redirect('/home')
  });


  module.exports = router;
  