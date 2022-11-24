var express = require('express');
var router = express.Router();
const apiController = require("../controllers/apiController")


/* GET home page. */
router.get('/api', apiController.posts);
router.get('/all',apiController.allposts)


router.get('/api/:postId',apiController.postDetail)

router.post('/api/post',verifyToken,apiController.post)


router.post('/api/login',apiController.login
)

router.post('/api/:postId/delete',verifyToken, apiController.deletePost)

router.post('/api/:postId/update',verifyToken,apiController.update)

router.post('/api/:postId/comment',verifyToken,apiController.comment)

//verify Token 

function verifyToken(req,res, next){
    // get auth header value
    const auth = req.body['token']
    console.log(auth)
    if(typeof auth !== 'undefined'){
        req.token = auth
        next()
    }else {
        res.sendStatus(403)
    }
}


module.exports = router;


