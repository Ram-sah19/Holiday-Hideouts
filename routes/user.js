const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/users.js');
// import * as next from 'next';

router.route("/signup")
    .get(userController.renderSignupform )
    .post(
    wrapAsync (userController.Signup)
);

router.route("/login")
    .get(userController.renderLoginForm)
    .post(
    saveRedirectUrl,
    passport.authenticate("local", {
        failureFlash: true, 
        failureRedirect: "/login"
    }),
    userController.Login
);

router.get("/logout"
,userController.logout );

module.exports = router;