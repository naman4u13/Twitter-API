const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
    name:{type:String},
  id_str: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    
  },
  author: {
    type: String,
    
  },
  created_at: {
    type: String,
    required: true
  },
  text:{type:String},
  retweet_count:{type:Number},
  favorite_count:{type:Number}
})
module.exports = mongoose.model('Tweet', tweetSchema)