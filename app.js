"use strict";
// The different Node Libraries being used.
import express from 'express';
const app = express();
app.use(express.json());
import session from 'express-session';
import fs from 'fs';
import crypto from 'crypto';
import mysql from 'mysql2';
import bodyParser from 'body-parser';

app.use(bodyParser.json());

import usersRoutes from './routes/users.js';
import todoRoutes from './routes/todo.js';

// The mySQL database being connected to.
const databaseInfo = {
    host: "localhost",
    user: "root",
    password: "",
    database: "TODOAPI"
}


// Mapping file system paths to the app's virtual paths
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use(session(
    {
        secret: "sdkf;grdgsflksyjyowfnw",
        name: "TODO-Api-Session",
        resave: false,
        saveUninitialized: true,
    })
);
// Routes dealing with useraccounts
app.use('/users', usersRoutes);
// Routes dealing with todo items
app.use('/todo', todoRoutes);

//-----------------------------------------------------------------------------------------
// Hash Users Password for secure storage and to check for authenication.
//-----------------------------------------------------------------------------------------
async function hashPassword(password, callback) {
    let salt = crypto.randomBytes(64).toString('base64');
    let iterations = 100;
    let keylength = 64;
    crypto.pbkdf2(password, salt, iterations, keylength, 'sha512', (err, derivedKey) => {
        if (err) {
            console.log(err);
        } else {
            callback({
                salt: salt,
                hash: derivedKey.toString('hex'),
                iterations: iterations
            });
        }
    });
}

//----------------------------------------------------------------------------------------
// Checks the entered password against the hashed value stored.
//----------------------------------------------------------------------------------------
async function isPasswordCorrect(savedHash, savedSalt, savedIterations, passwordAttempt, callback) {
    crypto.pbkdf2(passwordAttempt, savedSalt, savedIterations, 64, 'sha512', (err, derivedKey) => {
        if (err) {
            console.log(err);
        } else {
            callback(savedHash == derivedKey.toString('hex'));
        }
    });
}

//------------------------------------------------------------------------------------------
// Non-Logged in users go to login page.
// Logged in users go to index.
//------------------------------------------------------------------------------------------
app.get("/login", function (req, res) {
    if (req.session.loggedIn) {
        res.redirect("/");
    } else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc)
    }
});

//----------------------------------------------------------------------------------------
// Tests the given login details against the database.
// Starts a session for the user if they have logged is sucessfully.
//----------------------------------------------------------------------------------------
app.post("/login", function (req, res) {
    function attemptLogin() {
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
            function (value) {
                if (req.body.username == null) {
                    res.send({ status: "fail", msg: "User Name not found." });
                    return;
                }
                if (req.body.password == null) {
                    res.send({ status: "fail", msg: "User password not found." });
                    return;
                }
                connection.execute(
                    "SELECT * FROM user_accounts WHERE username = ?",
                    [req.body.username],
                    function (error, results) {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            if (results[0] != null) {
                                isPasswordCorrect(results[0].pwHash, results[0].pwSalt, results[0].pwIterations, req.body.password, (correct) => {
                                    if (correct) {
                                        req.session.loggedIn = true;
                                        req.session.userID = results[0].userID;
                                        req.session.username = results[0].username;
                                        req.session.isAdmin = results[0].isAdmin;
                                        req.session.save(function (err) {
                                        });
                                        res.send({ status: "success", msg: "Logged in." });

                                    } else {
                                        res.send({ status: "fail", msg: "User account not found." });
                                    }
                                });
                            } else {
                                res.send({ status: "fail", msg: "User account not found." });
                            }
                        }
                    });
                connection.end();
            },
            function (error) {
                console.log(error);
            }
        );
    }
    attemptLogin();
});

//----------------------------------------------------------------------------------------
// End the user session on logout.
//----------------------------------------------------------------------------------------
app.get("/logout", function (req, res) {
    if (req.session) {
        req.session.destroy(function (error) {
            if (error) {
                res.status(400).send("Unable to log out")
            } else {
                res.redirect("/");
            }
        });
    }
})

//----------------------------------------------------------------------------------------
// End the user session via logout post.
//----------------------------------------------------------------------------------------
app.post("/logout", function (req, res) {
    if (req.session) {
        req.session.destroy(function (error) {
            if (error) {
                let reponse = {
                    status: "fail",
                    msg: "unable to logout"
                };
                res.send(reponse);
                res.status(400).send(reponse)
            } else {
                let reponse = {
                    status: "success",
                    msg: "Successfully Logged Out"
                };
                res.send(reponse);
            }
        });
    }
})

app.get("/", function (req, res) {
    if (!req.session.loggedIn) {
        res.redirect("/login");
    } else {
        let doc = fs.readFileSync("./app/html/index.html", "utf8");
        res.send(doc)
    }
});

//-------------------------------------------------------------------------------------------
// Creates new user accounts.
// Checks to see if account already exists first.
//-------------------------------------------------------------------------------------------
app.post("/create-account", function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    function tryConnection() {
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
                connection.query('SELECT * FROM user_accounts WHERE username = ?', [req.body.username], function (error, results, fields) {
                    if (error) {
                    }
                    if (results && results[0] != null) {
                        if (results[0].username == req.body.username) {
                            res.send({ status: "fail", msg: "Username Taken" });
                        } else {
                            console.log("This should only show if their are errors in the database lookups")
                        }
                        connection.end();
                    }
                    else {
                        hashPassword(req.body.password, (values) => {
                            //console.log('values', values)
                            connection.query('INSERT INTO user_accounts (username, pwHash, pwSalt, pwIterations) values (?, ?, ?, ?)',
                                [req.body.username, values.hash, values.salt, values.iterations],
                                function (error, results, fields) {
                                    if (error) {
                                        console.log("error from db", error);
                                        connection.end();
                                    } else {
                                        res.send({ status: "success", msg: "Account Created." });
                                        connection.end();
                                    }
                                });
                        });

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

    tryConnection()
});



// for page not found (i.e., 404)
app.use(function (req, res, next) {
    res.status(404).send("<html><head><title>Error 404</title></head><body><p>Error 404</p><p>Nothing here.</p></body></html>");
});

// RUN SERVER
let port = 8000;
app.listen(port, function () {
    console.log("Server running on port: " + port + "!");
});
