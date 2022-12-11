"use strict";


ready(function () {

    // For requesting to login an already existing account.
    document.getElementById("loginBtn").addEventListener("click", async function (e) {
        e.preventDefault();
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        // Combine all data into a JSON object
        let loginInfo = {
            username: username,
            password: password
        }

        try {
            let responseObject = await fetch(`/login`, {
                method: 'POST',
                headers: { "Accept": 'application/json',
                           "Content-Type": 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            
            let parsedJSON = await responseObject.json();
            if (parsedJSON.status == "success") {
                window.location.href = "/"; 
            }

            if (parsedJSON.status == "fail") {
                document.getElementById("no-match").classList.remove("no-show");
                document.getElementById("account-created").classList.add("no-show");
                document.getElementById("account-taken").classList.add("no-show");
            } 
        } catch(error) {
            console.log(error);
        }
    });

    // For requesting the creation of a new account
    document.getElementById("signupBtn").addEventListener("click", async function (e) {
        e.preventDefault();
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        // Combine all data into a JSON object
        let loginInfo = {
            username: username,
            password: password
        }
        document.getElementById("password").value = "";

        try {
            let responseObject = await fetch(`/create-account`, {
                method: 'POST',
                headers: { "Accept": 'application/json',
                           "Content-Type": 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            
            let parsedJSON = await responseObject.json();
            if (parsedJSON.status == "success") {
                document.getElementById("account-created").classList.remove("no-show");
                document.getElementById("account-taken").classList.add("no-show");
                document.getElementById("no-match").classList.add("no-show");
            }

            if (parsedJSON.status == "fail") {
                document.getElementById("account-taken").classList.remove("no-show");
                document.getElementById("account-created").classList.add("no-show");
                document.getElementById("no-match").classList.add("no-show");
            } 
        } catch(error) {
            console.log(error);
        }
    });

});


function ready(callback) {
    if (document.readyState != "loading") {
        callback();
        //console.log("ready state is 'complete'");
    } else {
        document.addEventListener("DOMContentLoaded", callback);
        //console.log("Listener was invoked");
    }
}
