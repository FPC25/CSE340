import bcrypt from 'bcrypt';

import { 
    createUser 
} from '../models/users.js';

import { body, validationResult } from 'express-validator';

const userValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({max: 100})
        .withMessage("Username must be up to 100 characters"),
    body('email')
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })
        .withMessage('A senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e símbolo'),
    body('passwordConfirmation')
        .isString()
        .withMessage('A confirmação da senha é inválida')
        .bail()
        .notEmpty()
        .withMessage('Confirme sua senha')
        .bail()
        .custom((confirmation, { req }) => confirmation === req.body.password)
        .withMessage('As senhas não coincidem')
]

const showUserRegistrationForm = async (req, res) => {
    const title = 'Register';

    res.render('register', {title});
};

const processUserRegistrationForm =
async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form
        return res.redirect('/register');
    }

    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const userId = await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.')
        res.redirect('/'); 
    } catch (error) {
        if (error.code === '23505' && error.constraint === 'users_email_key') {
            req.flash('error', 'This e-mail is already in use. Try using another.');
            return res.redirect('/register');
        }

        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        return res.redirect('/register');
    }    
};

export {
    showUserRegistrationForm, 
    processUserRegistrationForm, 
    userValidation
}