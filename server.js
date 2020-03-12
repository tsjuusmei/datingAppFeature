


// const movies = [ {
//     id : 'catch-me-if-you-can',
//     title : 'Catch me if you can',
//     plot : 'A seasoned FBI agent pursues Frank Abagnale Jr. who, before his 19th birthday, successfully forged millions of dollars',
//     description : 'He poses as a doctor, professor, lawyer and pilot, and no one ever doubts his abilities. But in the meantime Frank, barely twenty years old, lights everyone up and disappears time and again without leaving a trace. Until the police open an international manhunt. Based on the true story of Frank Abagnale, a counterfeiter and master scammer who, before he was 21, wrote millions of dollars in fake checks and then spent the money just as easily.',
// },
// {
//     id : 'knives-out',
//     title : 'Knives out',
//     plot : 'A detective investigates the death of a patriarch of an eccentric, combative family.',
//     description : 'Writer Harlan Thrombey is found dead in his house, just after his 85th birthday. Detective Benoit Blanc is called in to solve the mystery, which is quite a challenge. Harlan has rather strange and suspicious family members and also a number of staff members who served him when he was alive.',
// },
// {
//     id : 'titanic',
//     title : 'Titanic',
//     plot : 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
//     description : 'De 17-jarige rijke Rose DeWitt Bukater wordt door haar familie gedwongen om zich met Cal Hockley te verloven en binnenkort te gaan trouwen. Tijdens de eerste tocht over de Atlantische zee van de Titanic, een gigantisch passagiersschip dat onzinkbaar wordt geacht, besluit ze zelfmoord te plegen. Ze wordt echter gered door Jack Dawson, een derde klasse-passagier. Ondanks hun totaal verschillende afkomst worden ze vrienden en al snel groeit de liefde tussen hen allebei. ',
// }
// ]


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
app.get('/', movies)
// app.get('/:id', movie)
app.get('/add', form)
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

function form(req,res){
    res.render('add.ejs', {data: data})
}

function add(req,res){
    const id = slug(req.body.title).toLowerCase()

    movies.push({
        id: id,
        title : req.body.title,
        plot : req.body.plot,
        description : req.body.description 
    })
    res.redirect('/' + id)
}

function movies(req, res, next){
    db.collection('datingapp').find().toArray(done)
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