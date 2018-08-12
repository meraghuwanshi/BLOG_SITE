const route = require('express').Router();
const POST = require('../models/post');
const multer = require('multer');
const storage = multer.diskStorage({
    destination:function(req , file ,done){
        done(null , 'images');
    },
            filename : function (req , file , done) {
                done(null , file.originalname);
            }
    })


const fileFilter = function(req , file , done){
    if(file.mimetype === "image/jpeg" || file.mimetype==="image/png"){
        done(null,true);
    }
    else { done(new Error("file is not jpeg or png") ,false);
    }
}

const upload = multer({
    storage:storage,
    fileFilter:fileFilter
  })

route.post('/image',upload.single('image'),(req , res)=>{
    res.send(req.file)
})



route.get('/',(req , res)=>{
 POST.find({}).then((data)=>{
           res.send(data)
 })           .catch((err)=>{
           res.send({error:err})
 })
 })

route.post('/',upload.single('image'),(req , res)=>{
    const post = new POST({
          title : req.body.title,
        content : req.body.content,
       username : req.body.username,
     image_path : req.file.path
    });
    post.save().then((data)=>{
            res.redirect('/post')
    })         .catch((err)=>{
            res.send({error:err})
    })
})



module.exports = route;