const { body } = require('express-validator');
const db = require('./db/queries');

exports.loginValidator = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required!!'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password field is required!')
];

exports.registerValidator = [
    body('firstname')
        .trim()
        .notEmpty().withMessage('First name required!')
        .isLength({
            min: 3,
            max: 15
        }).withMessage('First name must be between 3 and 15 characters'),
    body('lastname')
        .trim()
        .notEmpty().withMessage('Last name required!')
        .isLength({
            min: 3,
            max: 15
        }).withMessage('Last name must be between 3 and 15 characters'),
    body('username')
        .trim()
        .notEmpty().withMessage('Username required')
        .isLength({
                min: 3,
                max: 15
            }).withMessage('Username must be between 3 and 15 characters')
        .custom(async value => {
            const user = await db.userGetByUsername(value);
            if (user) {
                throw Error('Username already in use!!!');
            };
        }),
    body('password')
        .trim()
        .notEmpty().withMessage('Password required')
        .isStrongPassword({
            minLength: 8,
            minUppercase: 1,
            minNumbers:1,
            minSymbols: 0
        }).withMessage('Password must be at least 8 characters and contain at least 1 upper case character, and a number'),
    body('confirm-password')
        .trim()
        .notEmpty().withMessage('password confirmation required')
        .custom((value, { req }) => {
            return value === req.body.password;
        }).withMessage("Password doesn't match!")
];

exports.messageValidator = [
    body('body')
        .trim()
        .notEmpty().withMessage('message body required')
];