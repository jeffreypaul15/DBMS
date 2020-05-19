var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";



var resultArray = [];



module.exports = {

  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');      
  },
  userAccess: function(req,res,next) {
    console.log(req.user);
    if (req.user.access) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/dashboard');      
  },
};
