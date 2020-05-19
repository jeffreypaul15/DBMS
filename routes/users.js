const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const passport = require('passport');
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";
// const assert = require('assert');
// Load User model

const User = require('../models/User');
const Supervisor = require('../models/Supervisor');
const Location = require('../models/Location');
const { forwardAuthenticated } = require('../config/auth');
const { userAccess } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));


// router.get('/admin_dashboard', userAccess, (req, res, next) => {
//   var resultArray = [];
 

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("27101");
//   dbo.collection("users").find({}).toArray(function(err, result) {
//     if (err) throw err;
//     // console.log(result);
//     for (x of result) {
//       resultArray.push(x.name);
//     }
//     res.render('display', {resultArray});
//   });
//   });
// });


// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, dob, password, password2, supervisor, employee, dept } = req.body;
  let errors = [];

  if (employee && supervisor) {
    errors.push( { msg: 'Please select either Employee or supervisor '});
  }

  if (!name || !email || !password || !password2 || !dob || (!supervisor && !employee)) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        var access = false
        if(employee) {
          access = false
        }
        if(supervisor) {
          access = true
        }
        const newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          name,
          email,
          password,
          dob,
          access
        });
        
        if(supervisor) {
        const newUser2 = new Supervisor({
          name,
          employee_id: newUser._id
        });
        
        newUser2.save().then(user => {
          req.flash('success_msg')
          console.log('Supervisors added in db')
        });

        const newUser3 = new Location({
          _id: new mongoose.Types.ObjectId(),
          supervisor_id: newUser2.name,
          name: dept
        });

        newUser3.save().then(user => {
          req.flash('success_msg')
          console.log('Location added in db')
        }).catch(err => console.log(err));
      }

        // Supervisor.findOne({}, (err,data)=>console.log(data.employee_id));
        // User.findById("5e7225033d6c8a4428f7d798", (err,data)=>console.log("data",data));
        // User.findById("5e7f1a86446769208cf16c1d", (err,data)=>console.log("data",data));
        // User.findOne({},(err,data)=>console.log("data",data));
        
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }

    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});



module.exports = router;
