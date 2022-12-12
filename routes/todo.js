import express from "express";
const router = express.Router();
import mysql from 'mysql2';

//Routes here start with /todo

//----------------------------------------------------------------------------
// A get without any parameters will return the logged in users own TODO's.
//----------------------------------------------------------------------------
router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        function getTODOs() {
            let connection;
            let myPromise = new Promise((resolve, reject) => {  
                connection = mysql.createConnection({
                    host: "localhost",
                    user: "root",
                    password: "",
                    database: "TODOAPI"
                });  
                connection.connect(err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });   
            });
    
            myPromise.then(
                async function (value) {
                    console.log("id", req.session.userID);
                    connection.query('SELECT * FROM todo_item WHERE ownerID = ?', [req.session.userID], function (error, results, fields) {
                        if (error) {
                        }
                        if (results && results[0] != null) {
                            let responseJSON = {
                                status: "success",
                                msg: "Successfully retrieve TODOs",
                                TODOs: results,
                            }
                            connection.end();
                            res.send(responseJSON);
                        } else {
                            connection.end();
                            let responseJSON = {
                                status: "success",
                                msg: "No Events were found"
                            }
                            res.send(responseJSON);
                        }

                    });
    
                },
                function (error) {
                    connection.end();
                    //console.log(error);
                    res.send({ status: "database-fail", msg: "database not found" });
                }
            );
        }
    
        getTODOs();

    } else {
        let responseJSON = {
            status: "fail",
            msg: "user not logged in."
        };
        res.send(responseJSON);
    }
});

//----------------------------------------------------------------------------
// For getting TODO items by using usernames.
//----------------------------------------------------------------------------
router.get('/:name', (req, res) => {
    const { name } = req.params;
    console.log(name);
    if (req.session.loggedIn) {
        function getTODOs() {
            let connection;
            let myPromise = new Promise((resolve, reject) => {    
                connection = mysql.createConnection({
                    host: "localhost",
                    user: "root",
                    password: "",
                    database: "TODOAPI"
                });    
                connection.connect(err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });   
            });
    
            myPromise.then(
                async function (value) {
                    connection.query(`SELECT ti.itemID, ua.username, ti.todo_description, ti.todo_type, ti.creationTime
                        FROM todo_item as ti, user_accounts as ua
                        WHERE ti.ownerID = ua.userID AND ua.username = ?;`, [name], function (error, results, fields) {
                        if (error) {
                        }
                        if (results && results[0] != null) {
                            let responseJSON = {
                                status: "success",
                                msg: "Successfully retrieve TODOs",
                                TODOs: results,
                            }
                            connection.end();
                            res.send(responseJSON);
                        } else {
                            connection.end();
                            let responseJSON = {
                                status: "success",
                                msg: "No Events were found"
                            }
                            res.send(responseJSON);
                        }

                    });
    
                },
                function (error) {
                    connection.end();
                    //console.log(error);
                    res.send({ status: "database-fail", msg: "database not found" });
                }
            );
        }
    
        getTODOs();

    } else {
        let responseJSON = {
            status: "fail",
            msg: "user not logged in."
        };
        res.send(responseJSON);
    }
});

export default router;