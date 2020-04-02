const express = require('express')
const bodyParser = require('body-parser')
const mongo = require('mongodb')
const ObjectID  = mongo.ObjectID;
const session = require('express-session')
require('dotenv').config()

const app = express()

const port = 3000

const TWO_HOURS = 1000 * 60 * 60 * 2

// THIS IS THE CODE FOR THE CONNECTION WITH THE DATABASE
let db = null
let url = process.env.DB_URL

mongo.MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client){
    if (err) {
        throw err
    }
    db = client.db(process.env.DB_NAME)
})

// THIS IS WHERE THE CODE FOR THE DATABASE ENDS


app.use('/static',express.static('static'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: TWO_HOURS,
        sameSite: true
    }
}))

app.set('view engine' , 'ejs')

app.get('/', home)
app.get('/results', people)
app.get('/filter', filters)
app.get('/login', login)

app.post('/results', filter)
app.post('/login', loginpost)

function home(req,res){
    console.log(req.session)
    let { userId } = req.session
    if(userId = null){
        res.render('home.ejs')
    } else{
        res.render('homeSecond.ejs')
    }
}

function filters(req,res){
    res.render('filter.ejs')
}

function login(req,res){
    res.render('login.ejs')
}

function loginpost(req,res){
    const email = res.body.email
    const password = res.body.password
    if (email && password){
        const user = db.collection('datingapp').find(user => user.email === email && user.password === password)
        if (user){
            req.session.userId = data._id
            return res.redirect('/results')
        }
    }
    res.redirect('/login')
}


function people(req, res, next){
    db.collection('datingapp').find({}).toArray(done)
        function done(err, data){
            if (err){
                next(err)
            } else {
                console.log(data);
                res.render('index.ejs', {data: data})
            }
        }
}

function filter(req,res){
    
    let sexualityFilter = req.body.sexuality
    let genderFilter = req.body.gender

    db.collection('datingapp').find({gender: genderFilter, sexuality: sexualityFilter}).toArray(done)
        function done(err, data){
            if (err){
                next(err)
            } else {
                console.log(data);
                res.render('index.ejs', {data: data})
            }
        }
     
}

app.listen(port,() => console.log('Example app listening on port' + port))