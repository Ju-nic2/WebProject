const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport'); //passport 모듈 가져오기 

dotenv.config();
const pageRouter = require('./routes/page'); //라우터 가져오기 
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const followRouter = require('./routes/follow');
const homeRouter = require('./routes/home');

const { sequelize } = require('./models');
const passportConfig = require('./passport'); // 설정값 가져오기 (passport/index.js)

const app = express();
passportConfig(); // 패스포트 설정
app.set('port',process.env.PORT || 3000); //포트지정 
app.set('view engine', 'html'); // 화면 엔진 지정 
nunjucks.configure('views', {
  express: app,
  watch: true,
});

sequelize.sync({ force: false }) // db 연결 
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev')); //개발용 미들웨어 
app.use(express.static(path.join(__dirname, 'public'))); // static file 위치

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({ //request에 session 연결 
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(passport.initialize()); //request에 passport 설정 sessoion 에 의존함 -> express-session 뒤에 와야함. 
app.use(passport.session()); // 설정한 passport에 세션 저장 -> passport/selialize로 감. 

app.use('/', pageRouter); //라우터 연결 
app.use('/auth', authRouter);
app.use('/post',postRouter);
app.use('/follow',followRouter);
app.use('/home',homeRouter);

app.use((req, res, next) => {
    const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
  });
app.listen(app.get('port'), () => { //연결 성공
    console.log(app.get('port'), '번 포트에서 대기중');
  });