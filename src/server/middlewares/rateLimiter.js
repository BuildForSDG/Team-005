/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 15,
  message: 'You have exceeded the 15 authentication requests in 24 hrs limit!',
  headers: true
});

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message:
      'Too many accounts created from this IP, please try again after an hour'
});

module.exports = authLimiter;
module.exports = createAccountLimiter;
