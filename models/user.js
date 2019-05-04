
const mongodb = require('mongodb');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
    name:String,
    description:String,
    duration:String,
    date:Date
})


var model = mongoose.model('user',user);    

module.exports = model;