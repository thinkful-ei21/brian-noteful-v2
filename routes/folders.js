'use strict';

const express = require('express');
const knex = require('knex');
const folderRouter = express.Router();

////////get every note///////
folderRouter.get('/', (req, res, next) => {

  knex.select('id', 'name')
    .from('folders')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});
 

////////////get folder by id//////////
folderRouter.get('/:id', (req, res, next) => {
  let id = req.params.id;

  knex.select('id')
    .from('folders')
    .where('id', id)
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});


/////////Update Folder The noteful 
//app does not use this endpoint but we'll create it in order to round out our API////



///Create a Folder accepts an
//object with a name and inserts it in the DB. Returns the new item along the new id.

folderRouter.post('/', (req, res, next) => {
  const { name } = req.body;
  console.log(name);
  const newItem = { name};
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex
    .from('folders')
    .insert(newItem)

    .then(result => {

      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      next(err);
    });
  });
  //Delete Folder 
  //By Id accepts an ID and deletes the folder from the DB and then returns a 204 status.

  folderRouter.delete('/:id', (req, res, next) => {
    const id = req.params.id;

    knex
      .where('id', id)
      .del()
      .then(() => {
        res.sendStatus(204);
      })
      .catch(err => {
        next(err);
      });
  });

module.exports = folderRouter;