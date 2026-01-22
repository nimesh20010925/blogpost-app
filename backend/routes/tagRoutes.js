const router = require('express').Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/tagController');

router.post('/', auth, controller.createTag);
router.get('/', controller.getTags);
router.delete('/:id', auth, controller.deleteTag);

module.exports = router;