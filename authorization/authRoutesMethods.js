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
        login: login
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
    console.log('authRoutesMethods: registerUser: req.body is:', req.body);

    // Query db to see if the user exists already
    userDBHelper.doesUserExist(req.body.username, (sqlError, doesUserExist) => {
        // Check if the user exists
        if (sqlError !== null || doesUserExist) {
            // Message to give summary to client
            const message = sqlError !== null ? "Operation unsuccessful" : "User already exists";

            // Detailed error message from callback
            const error = sqlError !== null ? sqlError : "User already exists";

            sendResponse(res, message, sqlError);

            return;
        }

        // Register the user in the db
        userDBHelper.registerUserInDB(req.body.username, req.body.password, dataResponseObject => {
            // Create message for the api response
            const message = dataResponseObject.error === null ? "Registration was successful" : "Failed to register user";
            sendResponse(res, message, dataResponseObject.error);
        })
    });
}

function login(registerUserQuery, res) {

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

