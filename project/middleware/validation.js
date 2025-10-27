const { body, param, query } = require('express-validator')
const userValidation = {
    register: [
        body('firstname')
            .trim()
            .isLength({ max: 20 })
            .matches(/^[a-zA-Z\s]+$/)
            .withMessage('Firstname can only contain letters and space only'),
        body('LastName')
            .trim()
            .notEmpty()
            .isLength({ max: 20 })
            .matches(/^[a-zA-Z\s]+$/)
            .withMessage('Lastname can only contain letters and space only'),
        body('PhoneNumber')
            .trim()
            .isLength({ max: 10 })
            .matches(/^+254[17]\d{8}$/)
            .withMessage('Please provide a valid kenyan valid number'),
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('provide a valid email address'),
        body('password')
            .notEmpty()
            .trim()
            .isLength({ min: 8 })
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .withMessage('password must contain atleast one upperCase letter, one lowercase letter,one number, one special Character'),



    ],
    login: [
        body('email')
            .notEmpty()
            .normalizeEmail()
            .isEmail()
            .withMessage('provide a valid email address'),
        body('password')
            .notEmpty()
            .trim()
            .isLength({ min: 8 })
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .withMessage('password must contain atleast one upperCase letter, one lowercase letter,one number, one special Character')

    ],
    UpdateProfile: [
        body('preference')
            .optional()
            .isObject()
            .withMessage('preference should be an object'),
        body('firstName')
            .optional()
            .trim()
            .isLength({ max: 20 })
            .matches(/^[a-zA-Z\s]+$/)
            .withMessage('firstname should only contain letter'),
        body('LastName')
            .optional()
            .trim()
            .notEmpty()
            .isLength({ max: 20 })
            .matches(/^[a-zA-Z\s]+$/)
            .withMessage('Lastname can only contain letters and space only'),
        body('PhoneNumber')
            .optional()
            .trim()
            .isLength({ max: 10 })
            .matches(/^+254[17]\d{8}$/)
            .withMessage('Please provide a valid kenyan valid number'),
        body('preference.screen')
            .optional()
            .trim(),
        body('preference.notification')
            .optional()
            .isObject()
            .withMessage('user preference should be an object'),
        body('preference.Notification.email')
            .optional()
            .isBoolean()
            .withMessage('email notification preference should be Boolean'),
        body('preference.Notification.push')
            .optional()
            .isBoolean()
            .withMessage('push notification preference should be Boolean'),
        body('adress')
            .optional()
            .isObject()
            .withMessage('Enter a valid  address details'),

        body('adress.city')
            .optional()
            .trim()
            .isLength({ max: 20 })
            .withMessage('enter the name of your city'),
        body('adress.state')
            .optional()
            .trim()
            .isLength({ max: 20 })
            .withMessage('enter the name of your city'),
        body('adress.town')
            .optional()
            .trim()
            .isLength({ max: 20 })
            .withMessage('enter the name of your town'),
        body('adress.country')
            .optional()
            .trim()
            .isLength({ max: 20 })
            .withMessage('enter the name of your country'),
        body('profilePicture')
            .optional()
            .isObject()
            .withMessage('check on your profile picture details'),

        body('Bio')
            .optional()
            .isObject()
            .withMessage('check on your Profile Bio details')







    ],
    changePassword: [
        body('currentPassword')
            .notEmpty()
            .withMessage('Current password is required'),

        body('newPassword')
            .isLength({ min: 8 })
            .withMessage('New password must be at least 8 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    ],



}
const albumValidation = {
    album: [
        body('title')
            .notEmpty()
            .trim()
            .isLength({ max: 50 })
            .withMessage('Enter the Title of the Album and dont execeed 50 letters'),
        body('description')
            .notEmpty()
            .trim()
            .isLength({ max: 200 })
            .withMessage('please provide the descriptionof the Album and it should not exceed 200 word'),
        body('likes')
            .optional()
            .isObject()
            .withMessage(' Try again later'),




    ]
}


const contributionValidation = {
    contribution: [
        body('title')
            .notEmpty()
            .trim()
            .isLength({ max: 50 })
            .withMessage('Enter the title of the contribution and dont exceed 50 letters'),
        body('description')
            .notEmpty()
            .trim()
            .isLength({ max: 200 })
            .withMessage('Enter the description of the contribution and donont exceed 200 letters'),
        body('member')
            .optional()
            .isObject()
            .withMessage('Enter a valid member details'),
        body('member.user')
            .optional()
            .isMongoId()
            .withMessage('Enter a valid user id'),
        body('member.amount')
            .optional()
            .isNumeric()
            .withMessage('Enter a valid amount'),
        body('member.date')
            .optional()
            .isDate()
            .withMessage('Enter a valid date'),
        body('createdAt')
            .optional()
            .isDate()
            .withMessage('Enter a valid date'),



    ]
}