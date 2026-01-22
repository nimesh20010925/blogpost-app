const router = require('express').Router();
const { createAdmin, login } = require('../controllers/adminController');


// POST /api/admin/login - Admin login
router.post('/login', login);

module.exports = router;
// Create a new admin (POST /api/admin/create)
router.post('/create', createAdmin);