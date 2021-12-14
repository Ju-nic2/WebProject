const express = require('express');
const {isLogined,isNotLogined} = require('./checkLogin');
const User = require('../models/User');
const path = require('path');
const { sequelize } = require('../models');
const router = express.Router();

router.get('/:num',isLogined, async (req, res, next)  => {
    [result, metadata] = await sequelize.query(`select * from posts`);
    const count = Object.keys(result).length;
    console.log(count);
    let posts = new Array();
    let pagenum = new Array();
    for(let i = 1; i <= (count/9) + 1; i++)
    {
        pagenum.push(i);
    }
    let curpage = parseInt(req.params.num, 10);
    console.log(curpage+' sex');
    let start = (curpage-1)*9;
    let end = ((count-start) >= 9 ) ? 9*curpage : count;
    console.log(start +' '+end);
    for(let i = start; i < end; i++){
        posts.push(result[i]);
    }
     console.log(count);
    res.render('home', { title: 'JunicWorld',where : 'home', posts: posts, pagenum: pagenum});
});

router.get('/writerSearch/:searchString',async (req, res, next) => {
    searchString = req.params.searchString;
    [result, metadata] = await sequelize.query(`select * from posts where writerid = '${searchString}'`);
    posts=result;
    console.log(result);
    res.render('home', { title: 'JunicWorld',where : 'home', posts: posts, searchString:searchString});
});

router.get('/search/:searchString',isLogined, (req, res, next) => {
    result = req.session.message;
    searchString = req.params.searchString;
    const count = Object.keys(result).length;
    let posts = new Array();
    let pagenum = new Array();
    for(let i = 1; i <= count; i++)
    {
        pagenum.push(i);
    }
    let start = 0;
    end = (count > 9) ? 9 : count;
    for(let i = start; i < end; i++){
        posts.push(result[i]);
    }
     console.log(count);
    res.render('home', { title: 'JunicWorld',where : 'home', posts: posts, searchString:searchString, pagenum: pagenum});
});
router.post('/search',async (req, res, next) => {
    const { searchKeyword, searchString} = req.body;
    console.log(searchKeyword);
    console.log(searchString);
    let result,metadata;
    switch(searchKeyword){
      case 'Writer':
         [result, metadata] = await sequelize.query(`select * from posts where writername like '%${searchString}%'`);
        console.log(result);
        break;
      case 'Text':
         [result, metadata] = await sequelize.query(`select * from posts where content like '%${searchString}%'`);
        console.log(result);
        break;
      case 'HashTag':
        [result, metadata] = await sequelize.query(`select * from posts where id in (select distinct(P.id) from (posts as P join PostHashtag on P.id = PostHashtag.PostId ) join hashtags as H on HashtagId = H.id where H.title like '%${searchString}%')`);
        console.log(result);
        break;
    }
    req.session.message = result;
    res.redirect(`/home/search/${searchString}`);
  });
module.exports = router;