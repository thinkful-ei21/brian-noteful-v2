'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const notesRouter = express.Router();

// TEMP: Simple In-Memory Database
// const data = require('../db/notes');
// const simDB = require('../db/simDB');
// const notes = simDB.initialize(data);

const knex = require('../knex');
// Get All (and search by query)/////////////////////
notesRouter.get('/', (req, res, next) => {
  const { searchTerm, folderId } = req.query;
  
  knex.select('notes.id', 'title', 'content', 'folders.id as folderId', 'folders.name as folderName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .modify(function (queryBuilder) {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .modify(function (queryBuilder) {
      if (folderId) {
        queryBuilder.where('folder_id', folderId);
      }
    })
    .orderBy('notes.id')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
 
  
});

  // Get a single item///////////////////////
  notesRouter.get('/:id', (req, res, next) => {
    const id = req.params.id;

    knex
      .select('notes.id', 'title', 'content', 'folders.id as folderId', 'folders.name as folderName')
      .from('notes')
      .leftJoin('folders', 'notes.folder_id', 'folders.id')
      .where('id', id)
      .then(x => x[0])
      .then(results => {
        if (results) {
          res.json(results).status(200);
        } else {
          res.status(404).send('note not found');
        }
      })
      .catch(err => {
        next(err);
      });

  });



 // Put update an item//////////////////
 notesRouter.put('/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['title', 'content'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  let noteId;
  knex('notes')

    .where('id', `${id}`)
    .update(updateObj)
    .returning('id')
    .then(([id]) => {
      noteId = id;
      return knex
        .select('notes.id', 'notes.title', 'notes.content', 'folder_id as folderId', 'folders.name as folderName')
        .from('notes')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .where('notes.id', noteId);
    })

    .then(([result]) => res.json(result)).catch(err => next(err));

});


 // CREATE item//////////////////////////
 notesRouter.post('/', (req, res, next) => {
  const { title, content, folderId } = req.body;
  console.log(title, content);
  const newItem = { 
    title: title,
    content: content,
    folder_id: folderId 
  };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  console.log(`${newItem}`);

  let noteId;
  knex.insert(newItem)
  .into('notes')
  .returning('id')
  .then(([id]) => {
    noteId = id;
    // Using the new id, select the new note and the folder
    return knex.select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName')
      .from('notes')
      .leftJoin('folders', 'notes.folder_id', 'folders.id')
      .where('notes.id', noteId);
  })
  .then(([result]) => {
    res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
  })
  .catch(err => next(err));
    
});

  // Delete an item//////////////////////
  notesRouter.delete('/:id', (req, res, next) => {
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

module.exports = notesRouter;
