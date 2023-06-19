const router = require('express').Router();
const bodyparser = require('body-parser');
const check = require('express-validator').check;

const authController = require('../controllers/auth.controller')
const authguard = require('./guards/auth.guard')

router.get('/signup',authguard.notAuth,authController.getSignup)

router.post('/signup',authguard.notAuth,
    bodyparser.urlencoded({extended : true}),
    check('username').not().isEmpty().withMessage('no valid username'),
    check('email').not().isEmpty().withMessage('no valid email').isEmail().withMessage('the input is not email'),
    check('password').not().isEmpty().withMessage('no valid password').isLength({min : 6}).withMessage('the password must be more than 6 character'),
    check('confirme-password').custom((value,{req}) => {
        if (value === req.body.password) return true
        else throw 'passwords dont equal'
    }),
    authController.postSignup
)

router.get('/login',authguard.notAuth,authController.getLogin)

router.post('/login',authguard.notAuth,bodyparser.urlencoded({extended : true}),
    check('email').not().isEmpty().withMessage('no valid email'),
    check('password').not().isEmpty().withMessage('no valid password').isLength({min: 6}),
    authController.postLogin
)

router.post('/logout',authguard.isauth,authController.logout)

module.exports = router