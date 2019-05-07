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

mongoose.connect('mongodb+srv://kamal:kamal123@learning-oxyrk.mongodb.net/test?retryWrites=true', {
  useNewUrlParser: true
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

  user.findOne({name:req.body.username},(error,data)=>{
        if(data==null){
        var newuser = new user({
          name: req.body.username

        })
        newuser.save((error) => {
          if (error)
            return error;
        })
        res.send({
          newuser
        });
      }
      else{
        res.send("user already exist")
      }
  }).catch(error=>res.json(error))

})

indexRouter.post('/api/exercise/add',(req,res)=>{

  user.findOne({name:req.body.userid},(error,data)=>{

       if(data!=null){
       var newData = {
         description:req.body.description,
         duration:req.body.duration,
         date:new Date(req.body.date.toString())
       }
       console.log( new Date(req.body.date.toString()))
       data.exercise.push(newData);

       data.save((error)=>{
         if (error){
            return res.send(error);
         }  
         return res.send(newData);
       })
      }
      else{
           return res.send("unknown_id");
      }
  })    
})

indexRouter.get('/api/exercise/log',(req,res)=>{
  const name = req.query.userId;
  var from = " ";
  var to = " ";
  var temp=0; 
  if(req.query.from!==undefined){
      from = new Date(req.query.from.toString());
  }
  if(req.query.to!==undefined){
to = new Date(req.query.to.toString())
  }
  
  var limit = +req.query.limit | " ";
  
  
    user.findOne({ name: name }, (error, data) => {     
      var response = [];

      if(data!=null){
      if (from != " " && to != " " && limit > 0) {
        temp=limit;
        response=data.exercise.filter((d)=>{
          // console.log(d,i,limit);
          if(d.date>= from && d.date <= to && 0< temp){
            // console.log("222");
            temp = --temp;
            return d;
          }
        })

      }
      else if (from != " " && to == " " && limit > 0) {
        temp = limit;
        response = data.exercise.filter((d, i) => {
          if (d.date >= new Date(from) && 0 < temp) {
            temp = --temp;
            return d;
          }
        })
      }
      else if (from != " " && to != " " && limit === 0) {
       
        response = data.exercise.filter((d, i) => {
          if (d.date >= new Date(from) && d.date <= new Date(to) ) {
            return d;
          }
        })
      }
      else if (from != " " && to == " " && limit === 0) {
        
        response = data.exercise.filter((d, i) => {
          if (d.date >= new Date(from)) {
            return d;
          }
        })
      }
      else if (from == " " && to == " " && limit === 0) {
      
        response = data.exercise.filter((d) => {
          
            return d;
          
        })
      }
      else if (from ==" " && to != " " && limit > 0) {
        temp = limit;
        response = data.exercise.filter((d, i) => {
          if (d.date <= new Date(to) && 0 < temp) {
            temp = --temp;
            return d;
          }
        })
      }
      else if (from == " " && to != " " && limit === 0) {
        
        response = data.exercise.filter((d, i) => {
          if (d.date <= new Date(to) ) {
            return d;
          }
        })
      }
      else if (from == " " && to == " " && limit > 0) {
        temp = limit;
        response = data.exercise.filter((d, i) => {
          if ( 0 < temp) {
            temp = --temp;
            return d;
          }
        })
      }  

       res.send({ name:data["name"],exercise:response });
    }
      else {
         res.send("unlnown_id");
      }
    }).catch(error=>res.json(error))
    
    
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
