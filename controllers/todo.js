
import mysql from 'mysql2';

// The mySQL database being connected to.
const databaseInfo = {
    host: "localhost",
    user: "root",
    password: "",
    database: "TODOAPI"
}

//----------------------------------------------------------------------------
// For getting TODO items by using usernames.
//----------------------------------------------------------------------------
export const getUserTODOs = (req, res) => {
    const { name } = req.params;

    if (req.session.loggedIn) {
        function getTODOs() {
            let connection;
            let myPromise = new Promise((resolve, reject) => {    
                connection = mysql.createConnection(databaseInfo);    
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
}

//----------------------------------------------------------------------------
// A get without any parameters will return all the TODO's.
//----------------------------------------------------------------------------
export const getAllTODOs = (req, res) => {
    if (req.session.loggedIn) {
        function getTODOs() {
            let connection;
            let myPromise = new Promise((resolve, reject) => {  
                connection = mysql.createConnection(databaseInfo);  
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
                                        WHERE ti.ownerID = ua.userID;`,
                        function (error, results, fields) {
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
}

//----------------------------------------------------------------------------
// For deleting TODOs
// Must be owner of TODO or Admin to delete a TODO
//----------------------------------------------------------------------------
export const deleteTODO = (req, res) => {
    const { name, id } = req.params;

    if (req.session.loggedIn && (req.session.userName == name || req.session.isAdmin)) {
        function deleteTODOs() {
            let connection;
            let myPromise = new Promise((resolve, reject) => {    
                connection = mysql.createConnection(databaseInfo);    
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
                    connection.query(`DELETE FROM todo_item
                                        WHERE itemID = ?
                                        LIMIT 1;`, [id],
                        function (error, results, fields) {
                        if (error) {
                        }
                        if (results.affectedRows) {
                            let responseJSON = {
                                status: "success",
                                msg: `Successfully deleted TODO #${id}`,
                            }
                            connection.end();
                            res.send(responseJSON);
                        } else {
                            connection.end();
                            let responseJSON = {
                                status: "fail",
                                msg: "No Events were found to delete"
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
    
        deleteTODOs();

    } else {
        let responseJSON = {
            status: "fail",
            msg: "user does not have permission to do this."
        };
        res.send(responseJSON);
    }
}

//----------------------------------------------------------------------------
// For partially updating TODOs
// Must be owner of TODO or Admin to update a TODO
//----------------------------------------------------------------------------
export const patchTODO = (req, res) => {
    const { name, id } = req.params;
    var { todo_description, todo_type} = req.body;

    if (req.session.loggedIn && (req.session.userName == name || req.session.isAdmin)) {
        function patchTODOs() {
            let connection;
            let myPromise = new Promise((resolve, reject) => {    
                connection = mysql.createConnection(databaseInfo);    
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
                    if (todo_description) {

                    }
                    connection.query(`SELECT *
                                        FROM todo_item
                                        WHERE itemID = ?;`, [id], 
                        function (error, results, fields) {
                            if (error) {                                
                            }
                            if (results[0]) {
                                if (!todo_description) {
                                    todo_description = results[0].todo_description;
                                } else {
                                    results[0].todo_description = todo_description;
                                }
                                if (!todo_type)  {
                                    todo_type = results[0].todo_type;
                                } else {
                                    results[0].todo_type = todo_type;
                                }
                                let updatedTODO = results[0];

                                connection.query(`UPDATE todo_item
                                                    SET todo_description = ?, todo_type = ?
                                                    WHERE itemID = ?;`, [todo_description, todo_type, id],
                                    function (error, results, fields) {
                                        if (error) {
                                        }
                                        if (results) {
                                            connection.end();
                                            let responseJSON = {
                                                status: "success",
                                                msg: `Successfully updated TODO #${id}`,
                                                TODO: updatedTODO
                                            }
                                            res.send(responseJSON);
                                        } else {
                                            connection.end();
                                            let responseJSON = {
                                                status: "fail",
                                                msg: "No Events were found to delete"
                                                }
                                            res.send(responseJSON);
                                        }
        
                                });
                            }
                        })
                      
                },
                function (error) {
                    connection.end();
                    //console.log(error);
                    res.send({ status: "database-fail", msg: "database not found" });
                }
            );
        }
    
        patchTODOs();

    } else {
        let responseJSON = {
            status: "fail",
            msg: "user does not have permission to do this."
        };
        res.send(responseJSON);
    }
}

//----------------------------------------------------------------------------
// Creating new TODOs
// Must be logged in to create a TODO
//----------------------------------------------------------------------------
export const createTODO = (req, res) => {
    var { todo_description, todo_type} = req.body;
    if (!todo_description) {
        let responseJSON = {
            status: "fail",
            msg: "missing TODO description"
        }
        res.send(responseJSON);
    } else if (!todo_type) {
        let responseJSON = {
            status: "fail",
            msg: "missing TODO type"
        }
        res.send(responseJSON);
    } else if (req.session.loggedIn) {
        function deleteTODOs() {
            let connection;
            let myPromise = new Promise((resolve, reject) => {    
                connection = mysql.createConnection(databaseInfo);    
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
                    connection.query(`INSERT INTO todo_item (ownerID, todo_description, todo_type)
                                            VALUES (?, ?, ?);`, [req.session.userID, todo_description, todo_type],
                        function (error, results, fields) {
                        if (error) {
                        }
                        if (results.affectedRows) {
                            let responseJSON = {
                                status: "success",
                                msg: `Successfully created TODO`,
                            }
                            connection.end();
                            res.send(responseJSON);
                        } else {
                            connection.end();
                            let responseJSON = {
                                status: "fail",
                                msg: "No TODOs were created"
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
    
        deleteTODOs();

    } else {
        let responseJSON = {
            status: "fail",
            msg: "user does not have permission to do this."
        };
        res.send(responseJSON);
    }
}

