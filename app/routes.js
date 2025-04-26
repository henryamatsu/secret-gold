module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('users').find({_id: req.user._id}).toArray((err, result) => {

          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : result[0]
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// gold acquisition routes ===============================================================

    const arrangements = {
      1: {
        1: {
          1: 0,
          2: 0,
          3: 1,
          4: 0    
        },
        2: {
          1: 2,
          2: 0,
          3: -1,
          4: 0
        },
        3: {
          1: -1,
          2: 0,
          3: 0,
          4: 1
        },
        4: {
          1: 1,
          2: 0,
          3: 0,
          4: 0              
        }  
      },
      2: {
        1: {
          1: 0,
          2: 0,
          3: 1,
          4: -2    
        },
        2: {
          1: 2,
          2: 0,
          3: 0,
          4: 0
        },
        3: {
          1: 0,
          2: 0,
          3: 3,
          4: -1
        },
        4: {
          1: 1,
          2: 0,
          3: 0,
          4: 0              
        }  
      },
      3: {
        1: {
          1: -3,
          2: 5,
          3: 0,
          4: 0    
        },
        2: {
          1: 0,
          2: 1,
          3: 0,
          4: 0
        },
        3: {
          1: 0,
          2: 6,
          3: 0,
          4: -1
        },
        4: {
          1: 1,
          2: 0,
          3: 0,
          4: 0              
        }  
      },
      4: {
        1: {
          1: 0,
          2: 3,
          3: 0,
          4: 0    
        },
        2: {
          1: 100,
          2: -5,
          3: 0,
          4: 0
        },
        3: {
          1: 0,
          2: 1,
          3: 0,
          4: 0
        },
        4: {
          1: 0,
          2: 10,
          3: 0,
          4: 0              
        }  
      }
    };

    app.put('/getGold', async (req, res) => {
      try {
        let goldAmount = 0;
        const userId = req.app.locals.ObjectId(req.body._id);
        const user = await db.collection('users').findOne({_id: userId});
        const combinations = user.local.combinations || [];

        if (req.body.buttonType == 5) {
          combinations.length = 0;
        }
        else {
          if (combinations.length < 3) {
            combinations.push(req.body.buttonType);
          }
    
          if (combinations.length === 3) {
            goldAmount = arrangements[combinations[0]][combinations[1]][combinations[2]];
            combinations.length = 0;
          }  
        }
          
        await db.collection('users').findOneAndUpdate({_id:userId}, {
          $inc: {
            "local.gold": goldAmount
          },
          $set: {
            "local.combinations": combinations,
          }
        }, {
          sort: {_id: -1},
          upsert: true
        })

        res.json({gold: goldAmount})
      }
      catch (err) {
        console.log(err);
        res.send(err);
      }
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
