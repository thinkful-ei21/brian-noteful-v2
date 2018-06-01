const express = require('express');
const knex = require('knex');
const router = express.Router();

router.get('/folders', (req, res, next) => {
  knex.select('id', 'name')
    .from('folders')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get('/folders/:id', (req, res, next) =>{
  let id = req.params.id;

  knex
  .select('id')
  .from('folders')
  .then(results => {res.json(results);
  })
  .catch(err => next(err));
});
