
const Planet = require('../models/Planet');

async function index(req, res, next) {
  try {
    Planet.find()
      .then(items => res.status(200).render('planets', { items }))
      .catch(err => res.status(404).json({ msg: 'No planets found.' }));
  } catch (error) {
    next(error);
  }
}

async function store(req, res, next) {
  try {
    const newPlanet = new Planet({
      name: req.body.name
    });

    newPlanet.save().then(item => res.redirect('/planets'));
  } catch (error) {
    next(error);
  }
}

module.exports.index = index;
module.exports.store = store;
