var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/users')
const passport = require('passport')
process.env.SECRET_KEY = 'secure'
// const  jwt = require('jwt')
const jwt = require("jsonwebtoken")

router.get('/',(req,res,next) => {
    res.json({
        connected:true
    })
}) 


// Admin sign Up

router.post('/adminSignUp',passport.authenticate('jwt',{
    session:false
  }), function(req, res, next) {
  if (req.user.userType === 'superAdmin') {
    let {
      userName,
      password,
      confirm_password,
      email,
      firstName,
      lastName,
    } = req.body
    if (password !== confirm_password) {
      return res.status(400).json({
        msg:'Password incorrect'
      })
      ;
    }else{
      User.findOne({
        userName:userName
      }).then((user)=>{
        if(user) {
        return res.status(400).json({
            msg:"Username already taken" 
        })
        }else{
          User.findOne({
            email:email
        })
        .then((user)=>{
          if(user) {
           return res.status(400).json({
              msg:"email  already been registerd. did you forget your password" 
          })
          
          }
          else{
  
            let newUser= new User({
              userName,
              email,
              password,
              firstName,
              lastName,
                  userType:'admin'
              })
              console.log(newUser)
              //  hash password
               bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err
                    newUser.password=hash;
                    
                    newUser.save()
                    .then((user)=>{
                        
                      
                        res.status(201).json({
                            success:true,
                            msg:`i am please to inform you that  ${user.userName} is registerd`
                        })
                       
                      
                
                    }
                    )
                    .catch(err=>{
                        res.json({
                          error:err
                          
                        })
                    })
                })
                })
  
          }
        })
  
  
        }
      })
    } 
  }else{
    return res.status(400).json({
      msg:'un authorize route'
    })
  }
  
       
    
  });
  // user sign Up

router.post('/userSignUp', function(req, res, next) {
    let {
      userName,
      password,
      confirm_password,
      email,
      firstName,
      lastName,
    } = req.body
    if (password !== confirm_password) {
      return res.status(400).json({
        msg:'Password incorrect'
      })
      ;
    }else{
      User.findOne({
        userName:userName
      }).then((user)=>{
        if(user) {
        return res.status(400).json({
            msg:"Username already taken" 
        })
        }else{
          User.findOne({
            email:email
        })
        .then((user)=>{
          if(user) {
           return res.status(400).json({
              msg:"email  already been registerd. did you forget your password" 
          })
          
          }
          else{
  
            let newUser= new User({
              userName,
              email,
              password,
              firstName,
              lastName,
              userType:'user'
              })
              console.log(newUser)
              //  hash password
               bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err
                    newUser.password=hash;
                    
                    newUser.save()
                    .then((user)=>{
                        
                      
                        res.status(201).json({
                            success:true,
                            msg:`i am please to inform you that  ${user.userName} is registerd`
                        })
                       
                      
                
                    }
                    )
                    .catch(err=>{
                        res.json({
                          error:err
                          
                        })
                    })
                })
                })
  
          }
        })
  
  
        }
      })
    }
     
  });
  


// SignInroute for both admin and user
router.post('/signIn',(req,res,next)=>{
    let {email,userName,password}=req.body
    // let me = req.header['x-access-token']
    // console.log(me)
    User.findOne({email:email})
    .then(user=>{
      if (!user) {
         res.status(404).json({
          msg:'no email found',
          success:false})
          return
      }
      User.findOne({userName:userName})
      .then(userName=>{
        if (!userName) {
          res.status(404).json({
           msg:'no user found',
           success:false})
           return
       }
       bcrypt.compare(password,user.password)
    //    
       .then(ismatch=>{
           if(ismatch){ 
               const payload={
                 _id:user._id,
                userName:user.userName,
                 password:user.password,
                 email:user.email,
                 userType:user.userType
     
       
               }
               jwt.sign(payload,process.env.SECRET_KEY, {
                   expiresIn:'1h'
       
                 },(err,token)=>{
                     res.status(200).json({
                           success:true,
                        token:`Bearer ${token}`   , 
                        user:user,
                         msg:"you are now logged in"
                     })
                    //  token
    //               let me=  req.header['x-access-token'] =token
    // console.log(me)
                     ;
                   })
           }else{
              return res.status(404).json({
                   success:false,
                     
                    msg:"incorrect password"
               })
           }
       })
      })
    //   
     
    })
    
    })
    






  //route  to fatch profile
  router.get('/profile',passport.authenticate('jwt',{
    session:false
  }),(req,res,next) =>{
            return res.status(200).json({
              msg:'loggedIn',
              success:true,
              user:req.user})
          
  
    
    
  })


module.exports = router;
