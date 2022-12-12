import express from "express";
const router = express.Router();
import mysql from 'mysql2';
import {getUserTODOs, getAllTODOs, deleteTODO, patchTODO, createTODO, searchForTODOs} from '../controllers/todo.js'

//All Routes here start with /todo



//----------------------------------------------------------------------------
// A get without any parameters will all the TODO's.
//----------------------------------------------------------------------------
router.get('/', getAllTODOs);


//----------------------------------------------------------------------------
// For getting TODO items by using usernames.
//----------------------------------------------------------------------------
router.get('/user/:name', getUserTODOs);

//----------------------------------------------------------------------------
// For searching for TODOs
//----------------------------------------------------------------------------
router.get('/search', searchForTODOs);

//----------------------------------------------------------------------------
// For deleting TODOs
// Must be owner of TODO or Admin to delete a TODO
//----------------------------------------------------------------------------
router.delete('/:name/:id', deleteTODO);


//----------------------------------------------------------------------------
// For partially updating TODOs
// Must be owner of TODO or Admin to update a TODO
//----------------------------------------------------------------------------
router.patch('/:name/:id', patchTODO);

//----------------------------------------------------------------------------
// Creating new TODOs
// Must be logged in to create a TODO
//----------------------------------------------------------------------------
router.post('/', createTODO);

export default router;