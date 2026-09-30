import bcrypt from 'bcrypt';

import { 
    createUser,
    authenticateUser
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
            minLength: 5,
            minLowercase: 1,
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

//const processUserRegistrationForm =
//async (req, res) => {
//    const results = validationResult(req);
//    if (!results.isEmpty()) {
//        // Validation failed - loop through errors
//        results.array().forEach((error) => {
//            req.flash('error', error.msg);
//        });
//
//        // Redirect back to the new organization form
//        return res.redirect('/register');
//    }
//
//    const { name, email, password } = req.body;
//
//    try {
//        const salt = await bcrypt.genSalt(10);
//        const passwordHash = await bcrypt.hash(password, salt);
//
//        const userId = await createUser(name, email, passwordHash);
//
//        req.flash('success', 'Registration successful! Please log in.')
//        res.redirect('/'); 
//    } catch (error) {
//        if (error.code === '23505' && error.constraint === 'users_email_key') {
//            req.flash('error', 'This e-mail is already in use. Try using another. ');
//            return res.redirect('/register');
//        }
//
//        console.error('Error registering user:', error);
//        req.flash('error', 'An error occurred during registration. Please try again.');
//        return res.redirect('/register');
//    }    
//};

const processUserRegistrationForm =
async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const userId = await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.')
        res.redirect('/'); 
    } catch (error) {
        if (error.code === '23505' && error.constraint === 'users_email_key') {
            req.flash('error', 'This e-mail is already in use. Try using another. ');
            return res.redirect('/register');
        }

        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        return res.redirect('/register');
    }    
};


const showLoginForm = async (req, res) => {
    const title = "Login"
    res.render('login', { title });
}

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            req.session.user = user;
            req.flash('success', `Login successful! Welcome back ${user.name}`)

            if (res.locals.NODE_ENV === 'development') {
                console.log('User authenticated successfully:', user);
            }

            return res.redirect('/')
        } else {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }
    } catch(error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
}

const processLogout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }
    
    req.flash('success', "Logout successful")
    return res.redirect('/login')
}

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

const showDashboard = (req, res) => {
    const user = req.session.user;
    res.render('dashboard', { 
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};

/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * 
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        // User has required role, continue
        next();
    };
};

export {
    showUserRegistrationForm, 
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole
}