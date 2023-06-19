const router = require('express').Router();

const authGuard = require('./guards/auth.guard');
const profileController = require('../controllers/profile.controller');

router.get('/',authGuard.isauth,profileController.getProfile);
router.get('/:id',authGuard.isauth,profileController.getProfile);

module.exports = router;