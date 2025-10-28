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
const dailySermonValidation = {
    uploadSermon: [
        body('topic')
            .trim()
            .isLength({ max: 50 })
            .isString()
            .withMessage('Enter a valid Topic that dont exceed 50 letters'),
        body('comment')
            .optional()
            .isObject()
            .withMessage('Enter valid comment details'),
        body('sermonComment.comment')
            .optional()
            .isString()
            .isLength({ max: 200 })
            .withMessage('Please try again and enter a commwnt that dont exceed 200 letters'),
        body('SermonComment.createdAt')
            .optional()
            .isDate()
            .withMessage('Enter a valid date'),
        body('content')
            .optional()
            .isString()
            .isLength({ max: 500 })
            .withMessage('enter content of the sermon that donot exceed 500 letters'),
        body('scriptureRef')
            .optional()
            .isString()
            .isLength({ max: 100 })
            .withMessage('Enter a valid scripture reference'),
        body('weekIndentifier')
            .notEmpty()
            .isString()
            .isLength({ max: 50 })
            .withMessage('Enter a valid week indentifier '),
        body('submissionDate')
            .isDate()
            .withMessage('Enter a valid date'),
        body('isSellected')
            .isBoolean()
            .withMessage('Enter a valid boolean value')





    ]
}
const eventValidation = {
    Event: [
        body('title')
            .trim()
            .isLength({ max: 50 })
            .withMessage('Enter a valid title that dont exceed 50 letters'),
        body('description')
            .isLength({ max: 500 })
            .withMessage('Enter a valid description that dont exceed 500 letters'),
        body('date')
            .isDate()
            .withMessage('enter a valid date'),

        body('EventComment')
            .optional()
            .isString()
            .isLength({ max: 200 })
            .withMessage('Please try again and enter a commwnt that dont exceed 200 letters'),
        body('createdAt')
            .optional()
            .isDate()
            .withMessage('Enter a valid date'),
        body('location')
            .trim()
            .isLength({ max: 50, min: 3 })
            .withMessage('Enter a valid location that dont exceed 50 letters'),
        body('photo')
            .optional()
            .isObject()
            .withMessage('Enter valid photo details'),
        body('photo.url')
            .optional()
            .isString()
            .withMessage('Enter valid photo url'),
        body('photo.publicId')
            .optional()
            .isString()
            .withMessage('Enter valid photo publicId'),
        body('photo.alt')
            .optional()
            .isString()
            .withMessage('Enter valid photo alt'),
        body('task')
            .notEmpty()
            .isObject()
            .withMessage('thetask should be valid object'),
        body('task.todo')
            .optional()
            .isLength({ max: 100 })
            .withMessage('Enter a valid todo that dont exceed 100 letters'),
        body('task.completed.time')
            .optional()
            .isDate()
            .withMessage('Enter a valid date'),
        body('task.completed.status')
            .optional()
            .isBoolean()
            .withMessage('Enter a valid boolean value'),
        body('Rsvp')
            .optional()
            .isString()
            .isLength({ max: 50 })
            .withMessage('Enter a valid rsvp that dont exceed 50 letters')







    ]
}
const expenseValidation = {
    create: [
        body('description')
            .notEmpty()
            .isLength({ max: 200 })
            .withMessage('Enter a description that dont execeed 200 letter'),
        body('purpose')
            .notEmpty()
            .isLength({ max: 100 })
            .withMessage('Enter a purpose that dont execeed 100 letter'),
        body('amount')
            .isNumeric()
            .withMessage('Enter a valid Number'),
        body('category')
            .notEmpty()
            .isLength({ max: 50, min: 5 })
            .withMessage('Enter a valid category that dont execeed 50 letter and not less than 5 letters'),
        body('status')
            .optional()
            .isIn(['pending', 'approved', 'rejected'])
            .withMessage('Enter a valid status that dont execeed 50 letter')





    ]
}