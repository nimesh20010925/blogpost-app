const router = require('express').Router();
const controller = require('../controllers/commentController');

router.post('/:postId', controller.addComment);
router.get('/:postId', controller.getComments);

module.exports = router;
