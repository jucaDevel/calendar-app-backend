/**
 * base_url api/event
 * 
 */

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validateJWT');
const { check } = require('express-validator');
const { getAllEventsByUser, createEvent, updateEvent, removeEvent } = require('../controllers/calendarEvent');
const { validateUserExist } = require('../helpers/customValidators');
const { isDate } = require('moment');
const { validateFields } = require('../middlewares/validateFields');

const router = Router();

router.use(validateJWT)

/**GET */
router.get(
    '/:userId',
    [
        validateFields
    ],
    getAllEventsByUser
)

/**POST */
router.post(
    '/create',
    [
        check('title','Title is required').not().isEmpty(),
        // check('start').custom(isDate),
        // check('end').custom(isDate),
        check('users','user is required').not().isEmpty(),
        check('users').custom( validateUserExist ),
        validateFields
    ],
    createEvent
)
/**PUT */
router.put(
    '/update/:id',
    [
        validateFields
    ],
    updateEvent
)

router.put(
    '/remove/:id',
    [
        validateFields
    ],
    removeEvent
)
/**DELETE */

module.exports = router