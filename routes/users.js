import express from "express";
const router = express.Router();


// Routes in here start with /users

//-------------------------------------------------------------------
// Only Admins should be able to get list of users
//-------------------------------------------------------------------
router.get('/', (req, res) => {
    if (req.session.loggedIn && req.session.isAdmin) {
        console.log('List of all users');
    }
    console.log("Only admins can request all users");
    let responseJSON = {
        answer: "This is the reponse as JSON"
    };
    res.send(responseJSON);
});

export default router;