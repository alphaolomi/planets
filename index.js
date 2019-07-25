const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));

// Connect to MongoDB
mongoose
    .connect(
        'mongodb://mongo:27017/planets',
        {useNewUrlParser: true}
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const Planet = require('./models/Planet');

app.get('/', (req, res) => {
    Planet.find()
        .then(items => res.render('index', {items}))
        .catch(err => res.status(404).json({msg: 'No planets found.'}));
});

app.post('/planet/add', (req, res) => {
    const newPlanet = new Planet({
        name: req.body.name
    });

    newPlanet.save().then(item => res.redirect('/'));
});

const port = 3000;

app.listen(port, () => console.log('Server running...'));
