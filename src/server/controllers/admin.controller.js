/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-shadow */
const bcrypt = require('bcryptjs');
const User = require('../models/users');

process.env.SECRET_KEY = 'secure';

class AdminController {
  static async adminSignUp(req, res, next) {
    if (req.user.userType === 'superAdmin') {
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
            userType: 'admin'
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
    } else {
      return res.status(400).json({
        msg: 'un authorize route'
      });
    }
  }
}
module.exports = AdminController;
