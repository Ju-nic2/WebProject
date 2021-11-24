const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();
const pageRouter = require('./routes/page'); //라우터 가져오기 
const authRouter = require('./routes/auth');

const app = express();
app.set('port',process.env.PORT || 3000); //포트지정 
app.set('view engine', 'html'); // 화면 엔진 지정 
nunjucks.configure('views', {
  express: app,
  watch: true,
});

app.use(morgan('dev')); //미들웨어 
app.use(express.static(path.join(__dirname, 'public'))); // static file 위치

app.use('/', pageRouter); //라우터 연결 
app.use('/auth', authRouter);


app.use((req, res, next) => {
    const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
  });
app.listen(app.get('port'), () => { //연결 성공
    console.log(app.get('port'), '번 포트에서 대기중');
  });