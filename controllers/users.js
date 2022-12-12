import mysql from 'mysql2';

// The mySQL database being connected to.
const databaseInfo = {
    host: "localhost",
    user: "root",
    password: "",
    database: "TODOAPI"
}


//----------------------------------------------------------------------------
// THe list of all user accounts
//----------------------------------------------------------------------------
export const getAllUsers = (req, res) => {
    if (req.session.loggedIn && req.session.isAdmin) {
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
                    connection.query(`SELECT userID, username, isAdmin, creationTime
                                        FROM user_accounts;`,
                        function (error, results, fields) {
                        if (error) {
                        }
                        if (results && results[0] != null) {
                            let responseJSON = {
                                status: "success",
                                msg: "Successfully retrieved all users",
                                TODOs: results,
                            }
                            connection.end();
                            res.send(responseJSON);
                        } else {
                            connection.end();
                            let responseJSON = {
                                status: "success",
                                msg: "No users were found"
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
            msg: "You don't have permission to do this"
        };
        res.send(responseJSON);
    }
}