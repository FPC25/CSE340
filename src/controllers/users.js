import bcrypt from 'bcrypt';

import {
    getAllUsers,
    createUser,
    authenticateUser
} from '../models/users.js';

const showUserRegistrationForm = async (req, res) => {
    const title = 'Register';

    res.render('register', {title});
};

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

            return res.redirect('/dashboard')
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

const showUserPage = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.render('users', { title: 'Users', users });
    } catch (error) {
        console.error('Error fetching users:', error);
        req.flash('error', 'An error occurred while fetching users.');
        res.redirect('/dashboard');
    }
}

export {
    showUserRegistrationForm, 
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUserPage
}