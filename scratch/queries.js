'use strict';

const knex = require('../knex');

let searchTerm = 'gaga';
knex
  .select('notes.id', 'title', 'content')
  .from('notes')
  .modify(queryBuilder => {
    if (searchTerm) {
      queryBuilder.where('title', 'like', `%${searchTerm}%`);
    }
  })
  .orderBy('notes.id')
  .then(results => {
    console.log(JSON.stringify(results, null, 2));
  })
  .catch(err => {
    console.error(err);
  });
// ///////////////2.update/////////////////
// let id = '310696';
//   knex
//     .select()
//     .from('notes')
//     .where('id',id)
//     .then(x => x[0])
//
//     .then(results => {
//       console.log(JSON.stringify(results,null, 2));
//     })
//
// ///////////Update Note By Id accepts an ID and an object with the
// ///desired updates.
// //It returns the updated note as an object/////////////////
// knex('notes')
//  .update({
//    title: '',
//    content: ''
//   })
//   .where('id', id)
//   .then(results => {
//     console.log(JSON.stringify(results, null, 2));
//   })
//   .catch(err => {
//     console.error(err);
//   });
//
//
// ///Create a Note accepts an object with the note properties and inserts
// // it in the DB.
//  //It returns the new note (including the new id) as an object. WRONG ANS
// let obj = {'more stuff'};
//   knex
//    
//     .from('notes')
//     .insert({obj})
//     .then(results => {
//       console.log(JSON.stringify(results,null, 2));
//     })
//
//
//
//
//
// ////Delete Note By Id accepts an ID and deletes the note from the DB.
// knex('notes')
//  .where('notes.id', '1005')
//    .del()
//    .then(results => {
//     console.log(JSON.stringify(results, null, 2));
//   })
//   .catch(err =>{
//    console.error(err);
//   });
