#! /usr/bin/env node

console.log('This script populates some users and messages to your database. Specified database as argument');


var userArgs = process.argv.slice(2)

var async = require("async")
var Post = require("./models/post")
var User = require("./models/user")
var Comment = require("./models/comment")

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var users = []
var posts = []
var comments= []

function userCreate(user_name,password,cb){
    var user = new User(
        {
         user_name,
         password,
         }) 
    user.save(function(err){
        if(err){
            cb(err,null)
            return
        }
        console.log("New User: " +user);
        users.push(user)
        cb(null,user)
    })
}

function postCreate(title,text,user,published,cb){
    var post = new Post(
        {title,
         text,
         user,
         published}
    )
    post.save(function (err){
        if(err){
            cb(err,null);
            return
        }
        console.log('New post: ' + post)
        posts.push(post)
        cb(null,post)
    })

}

function commentCreate(post,text,user,cb){
    var comment = new Comment(
        {
         post,   
         text,
         user}
    )
    comment.save(function (err){
        if(err){
            cb(err,null);
            return
        }
        console.log('New comment: ' + comment)
        comments.push(comment)
        cb(null,comment)
    })

}



function createUsers(cb){
    async.series([
        function(callback){
            userCreate('satoss','123456',callback)
        },
        function(callback){
            userCreate('relakku','123456',callback)
        },
        function(callback){
            userCreate('korelakku','123456',callback)
        },
    ],cb)
}

function createPosts(cb){
    async.parallel([
        function(callback){
            postCreate('Greeting','Hello, thank you for checking my blog api website. This is my first blog post by Satoshi. Hope you enjoy.',users[0],true,callback)
        },
        function(callback){
            postCreate('Intoroduction2',"Hi, this is Rekallu. I'm the second author on this blog. I will keep posting as much as I can. Have a good day.",users[1],true,callback)
        },
        function(callback){
            postCreate('Intoroduction3',"Hi, this is Korelakku. I'm the third author on this blog. I will writer about wild lives. Hope you enjoy reading my posts in the future.",users[2],false,callback)
        },
    ],cb)
}

function createComments(cb){
    async.parallel([
        function(callback){
            commentCreate(posts[2],'Hi Korelakku',users[0],callback)
        },
        function(callback){
            commentCreate(posts[0],'Hi Satoshi',users[1],callback)
        },
        function(callback){
            commentCreate(posts[1],'Hi Relakku',users[2],callback)
        },
    ],cb)
}

async.series([
    createUsers,
    createPosts,
    createComments

],

function(err,results){
    if(err){
        console.log('Final ERR:' +err)
    }
    else {
        console.log('Posts: ' + posts)
    }
    mongoose.connection.close()
})