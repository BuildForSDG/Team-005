/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

process.env.SECRET_KEY = 'secure';
// const  jwt = require('jwt')

class AuthController {
  static async signUp(req, res, next) {
    const {
      userName, password, confirm_password, email, firstName, lastName
    } = req.body;
    if (password !== confirm_password) {
      return res.status(400).json({
        msg: 'Password incorrect'
      });
    }
    User.findOne({
      userName
    }).then((user) => {
      if (user) {
        return res.status(400).json({
          msg: 'Username already taken'
        });
      }
      User.findOne({
        email
      }).then((user) => {
        if (user) {
          return res.status(400).json({
            msg: 'email  already been registerd. did you forget your password'
          });
        }
        const newUser = new User({
          userName,
          email,
          password,
          firstName,
          lastName,
          userType: 'user'
        });
        console.log(newUser);
        //  hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;

            newUser
              .save()
              .then((user) => {
                res.status(201).json({
                  success: true,
                  msg: `i am please to inform you that  ${user.userName} is registerd`
                });
              })
              .catch((err) => {
                res.json({
                  error: err
                });
              });
          });
        });
      });
    });
  }

  static async login(req, res, next) {
    const { email, userName, password } = req.body;
    // let me = req.header['x-access-token']
    // console.log(me)
    User.findOne({ email }).then((user) => {
      if (!user) {
        res.status(404).json({
          msg: 'no email found',
          success: false
        });
        return;
      }
      User.findOne({ userName }).then((userName) => {
        if (!userName) {
          res.status(404).json({
            msg: 'no user found',
            success: false
          });
          return;
        }
        bcrypt
          .compare(password, user.password)
        //
          .then((ismatch) => {
            if (ismatch) {
              const payload = {
                _id: user._id,
                userName: user.userName,
                password: user.password,
                email: user.email,
                userType: user.userType
              };
              jwt.sign(
                payload,
                process.env.SECRET_KEY,
                {
                  expiresIn: '1h'
                },
                (err, token) => {
                  res.status(200).json({
                    success: true,
                    token: `Bearer ${token}`,
                    user,
                    msg: 'you are now logged in'
                  });
                //  token
                //               let me=  req.header['x-access-token'] =token
                // console.log(me)
                }
              );
            } else {
              return res.status(404).json({
                success: false,

                msg: 'incorrect password'
              });
            }
          });
      });
    //
    });
  }
}
module.exports = AuthController;
