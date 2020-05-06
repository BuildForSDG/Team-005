var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
const passport = require('passport')
var Router = require('./routes/route');
var mongoose = require('mongoose');
var morgan = require('morgan');

var app = express();



//map global promise - get rid of warning
mongoose.promise=global.promise;
mongoose.connect( 'mongodb://localhost/BDG',
  
{useNewUrlParser:true,
  useUnifiedTopology: true 
})
.then(()=> console.log(' DB connected'))
.catch((err) => console.log(err));



app.set('view engine', 'ejs')

app.use(morgan('dev'))

app.use(passport.initialize())
require("./config/passport")(passport)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', Router);


var port = process.env.PORT || 5000;


// module.exports = app;
app.listen(port,(req,res,next)=>{
  console.log(`server running at port ${port}`)
});
