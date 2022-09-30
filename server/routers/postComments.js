const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const commentsController = require("../controllers/comments");
const auth = require("../middleware/auth");

/**
 *  @route    GET /api/posts/comments/<post_id>
 *  @desc     get all comments for the specified post
 *  @access   Private
 */
router.route("/:id").get(commentsController.getComments);

/**
 *  @route    POST /api/posts/comments/<post_id>
 *  @desc     create a new comment, required parameter is [content]
 *  @access   Private
 */
router
	.route("/:id")
	.post(
		auth,
		check("content", "Comment was not provided").not().isEmpty(),
		commentsController.createComment
	);
module.exports = router;
