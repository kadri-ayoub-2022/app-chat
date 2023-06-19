const router = require('express').Router();
const bodyParser = require('body-parser').urlencoded({extended:true});

const authGuard = require('./guards/auth.guard');
const friendController = require('../controllers/friend.controller');

//router.post('/add',authGuard.isauth,bodyParser,friendController.add);

router.post('/cancel',authGuard.isauth,bodyParser,friendController.cancel);

router.post('/accept',authGuard.isauth,bodyParser,friendController.accept);

router.post('/reject',authGuard.isauth,bodyParser,friendController.reject);

router.post('/delete',authGuard.isauth,bodyParser,friendController.delete);

module.exports = router;