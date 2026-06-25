const User = require("../models/user");

module.exports.renderSignupform= (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.Signup = async (req, res, next) => {
    try{
    let {username, email, password, role} = req.body;
    const newUser = new User({email, username, role: role || 'client'});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        req.session.save((err) => {
            if (err) {
                return next(err);
            }
            res.redirect("/listings");
        });
    });
   

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
  
};

module.exports.renderLoginForm=  (req, res) => {
    res.render("users/login.ejs");
};

module.exports.Login= async (req, res, next) => {
    req.flash("success","You are logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect(redirectUrl);
    });
};

module.exports.logout= (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    });
};