const express = require('express');
const expHbs = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db/connection');
const Job = require('./models/Job')
const path = require('path')

const PORT = 3000;

app.listen(PORT, function () {
    console.log(`O express está rodando na porta ${PORT}`);
});

// body parser
app.use(bodyParser.urlencoded({ extended: false }));

// handle bars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', expHbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//static folder
app.use(express.static(path.join(__dirname, 'public')));

// db connection
db
    .authenticate()
    .then(() => {
        console.log('Conectou ao banco com sucesso');
    })
    .catch(err => {
        console.log("O correu um erro ao conectar", err);
    })

// routes
app.get('/', (req, res) => {
    Job.findAll({
        order: [
            ['createdAt', 'DESC']
        ]
    })
        .then(jobs => {
            res.render('index', {
                jobs
            });
        })
        .catch(err => {
            console.log("O correu um erro:" + err)
        });
});

// jobs routes
app.use('/jobs', require('./routes/jobs'))