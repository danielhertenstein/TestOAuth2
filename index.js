// MARK: -------------------- REQUIRED OBJECTS

/* Create the port that we're connecting to */
const port = 8080;

/* Get a connection to the mySql database */
const mySqlConnection = require('./dbHelpers/mySqlWrapper');

/* The bearerTokenDBHelper handles all of the database operations
relating to saving and retrieving oAuth2 bearer tokens */
const bearerTokensDBHelper = require('./dbHelpers/bearerTokensDBHelper')(mySqlConnection);

/* The userDBHelper handles all of the database operations relating
to users such as registering and retrieving them */
const userDBHelper = require('./dbHelpers/userDBHelper')(mySqlConnection);

/* This is a library used to help parse the body of the api requests. */
const bodyParser = require('body-parser');

// Require express
const express = require('express');

// Initialize the express app
const expressApp = express();

// Here we require the authRoutesMethods object from the module that we just made
const authRoutesMethods = require('./authorization/authRoutesMethods')(userDBHelper);

// Now we instantiate the authRouter module and inject all of its dependencies
const authRouter = require('./authorization/authRouter')(express.Router(), expressApp, authRoutesMethods);

// MARK: -------------------- REQUIRED OBJECTS


// MARK: -------------------- SET UP MIDDLEWARE

/* Set the bodyParser to parse the urlencoded post data */
expressApp.use(bodyParser.urlencoded({extended: true}));

// MARK: -------------------- SET UP MIDDLEWARE

// MARK: -------------------- INITIALIZE THE SERVER

// init the server
expressApp.listen(port, () => {
    console.log('listening on port ${port}');
});

// MARK: -------------------- INITIALIZE THE SERVER
