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

router.post('/newpost', isLogined, upload.array('images',5),async (req, res,next) =>  { // array('x',5) 5개로 제한하기 
  console.log("파일 이름 : ", req.files); 
  let urlArr = new Array();
  console.log('content : '+ req.body.post);
  for (let i = 0; i < req.files.length; i++) {
      urlArr.push(`uploads/${req.files[i].filename}`);
       console.log(urlArr[i]); } 
  for(let i = req.files.length; i < 5; i++){
    urlArr.push(null);
  }
  try {
    console.log(req.user);
    const post = await Post.create({
      writerid: req.user.id,
      content: req.body.content,
      img1:urlArr[0],
      img2:urlArr[1],
      img3:urlArr[2],
      img4:urlArr[3],
      img5:urlArr[4],
      
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        }),
      );
      await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect('/home')
  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router;
