const express = require('express');
let app = express();
const mongoose = require('mongoose');
const Twit = require('twitter');
var engine               =require("ejs-mate");
var bodyparser           =require("body-parser");
app.use(express.static(__dirname + '/views'));
var config = require('./config.js');
const dbURI = "mongodb://localhost:27017/twtapii";
mongoose.connect(dbURI);
app.use(bodyparser.urlencoded({extended:true}));
const db=require('./db/tweets.model');
app.set('view engine','ejs');
app.engine('ejs',engine);
app.set('views', __dirname + '/views');

var T = new Twit(config);

var params = {
    q: '#nodejs',
    count: 4,
    result_type: 'recent',
    lang: 'en'
  }
//   T.get('search/tweets', params, function(err, data, response) {
//     if(!err){
//         var tweets = data.statuses;
//         for (var i = 0; i < tweets.length; i++) {
//           console.log(tweets[i].text);
//         }
//      // This is where the magic will happen
//     } else {
//       console.log(err);
//     }
//   })  

  // var stream = T.stream('statuses/filter', { track: '#MeToo',language: 'en' });
  // stream.on('data', function (data) {
        
  //    			   console.log((data));
  //     let tw_obj  = {
  //         "id_str":data.id_str,
  //         "created_at":data.created_at,
  //         "name":data.user.name,
  //     "text":data.text,
  //     "retweet_count": data.retweet_count,
      
  //     }
  //     tw = new db(tw_obj);
  //     tw.save((err,data)=>{
  //         if(err) console.log(err);
  //         else {
  //             console.log("data save");
             
             
  //         }
  //     })
        
    //     db.findOneAndUpdate(
    //      {'id_str': data.id_str},tw_obj,{
    //         upsert: true,
    //         new: true,
    //         // overwrite: true // works if you comment this out
    //     },(err,doc)=>{
    //         if(err) console.log(err)
    //         else console.log("updated")
    //     }
    //  );
     
//  });

 app.get('/',function(req,res){
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
       
  });

  function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


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
  //});
  
app.listen(3000,function(){
  console.log("server is running");
});



