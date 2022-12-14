const jwt = require('jsonwebtoken');
const config = require('../config/keys.config');
const handlers = require('../helpers/handlers');
const getTokenUser = require('./getTokenUser');

/**
 * @desc checks if current token is valid and the user
 * 			 logged in and add user object to request
 * @param {*} request
 * @param {*} response
 * @param {*} callback
 */
const auth = async (request, response, callback) => {
  const token = request.header('x-auth-token');
  const user = await getTokenUser(token);
  if (token && user) {
    try {
      jwt.verify(token, config.JWT.SECRET, (error, decoded) => {
        if (error) {
          console.log(error);
          return response
            .status(400)
            .json(
              handlers.responseHandler(
                false,
                400,
                'An error occurred while checking if user is logged in',
                null,
              ),
            );
        }
        request.user = user;

        callback();
      });
    } catch (error) {
      console.log(error);
      return response
        .status(500)
        .json(
          handlers.responseHandler(
            false,
            500,
            'An error occurred while checking if user is logged in',
            null,
          ),
        );
    }
  } else {
    return response
      .status(401)
      .json(
        handlers.responseHandler(
          false,
          403,
          'You should login to perform this action',
          null,
        ),
      );
  }
};

module.exports = auth;
