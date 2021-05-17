//////// REQUIRES ////////
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();




//////// USES ////////
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));



//////// MONGOOSE ////////
// CONNECT //
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// SCHEMAS //
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// ENCRYPTION //
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

// MODELS //
const User = new mongoose.model('User', userSchema);



//////// ROUTES ////////
// HOME //
app.route('/')

.get((req, res) => {
  res.render('home');
})

// LOGIN //
app.route('/login')

// Get
.get((req, res) => {
  res.render('login');
})

// Post
.post((req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render('secrets');
        }
      }
    }
  });
})

// REGISTER //
app.route('/register')

// Get
.get((req, res) => {
  res.render('register');
})

// Post
.post((req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.render('secrets');
    }
  });
})

// SECRETS //
app.route('/secrets')

.get((req, res) => {
  res.render('secrets');
})

// SUBMIT //
app.route('/submit')

.get((req, res) => {
  res.render('submit');
})





//////// LISTEN ////////
 app.listen(3000, function(req, res){
   console.log('Connected to port 3000.')
 });
