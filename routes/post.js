const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
const {isLogined,isNotLogined} = require('./checkLogin');


try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext) // 원래 파일명 + 시간 
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 사이즈 제한 
});

router.post('/newpost', isLogined, upload.array('images',5), (req, res) =>  { // array('x',5) 5개로 제한하기 
console.log("파일 이름 : ", req.files); let urlArr = new Array();
console.log('content : '+ req.body.post);
 for (let i = 0; i < req.files.length; i++) {
      urlArr.push(`/newpost/${req.files[i].filename}`);
       console.log(urlArr[i]); } 
       let jsonUrl = JSON.stringify(urlArr); 
res.redirect('/home')
});


module.exports = router;
