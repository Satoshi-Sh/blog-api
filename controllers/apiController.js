const User =require("../models/user")
const Post = require("../models/post")
const Comment = require("../models/comment")
const async = require('async')
const mongoose =require("mongoose")
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')


exports.posts = (req,res,next)=>{
    Post.find({published:true},)
    .sort({createdAt:1})
    .populate('user')
    .exec(function(err,posts){
        if (err){
            return next(err)
        }
        posts.map(item=>{
            console.log(item)
            item.title= item.title.replace('&#x27;',"'")
            item.text = item.text.replace('&#x27;',"'")
            item.url = item.url
            item.user.user_name = item.user.user_name.replace('&#x27;',"'")
            item.user.password=''
            return item
        })
        res.json(posts)
    })
}

exports.allposts = (req,res,next)=>{
  Post.find()
  .sort({createdAt:1})
  .populate('user')
  .exec(function(err,posts){
      if (err){
          return next(err)
      }
      posts.map(item=>{
          console.log(item)
          item.title= item.title.replace('&#x27;',"'")
          item.text = item.text.replace('&#x27;',"'")
          item.url = item.url
          item.user.user_name = item.user.user_name.replace('&#x27;',"'")
          item.user.password=''
          return item
      })
      res.json(posts)
  })
}

exports.postDetail = (req,res,next) =>{
    Post.findOne({_id:req.params.postId,published:true},)
    .populate('user')
    .exec(function(err,post)
    {
      if (err|!post){
        return next(err)
      } 
      post.title= post.title.replace('&#x27;',"'")
      post.text = post.text.replace('&#x27;',"'")
      post.user.user_name = post.user.user_name.replace('&#x27;',"'")
      post.user.password=''
      Comment.find({post:req.params.postId},)
      .sort({createdAt:1})
      .populate('user')
      .exec(function(err,comments){
        if(err|!comments){
            return next(err)
        }
        comments.map((comment)=>{
          comment.text = comment.text.replace('&#x27;',"'")
          comment.user.user_name = comment.user.user_name.replace('&#x27;',"'")
          comment.user.password=''
          return comment
        })
        res.json({post,comments})
      })

    })
}

exports.post = (req,res,next) =>{
  jwt.verify(req.token,process.env.secret, (err,authData)=>{
    if (err){
      res.sendStatus(401)
    } else{
      post = new Post({
        title:req.body.title,
        user:authData,
        text:req.body.text,
        published:req.body.published
      }).save((err)=>{
        if(err){
          return next(err)
        }
        res.json({
          message:'Post created...',
          authData,
          post
        })
      })
    }
  })
}

exports.deletePost =(req,res,next)=>{
  jwt.verify(req.token,process.env.secret, (err,authData)=>{
    if (err){
      res.sendStatus(401)
    } else{
      
        if(err){
          return next(err)
        }
        Post.findByIdAndRemove({'_id':req.params.postId,user:authData},(err,post)=>{
          if(err||!post){
            next(err)
          }
          res.json({'message':`${post.title} Deleted`})
        })
    }

  })
}

exports.comment =(req,res,next)=>{
  jwt.verify(req.body.token,process.env.secret, (err,authData)=>{
    if (err){
      res.sendStatus(401)
    } else{
      
        if(err){
          return next(err)
        }
        Post.findById({'_id':req.params.postId},(err,post)=>{
          if(err||!post){
            next(err)
          }
          comment = new Comment({
            post,
            text:req.body.text,
            user: authData
          }).save((err)=>{
            if(err){
              return next(err)
            }
            res.send({message:'Comment saved'})
          })
        })
    }

  })
}
  


exports.login = (req,res,next)=>{
  User.findOne({user_name:req.body.user_name,
                password:req.body.password
                },(err,user) =>{
                  if (err||!user){
                    return next(err)
                  }
                  jwt.sign(user.toObject(),process.env.secret,(err,token)=>{
                    res.json({
                        token,
                        username:req.body.user_name
                    })
                })

                })
  }

  
  exports.update = (req,res,next)=>{
    let update ={}
    if (req.body.title){
    update['title'] = req.body.title
    }
    if (req.body.text){
      update['text']= req.body.text
    }
    jwt.verify(req.token,process.env.secret, (err,authData)=>{
      if (err){
        res.sendStatus(401)
      } else{
          Post.findOneAndUpdate({user:authData,'_id':req.params.postId},update,(err,post)=>{
              if (err||!post){
                return next(err)
              }
              res.send({'message':`${post.title} updated`})
            })
      }

  
    })

  }

