const express = require('express')
const slug = require('slug')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const path = require('path')
const mongo = require('mongodb')

require('dotenv').config()

let db = null
let url = 'mongodb+srv://asd123:asd123@datingapp-ishqp.mongodb.net/test?retryWrites=true&w=majority'


mongo.MongoClient.connect(url, function(err, client){
    if (err) {
        throw err
    }
    db = client.db(process.env.DB_NAME)
})


app.use('/static',express.static('static'))
app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine' , 'ejs')

// app.get('/',(req,res) => res.render('index.ejs',{data: movies}))
app.get('/', people)
// app.get('/:id', movie)
// app.get('/add', form)
app.get('/filter', filters)
app.get('/static', (req, res) => res.sendfile(path.join(__dirname + '/static/index.html')))
app.get('/about',(req, res) => res.send('De about pagina bitches'))
app.get('/contact',(req, res) => res.send('De contact pagina'))

app.post('/', add)

// app.delete('/:id', remove)

// function movie(req,res,next){
//     const id = req.params.id
//     var movie = find(movies, function (value) {
//         return value.id === id
//       })
//       if (!movie) {
//         next()
//         return
//       }
//       res.render('detail.ejs', {data: data})
// }

// function form(req,res){
//     res.render('add.ejs', {data: data})
// }

function filters(req,res){
    res.render('filter.ejs')
}

function add(req,res){
    const id = slug(req.body.title).toLowerCase()

    data.push({
        id: id,
        title : req.body.title,
        plot : req.body.plot,
        description : req.body.description 
    })
    res.redirect('/')
}

// const genderChecked = document.querySelector('input[name=gender]:checked')
// const sexualityChecked = document.querySelector('input[name=sexuality]:checked')


let sexualityFilter = 'Straight'
// let genderFilter = "Women"

function people(req, res, next){
    db.collection('datingapp').find({sexuality: sexualityFilter}).toArray(done)
        function done(err, data){
            if (err){
                next(err)
            } else {
                console.log(data);
                res.render('index.ejs', {data: data})
            }
        }
}



// function remove




app.listen(port,() => console.log('Example app listening on port' + port))