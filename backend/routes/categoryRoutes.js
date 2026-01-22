const router = require('express').Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/categoryController');

router.post('/', auth, controller.createCategory);
router.get('/', controller.getCategories);
router.delete('/:id', auth, controller.deleteCategory);

module.exports = router;