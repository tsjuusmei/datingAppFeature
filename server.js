const helmet = require('helmet')
const express = require("express");
const bodyParser = require("body-parser");
const mongo = require("mongodb");
const ObjectID = mongo.ObjectID;
const session = require("express-session");
const bcrypt = require('bcrypt')
const rateLimit = require('express-rate-limit')

require("dotenv").config();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 20 requests per windowMs
  message: 'Too many requests sent from this IP, please try again after 15 minutes'
});

const port = process.env.PORT || 3000

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

app.use(helmet())
app.use(limiter);
app.use("/static", express.static("static"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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
app.get('/register', register);
app.get("/filter", filters);
app.get("/login", login);
app.get("/profile", profile);
app.get("/likes", likes)

app.post("/results", filter);
app.post("/login", loginpost);
app.post("/like", likepost);
app.post('/register', registerpost)
app.post("/profile", profilepost)
app.post('/logout', logoutpost)

function home(req, res) {
  let { userId } = req.session;
  if (!userId) {
    res.render("home.ejs");
  } else {
    res.redirect('/results');
  }
}

function results(req, res, next) {
  db.collection('users').find({
    // This is where we find the userId and the gender & sexuality they want to filter on and we filter the rest of the people with the .find
    $and: [
      { firstName: { $ne: req.session.user.firstName } },
      { gender: req.session.user.filter['gender'] },
      { sexuality: req.session.user.filter['sexuality'] }
    ]
  }).toArray(done)
  function done(err, data) {
    if (err) {
      next(err)
    } else {
      // 
      res.render('visitors.ejs', { data: data })
    }
  }
}

function register(req, res) {
  res.render('register.ejs')
}

function filters(req, res) {
  res.render("filter.ejs");
}

function login(req, res) {
  res.render("login.ejs");
}


function profile(req, res) {
  // In this function we use the data from the current user aka the session 
  res.render('profile.ejs', { data: req.session.user })
}

async function likes(req, res) {
  const user = req.session.user;
  const promises = []; // create an array to store promises
  user.likedBy.forEach((likerId) => {
    // make a foreach for each like in likedBy array in db
    promises.push(
      db.collection("users").findOne({ _id: new ObjectID(likerId) })
    ); // For each like in the likedBy array, get the corresponding user from the database and push it as a promise to the promises[]
  });
  const likes = await Promise.all(promises);
  res.render('likes', { likes: likes, user })
}

async function loginpost(req, res) {

  const user = await db.collection('users').findOne({ email: req.body.email })

  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      req.session.user = user
      res.redirect('/results')
    } else {
      res.send('Login failed')
    }
  } catch (err) {
    console.log(err)
  }
}

// In this function we make sure the user can update it's haircolor and this wil be changed in the database

async function profilepost(req, res) {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)

  db.collection('users').updateOne(
    // First we find the userId aka the session and then we update the haircolor with the input from the user
    { firstName: req.session.user.firstName },
    {
      $set: {
        email: req.body.email,
        password: hashedPassword,
        age: req.body.age,
        hair: req.body.hair,
        gender: req.body.gender,
        sexuality: req.body.sexuality
      }
    })

  db.collection('users').findOne({ firstName: req.session.user.firstName }, done)
  function done(err, data) {
    if (err) {
      next(err)
    } else {
      req.session.userId = data
      res.redirect('/results')
    }
  }
}

function filter(req, res) {
  db.collection('users').updateOne(
    { firstName: req.session.user.firstName },
    { $set: { filter: req.body } })
  // This is where we find the userId aka the session so we update the preferences for the right user     
  db.collection('users').findOne({ firstName: req.session.user.firstName }, done)
  function done(err, data) {
    if (err) {
      next(err)
    } else {
      // This is where we redirect the user to the list of people with the filters on
      req.session.user = data
      res.redirect('/results')
    }
  }
}

async function registerpost(req, res, next) {

  const hashedPassword = await bcrypt.hash(req.body.password, 10)

  db.collection('users').insertOne({
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    email: req.body.email,
    password: hashedPassword,
    age: req.body.age,
    hair: req.body.hair,
    gender: req.body.gender,
    sexuality: req.body.sexuality,
    filter: { gender: "", sexuality: "" },
    visitedBy: [""],
    likedBy: [""]
  }, done)

  function done(err, data) {
    if (err) {
      next(err)
    } else {
      res.redirect('login')
    }
  }
}

async function likepost(req, res) {
  const id = req.body.id;
  const likedUser = await db
    .collection("users")
    .findOne({ _id: ObjectID(id) });
  if (likedUser.likedBy.includes(req.session.user._id)) {
    await db
      .collection("users")
      .updateOne(
        { _id: ObjectID(id) },
        { $pull: { likedBy: req.session.user._id } }
      );
    res.sendStatus(201);
  } else {
    await db
      .collection("users")
      .updateOne(
        { _id: ObjectID(id) },
        { $push: { likedBy: req.session.user._id } }
      );
    res.sendStatus(200);
  }
}

function logoutpost(req, res) {
  // This is where we destroy the session
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/results')
    } else {
      // This is where we clear the cookie and we redirect the user to the homepage
      res.clearCookie(process.env.SESS_NAME)
      res.redirect('/')
    }
  })
}

app.listen(port, () => console.log("Example app listening on port " + port));
