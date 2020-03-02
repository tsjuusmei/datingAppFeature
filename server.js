
const data = {
    persoon : 'Anna',
    leeftijd : 20,
    thuis : 'Amsterdam',
}






const express = require('express')
const app = express()
const port = 3000
const path = require('path')

app.use('/static',express.static('static'))

app.set('view engine' , 'ejs')

app.get('/',(req,res) => res.render('index.ejs',{data: data}))

// app.get('/', (req, res) => res.sendfile(path.join(__dirname + '/static/index.html')))
app.get('/about',(req, res) => res.send('De about pagina bitches'))
app.get('/contact',(req, res) => res.send('De contact pagina'))

app.listen(port,() => console.log('Example app listening on port' + port))