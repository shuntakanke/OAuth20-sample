const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

const config = require('config');
const clientID = config.get('clientID');
const clientSecret = config.get('clientSecret');

const User = require('../models/user');

passport.serializeUser((user,done) => {
  done(null, user.id);
});

passport.deserializeUser((id,done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});


passport.use(
  new GoogleStrategy({
  // option for the google startegy
    callbackURL:'/auth/google/redirect',
    clientID: clientID,
    clientSecret: clientSecret
  },(accessToken, refreshToken, profile, done) => {

  // check if user already exists in our db
    User.findOne({googleId: profile.id}).then((currentUser) => {
      if(currentUser) {
        // already have the user
        console.log('user is', currentUser)
        done(null,currentUser)
      }else {
        //  if not
        new User({
          username: profile.displayName,
          googleId: profile.id
        }).save().then((newUser) => {
          console.log('new user created' + newUser);
          done(null, newUser);
        })
      }
    })

  })
)