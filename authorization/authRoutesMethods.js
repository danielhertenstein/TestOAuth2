/* The userDBHelper is an object which will handle all of the user related db
    operations such as saving new users or retrieving existing ones. You can find
    it in userDBHelper.js in this projects databaseHelpers folder.
 */
let userDBHelper;

/**
 *
 * This module exports a function which registers users by using
 * the specified injectedUserDBHelper.
 *
 * @param injectedUserDBHelper - this object handles the execution of user
 * related database operation such as storing them when they register
 *
 * @return {{registerUser: registerUser, login: *}}
 */
module.exports = injectedUserDBHelper => {

    // assign the injectedUserDBHelper to the file's userDBHelper
    userDBHelper = injectedUserDBHelper;

    return {
        registerUser: registerUser,
    }
};

/**
 *
 * Handles the requests to register a user. The request's body will contain
 * a username and password. The method which will check if the user exists,
 * if they do exist then we will notify the client of this, and if they don't
 * exist then we will attempt to register the user, and then send the client a
 * response notifying them of whether or not the user was successfully registered.
 *
 * @param req - request from api client
 * @param res - response to respond to client
 */
function registerUser(req, res) {
    // get the username and password:
    const username = req.body.username;
    const password = req.body.password;

    // validate the request
    if (!isString(username) || !isString(password)) {
        return sendResponse(res, "Invalid Credentials", true);
    }

    // query db to see if the user exists already
    userDBHelper.doesUserExist(username).then(doesUserExist => {

        // check if the user doesn't exist
        if (doesUserExist === false) {

            /* now that we know the user doesn't exist, we attempt to store them in
            the database. The userDBHelper.registerUserInDB() method returns a
            promise which will only resolve if we have successfully stored the user
             */
            return userDBHelper.registerUserInDB(username, password);
        } else {
            // throw an error to break out of the promise chain
            throw new Error('User already exists');
        }
    }).then(

        /* This stage of the promise chain is reached if we successfully
        stored the user. Therefore, we know that we did successfully store
        the user we send the response to the client notifying them of this. */
        sendResponse(res, "Registration was successful", null)
    ).catch(error => {

        /* If this part of the code gets called then we failed to register
        the user either because they already exist, or because we failed to save
        them in the db. So we notify the client that we failed to register the user.
         */
        sendResponse(res, "Failed to register user", error)
    });
}

/**
 *
 * Sends a response created out of the specified parameters to the client.
 *
 * @param res - response to respond to client
 * @param message - message to send to client
 * @param error - error to send to the client
 */
function sendResponse(res, message, error) {

    /* Here we create the status code to send the client depending on whether
    or not the error being passed in is null. Then, we create and send
    the json object response to the client.
     */
    res.status(error != null ? error != null ? 400 : 200 : 400)
        .json({
            'message': message,
            'error': error,
        });
}

/**
 *
 * Returns true the specified parameters is a string else it returns false
 *
 * @param parameter - the variable we're checking is a String
 * @return {boolean}
 */
function isString(parameter) {
    return parameter != null && (typeof parameter === "string" || parameter instanceof String);
}