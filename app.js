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

    if(error)
      res.send(error)


      if(data==null){
        var newuser = new user({
          name: req.body.username

        })
        newuser.save((error) => {
          if (error)
            res.send(error);
        })
        res.send({
          newuser
        });
      }
      else{
        res.send("user already exist")
      }
  })
 

 
 

})

indexRouter.post('/api/exercise/add',(req,res)=>{

  // if(user.findOne({name:req.body.userid})===null){
  user.findOne({name:req.body.userid},(error,data)=>{
    if(error)
       res.send(error);

       if(data!=null){
       const newData = {
         description:req.body.description,
         duration:req.body.duration,
         date:req.body.date
       }
       data.exercise.push(newData);

       data.save(error=>{
         if (error)
            res.send(error);
       })
   
      res.send(data);
      }
      else{
         res.send("unknown_id");
      }
  })
})

indexRouter.get('/api/exercise/log',(req,res)=>{
  const name = req.query.userId;
  const from = req.query.from | " ";
  const to = req.query.to | " ";
  const limit = +req.query.limit | " ";
  
  // if(user.findOne({ name:name })!==null){
    user.findOne({ name: name }, (error, data) => {
      if (error)
        res.send(error);
     
      var response = [];

      if(data!=null){
      if (from != " " && to != " " && limit > 0) {
       
        response=data.exercise.filter((d,i)=>{
          if(d.date>= new Date(from) && d.date<= new Date(to) && i< limit){
            return d;
          }
        })

      }
      else if (from != " " && to == " " && limit > 0) {
        
        response = data.exercise.filter((d, i) => {
          if (d.date >= new Date(from) && i < limit) {
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
        
        response = data.exercise.filter((d, i) => {
          if (d.date <= new Date(to) && i < limit) {
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
        
        response = data.exercise.filter((d, i) => {
          if ( i < limit) {
            return d;
          }
        })
      }  

      res.send({ name:data["name"],exercise:response });
    }
      else {
        res.send("unlnown_id");
      }
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
