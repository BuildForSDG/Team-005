var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const passport = require('passport');
// process.env.SECRET_KEY = 'secure';
// const  jwt = require('jwt')
const jwt = require('jsonwebtoken');
const { authLimiter, createAccountLimiter} = require('../middlewares/rateLimiter');
const AuthController =require('../controllers/auth.controller');
const AdminController =require('../controllers/auth.controller');

router.get('/', (req, res, next) => {
  res.json({
    connected: true
  });
});

// Admin sign Up

router.post(
  '/adminSignUp',
  createAccountLimiter,
  passport.authenticate('jwt', {
    session: false
  }),
  AdminController.adminSignUp
);
// user sign Up

router.post('/userSignUp', createAccountLimiter, AuthController.signUp);

// SignInroute for both admin and user
router.post('/signIn', authLimiter, AuthController.login);

//route  to fatch profile
router.get(
  '/profile',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res, next) => {
    return res.status(200).json({
      msg: 'loggedIn',
      success: true,
      user: req.user
    });
  }
);

module.exports = router;
