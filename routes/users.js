import express from "express";
const router = express.Router();
import {getAllUsers} from "../controllers/users.js"

// Routes in here start with /users

//-------------------------------------------------------------------
// Only Admins should be able to get list of users
//-------------------------------------------------------------------
router.get('/', getAllUsers);

export default router;