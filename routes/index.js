const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
var resultArray = [];
const User = require('../models/User');
const Supervisor = require('../models/Supervisor');
const Location = require('../models/Location');
const Evidence = require('../models/Evidence Material');
const { ensureAuthenticated, forwardAuthenticated, userAccess } = require('../config/auth');
var url = "mongodb://localhost:27017/";

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));


// Supervisor List Page


router.get('/admin', ensureAuthenticated, (req, res) => {
  Supervisor.find({}).then(user_data => {
  res.render('display', {
    user: user_data
  })
});
});

// To view Evidence
router.get('/evidence', ensureAuthenticated, (req, res) => {
  Supervisor.find({}).then(user_data => {
  res.render('display', {
    user: user_data
  })
});
});
// To add Evidence, make sure it's admin enabled only
router.get('/add_evidence', userAccess, (req, res) => {
  Location.find({}).then(loc_data => {
  res.render('addevidence', {
    locs: loc_data
  })
});
});


router.get('/all_users', ensureAuthenticated, (req, res) => {
  User.find({}).then(loc_data => {
  res.render('allusers', {
    user: loc_data
  })
});
});

router.get('/view_locations', ensureAuthenticated, (req, res) => {
  Location.find({}).then(loc_data => {
  res.render('allocs', {
    locs: loc_data
  })
});
});

router.get('/view_evidence', ensureAuthenticated, (req, res) => {
  Evidence.find({}).then(loc_data => {
  res.render('viewevidence', {
    materials: loc_data
  })
});
});





router.post('/add_evidence', (req, res) => {
  const { Class, Description, Dimentions, Source, Department} = req.body;

  
  let errors = [];
  console.log(Department);
  if (!Class || !Description || !Dimentions || !Source || !Department ) {
    errors.push({ msg: 'Please enter all fields' });
  }

  console.log(errors)
  if (errors.length > 0) {
    Location.find({}).then(locs => {
    res.render('addevidence', {
      Class,
      errors,
      Description,
      Dimentions,
      Source,
      Department,
      locs
    })
  });
  } else {

    const newEvidence = new Evidence({
      _id: new mongoose.Types.ObjectId(),
      class: Class,
      description: Description,
      dimentions: Dimentions,
      department_name: Department,
      source: Source
    });
    console.log('pls1');
    newEvidence.save().then(user => {
      Location.find({}).then(loc_data => {
        console.log(loc_data);
        console.log('pls');
      req.flash('success_msg', "Evidence is added");
      res.redirect('/add_evidence');
    });
  }).catch(err => console.log(err));
}
});




// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  
  // MongoClient.connect(url, function(err, db) {
  //   if (err) throw err;
  //   var dbo = db.db("27101");
  //   dbo.collection("users").find({}).toArray(function(err, result) {
  //     if (err) throw err;
  //     for (x of result) {
  //       resultArray.push(x.name);
  //     }

  //   });
  //   console.log(resultArray); 
  //   console.log('smd');
  //   });
  res.render('dashboard', {
    // user: resultArray.pop()
    user: req.user
  })
});



module.exports = router;
