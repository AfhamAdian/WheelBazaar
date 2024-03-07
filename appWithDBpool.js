const express = require('express');
const path = require('path')
const cookieParser = require('cookie-parser'); 
const morgan = require('morgan');
const dotenv = require('dotenv');
const oracledb = require('./DB/dbConnect.js');
const bodyParser = require('body-parser')

const app = express();
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, 'views/public')));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended : true}));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

// creating Server
const PORT = 3000;
app.listen(PORT, ()=> console.log('server started to listening at port 3000'));

// initializing the DataBase Pool
oracledb.init();


// Router and Page
const mainHomeRouter = require('./routes/customer/mainHomeRouter.js');
app.use('/', mainHomeRouter );

const homeRouter = require('./routes/customer/homeRouter.js');
app.use('/test',homeRouter);

app.use('/login', require('./routes/customer/logInRouter.js'));
app.use('/signup', require('./routes/customer/signUpRouter.js'));
app.use('/logout', require('./routes/customer/logOutRouter.js'));
app.use('/cart', require('./routes/customer/cartRouter.js'));
app.use('/companyHome', require('./routes/company/companyHomeRouter.js'));
/// 404 Page Ridercting 
app.use((req, res) => {
    // res.status(404).sendFile('./views/companyHomeGraph.ejs', { root: __dirname });
    res.status(404).render('404.ejs');

});