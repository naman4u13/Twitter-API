
# Table Of Contents
1. [Description](#description)
2. [API 1](#api-1)
    * [Trigger search or stream](#trigger-search-or-stream) 
    * [Libraries for twitter search or streaming](#libraries-for-twitter-search-or-streaming)
    * [Fetch tweets](#fetch-tweets)
    * [Database Schema](#database-schema)
3. [API 2](#api-2)
    * [Pagination](#pagination)
    * [Text Search and Filter](#text-search-and-filter)
    * [Sorting](#sorting) 
4. [API 3](#api-3)
    * [save to CSV](#csv)

# Description
Use Twitter Search/Streaming API to fetch and store the target tweets with metadata (eg: user details,
date-time etc ) for a recent high traffic event and create a MVP.
1. API 1 to trigger a twitter search/stream for recent high traffic events. 
2. API 2 to return stored tweets and their metadata based on applied filters/search.
3. API 3 to export filtered data as CSV.


# API 1
  ## Trigger Search or Stream
       var T = new Twit(config);

var params = {
    q: '#nodejs',
    count: 4,
    result_type: 'recent',
    lang: 'en'
  }
  T.get('search/tweets', params, function(err, data, response) {//search
   //
  })  

  var stream = T.stream('statuses/filter', { track: '#MeToo',language: 'en' });//stream
  //
      })

  ## Libraries for twitter search or streaming
   [link](https://www.npmjs.com/package/twitter)

 ## Fetch tweets
var T = new Twit(config);

var params = {
    q: '#nodejs',
    count: 4,
    result_type: 'recent',
    lang: 'en'
  }
  T.get('search/tweets', params, function(err, data, response) {//search
    if(!err){
        var tweets = data.statuses;
        for (var i = 0; i < tweets.length; i++) {
          console.log(tweets[i].text);
        }
     
    } else {
      console.log(err);
    }
  })  

  var stream = T.stream('statuses/filter', { track: '#MeToo',language: 'en' });//stream
  stream.on('data', function (data) {
        
     			   console.log((data));
      let tw_obj  = {
          "id_str":data.id_str,
          "created_at":data.created_at,
          "name":data.user.name,
      "text":data.text,
      "retweet_count": data.retweet_count,
      
      }
      tw = new db(tw_obj);
      tw.save((err,data)=>{
          if(err) console.log(err);
          else {
              console.log("data save");
             
             
          }
      })
 
 
 ## Database Schema
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
# API 2
  ## Pagination
     var perPage = 2
     var page = req.params.page || 1
     var noMatch=' ';
   
    if(req.query.search){
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      db
      .find({name:regex})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, twit) {
          db.count().exec(function(err, count) {
              if (err) return next(err)
              if(count<1){
                noMatch="Notfound"
              }
              res.render('text', {
                  t: twit,
                  current: page,
                  pages: Math.ceil(count / perPage),
                 noMatch:noMatch
              })
          })
        
      })
  
  
  
  
  ## Text Search and Filter
      app.get('/search/:page',function(req,res){
    var perPage = 2
    var page = req.params.page || 1
    var noMatch=' ';
   
    if(req.query.search){
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      db
      .find({name:regex})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, twit) {
          db.count().exec(function(err, count) {
              if (err) return next(err)
              if(count<1){
                noMatch="Notfound"
              }
              res.render('text', {
                  t: twit,
                  current: page,
                  pages: Math.ceil(count / perPage),
                 noMatch:noMatch
              })
          })
        
      })
    }
    else{
      db
      .find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, twit) {
          db.count().exec(function(err, count) {
              if (err) return next(err)
              res.render('text', {
                  t: twit,
                  current: page,
                  pages: Math.ceil(count / perPage),
                 noMatch:noMatch
              })
          })
        
      })
    }
    
  });
  
  
  ## Sorting
      Sorting has done on the basis of date and time
# API 3
  ## Save to CSV
      db.find({},function(err,y){
      if(err) console.log(err);
      const json2csv = require('json2csv').parse;
      const fs = require('fs');
      const fields = ['id_str','created_at', 'name','text'];
      const csv = json2csv({ data: y, fields: fields });
     
       fs.writeFile('file.csv', csv, function(err) {
       if (err) throw err;
       console.log('file saved');
       });
      res.render('index',{p:y});
   })
