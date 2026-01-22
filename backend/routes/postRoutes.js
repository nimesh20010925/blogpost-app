const router = require('express').Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const controller = require('../controllers/postController');

router.post('/', auth, upload.single('image'), controller.createPost);
router.put('/:id', auth, upload.single('image'), controller.updatePost);
router.delete('/:id', auth, controller.deletePost);
router.post('/:id/like', controller.likePost);

router.get('/', controller.getPosts);
router.get('/all', controller.getAllPosts);
router.get('/:id', controller.getPost);

module.exports = router;
