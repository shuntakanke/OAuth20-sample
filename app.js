const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport');
const connectDB = require('./config/db');
const cookieSession = require('cookie-session');
const passport = require('passport');

const config = require('config');
const cookieKey = config.get('cookieKey');

const app = express();

connectDB();

// set up view enging
app.set('view engine','ejs');

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys:[cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth',authRoutes);
app.use('/profile',profileRoutes);

// create home route
app.get('/',(req, res) => {
  res.render('home', { user: req.user});

})

app.listen(3000,() => {
  console.log('app listen 3000')
})