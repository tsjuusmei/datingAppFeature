
const express = require("express");
const bodyParser = require("body-parser");
const mongo = require("mongodb");
const ObjectID = mongo.ObjectID;
const session = require("express-session");
require("dotenv").config();



const app = express();

const port = 3000;

const TWO_HOURS = 1000 * 60 * 60 * 2;

// THIS IS THE CODE FOR THE CONNECTION WITH THE DATABASE
let db = null;
let url = process.env.DB_URL;

mongo.MongoClient.connect(url, { useUnifiedTopology: true }, function (
  err,
  client
) {
  if (err) {
    throw err;
  }
  db = client.db(process.env.DB_NAME);
});

// THIS IS WHERE THE CODE FOR THE DATABASE ENDS


app.use("/static", express.static("static"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: TWO_HOURS,
      sameSite: true,
    },
  })
);

app.set("view engine", "ejs");

app.get("/", home);
app.get("/results", results);
app.get('/register', register)
app.get("/filter", filters);
app.get("/login", login);
app.get("/profile", profile)

app.post("/results", filter);
app.post("/login", loginpost);
app.post('/register', registerpost)
app.post("/profile", profilepost)

function home(req, res) {
  let { userId } = req.session;
  if ((userId = null)) {
    res.render("home.ejs");
  } else {
    res.render("homeSecond.ejs");
  }
}

function results(req, res, next) {
  db.collection("users").find({}).toArray(done);
  function done(err, data) {
    if (err) {
      next(err);
    } else {
      res.render("index.ejs", { data: data });
    }
  }
}

function register (req, res) {
  res.render('register.ejs')
}

function filters(req, res) {
  res.render("filter.ejs");
}

function login(req, res) {
  res.render("login.ejs");
}

function profile(req, res){
  // In this function we use the data from the current userId aka the session 
 res.render('profile.ejs', {data:req.session.userId}) 
}

function loginpost(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  if (email && password){
    db.collection('users').findOne({email: email, password: password}, done)
    function done(err, data){
        if (err){
            next(err)
        }else {
            req.session.userId = data
            res.redirect('/results')
      }
    }  
  } 
}
// In this function we make sure the user can update it's haircolor and this wil be changed in the database
function profilepost(req,res){
  db.collection('datingapp').updateOne(
         // First we find the userId aka the session and then we update the haircolor with the input from the user
         {firstName: req.session.userId.firstName}, 
         {$set: {hair: req.body.hair}})
         
         db.collection('datingapp').findOne({firstName: req.session.userId.firstName}, done)
         function done(err, data){
             if (err){
                 next(err)
             }else {
                 req.session.userId = data
                 res.redirect('/results')
             }}         
 }

function filter(req, res) {
  let sexualityFilter = req.body.sexuality;
  let genderFilter = req.body.gender;

  db.collection("users")
    .find({ gender: genderFilter, sexuality: sexualityFilter })
    .toArray(done);
  function done(err, data) {
    if (err) {
      next(err);
    } else {
      res.render("index.ejs", { data: data });
    }
  }
}

function registerpost(req, res, next) {
  db.collection('users').insertOne({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      age: req.body.age,
      gender: req.body.gender,
      sexuality: req.body.sexuality
  }, done)

  function done(err, data) {
      if (err) {
          next(err)
      } else {
          res.redirect('login')
      }
  }
}

app.listen(port, () => console.log("Example app listening on port" + port));
