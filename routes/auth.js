/**
 * 
 * base_url api/auth
 */

const { Router } = require('express');
const { createUser, login, revalidateToken, googleSignIn, getAllUsers } = require('../controllers/auth');

const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');

const router = Router();
/**POST request */
router.post(
    '/create',
    [
        check('name','Name is required').not().isEmpty(),
        check('email','Email must be in mail format').isEmail(),
        check('password','Password is required and min 6 characters').isLength( { min:6 } ),
        validateFields,
    ],
    createUser
)

router.post(
    '/login',
    [
        check('email','Email must be in mail format').isEmail(),
        check('password','Password is required and min 6 characters').isLength( { min:6 } ),
        validateFields
    ],
    login
)

router.post(
    '/googleSignIn',
    [
        check('authCode','Auth Code is Required').not().isEmpty(),
        validateFields
    ],
    googleSignIn
)

/**GET */
router.get(
    '/revalidate',
    validateJWT,
    revalidateToken      
)

router.get(
    '/',
    [
        validateJWT,
        validateFields
    ],
    getAllUsers
)

module.exports = router