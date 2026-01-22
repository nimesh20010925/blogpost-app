const router = require('express').Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/postController');

router.post('/', auth, controller.createPost);
router.put('/:id', auth, controller.updatePost);
router.delete('/:id', auth, controller.deletePost);

router.get('/', controller.getPosts);
router.get('/all', auth, controller.getAllPosts);
router.get('/:id', controller.getPost);

module.exports = router;
