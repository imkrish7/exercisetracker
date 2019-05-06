
const mongodb = require('mongodb');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var exercise = new Schema({
    description:String,
    duration:String,
    date:{type:Date,default:Date.now()}
})


var user = new Schema({
    name:String,
    exercise:[exercise]
})


var model = mongoose.model('user',user);    

module.exports = model;
