const { validationResult } = require('express-validator');
const postCommentsService = require('../services/postComments');
const handlers = require('../helpers/handlers');
const { Comment } = require('../models/comments');

/**
 * Post comments retrieval controller
 */
const getComments = handlers.asyncHandler(async (request, response) => {
  try {
    const { id } = request.params;
    await postCommentsService.retrieveAll(id, (error, data) => {
      if (error) {
        console.log(error);
        return response.status(error.code).json(error);
      }
      return response.status(data.code).json(data);
    });
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json(
        handlers.responseHandler(
          false,
          500,
          'An error occurred during comments retrieval',
          null,
        ),
      );
  }
});

/**
 * Post comments creation controller
 */
const createComment = handlers.asyncHandler(async (request, response) => {
  const errors = validationResult(request);
  if (errors.isEmpty()) {
    try {
      const comment = Comment({
        content: request.body.content,
        userId: request.user.id,
        postId: request.params.id,
      });
      await postCommentsService.create(comment, (error, data) => {
        if (error) {
          console.log(error);
          return response.status(error.code).json(error);
        }
        return response.status(data.code).json(data);
      });
    } catch (error) {
      console.log(error);
      return response
        .status(500)
        .json(
          handlers.responseHandler(
            false,
            500,
            'An error occurred during comment creation',
            null,
          ),
        );
    }
  } else {
    return response
      .status(400)
      .json(handlers.responseHandler(false, 400, errors.array()[0]?.msg, null));
  }
});

module.exports = {
  getComments,
  createComment,
};
