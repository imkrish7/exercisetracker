var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

mongoose.connect('mongodb+srv://kamal:<password>@learning-oxyrk.mongodb.net/test?retryWrites=true', {
  useNewUrlParse: true
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
var user = require('./models/user.js')

indexRouter.post('/api/exercise/new-user', (req, res) => {
  var newuser = new user({
    name:req.body.username
  })

  newuser.save((error)=>{
    if (error)
       res.send(error);
  })
  res.send({
   newuser
  });

})

indexRouter.post('/api/exercise/add',(req,res)=>{
  user.findOne({name:req.body.userid},(error,data)=>{
    if(error)
       res.send(error);
  })
})
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
