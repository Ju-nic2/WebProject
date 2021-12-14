const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { sequelize } = require('../models');
const { Post, Hashtag } = require('../models');
const {isLogined,isNotLogined} = require('./checkLogin');
const { hash } = require('bcrypt');


try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'public/uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext) // 원래 파일명 + 시간 
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 사이즈 제한 
});
router.get('/editpage/:pid', isLogined, async (req, res, next) => {
  let curpost = req.params.pid;
  const [result, metadata] = await sequelize.query(`select * from posts where id = '${curpost}'`);
  console.log(result);
  res.render('new', { title: 'JunicWorld',where : 'home', post: result[0], flag: 'edit'});
});

router.post('/editpost/:pid', isLogined, upload.fields([{name: 'img1' }, { name: 'img2' }, {name: 'img3' }, {name: 'img4' }, {name: 'img5' }]), async (req, res,next) =>  { 
  let curpost = req.params.pid;
  const [origin, metadata1] = await sequelize.query(`select * from posts where id = '${curpost}'`);
 let img1 = (req.files.img1) ? `/uploads/${req.files.img1[0].filename}`  : origin.img1;
 let img2 = (req.files.img2) ? `/uploads/${req.files.img2[0].filename}`  : origin.img2;
 let img3 = (req.files.img3) ? `/uploads/${req.files.img3[0].filename}`  : origin.img3;
 let img4 = (req.files.img4) ? `/uploads/${req.files.img4[0].filename}`  : origin.img4;
 let img5 = (req.files.img5) ? `/uploads/${req.files.img5[0].filename}`  : origin.img5;
 let content = (req.body.content) ? req.body.content : origin[0].content;
 const [result, metadata2] = await sequelize.query(`delete from posts where id = '${curpost}'`);
 try {
 const post = await Post.create({
    writerid: req.user.uid,
    writername: req.user.name,
    content: content,
    img1:img1,
    img2:img2,
    img3:img3,
    img4:img4,
    img5:img5,
  });
  const hashtags = content.match(/#[^\s#]*/g);
    console.log(hashtags);
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
    res.redirect('/home/1')
  } catch (error) {
    console.error(error);
    next(error);
  }

});


router.get('/delete:pid/:img', isLogined, async (req, res, next) => {
  let curpost = req.params.pid;
  let img = req.params.img;
  const [sex, sexy] = await sequelize.query(`update posts set ${img} = null where id = '${curpost}`);
  const [result, metadata] = await sequelize.query(`select * from posts where id = '${curpost}'`);
  console.log(result);
  res.render('new', { title: 'JunicWorld',where : 'home', post: result[0], flag: 'edit'});
});

router.get('/delete/:pid', isLogined, async (req, res, next) => {
  let curpost = req.params.pid;
  const [result, metadata] = await sequelize.query(`delete from posts where id = '${curpost}'`);
  console.log(result);
  res.redirect('/home/1');
});


router.post('/newpost', isLogined, upload.array('images',5), async (req, res,next) =>  { // array('x',5) 5개로 제한하기 
  console.log("파일 이름 : ", req.files); 
  let urlArr = new Array();
  console.log('content : '+ req.body.post);
  for (let i = 0; i < req.files.length; i++) {
      urlArr.push(`/uploads/${req.files[i].filename}`);
       console.log(urlArr[i]); } 
  for(let i = req.files.length; i < 5; i++){
    urlArr.push(null);
  }
  try {
    console.log(req.user);
    console.log(req.user.uid);
    const post = await Post.create({
      writerid: req.user.uid,
      writername: req.user.name,
      content: req.body.content,
      img1:urlArr[0],
      img2:urlArr[1],
      img3:urlArr[2],
      img4:urlArr[3],
      img5:urlArr[4],
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    console.log(hashtags);
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
    res.redirect('/home/1')
  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router;
