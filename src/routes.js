import express from 'express';

import { showHomePage } from './controllers/index.js';

import { showOrganizationsPage, 
        showOrganizationDetailsPage, 
        showNewOrganizationForm, 
        processNewOrganizationForm,
        showEditOrganizationForm,
        processEditOrganizationForm,
        organizationValidation
} from './controllers/organizations.js';

import { showProjectsPage, 
        showProjectDetailsPage,
        showNewProjectForm,
        processNewProjectForm, 
        showEditProjectForm,
        processEditProjectForm,
        projectValidation
} from './controllers/projects.js';

import { 
        showCategoriesPage, 
        showCategoryDetailsPage,
        showAssignCategoriesForm,
        processAssignCategoriesForm,
        showCreateCategoryForm,
        processCreateCategoryForm,
        showUpdateCategoryForm,
        processUpdateCategoryForm,
        categoryValidation
} from './controllers/categories.js';

import {
        showUserRegistrationForm,
        processUserRegistrationForm,
        showLoginForm,
        processLoginForm,
        processLogout,
        requireRole
} from './controllers/users.js'

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// Route for Home page
router.get('/', showHomePage);

// Route for organizations page
router.get('/organizations', showOrganizationsPage);

// Route for projects page
router.get('/projects', showProjectsPage);

// Route for categories page
router.get('/categories', showCategoriesPage);

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for project details page
router.get('/project/:id', showProjectDetailsPage);

// Route for category details page
router.get('/category/:id', showCategoryDetailsPage);

// Route for new organization page
router.get('/new-organization', requireRole('admin'),showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', requireRole('admin'),organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', requireRole('admin'),showEditOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', requireRole('admin'),organizationValidation,processEditOrganizationForm);

// Route for new project page
router.get('/new-project', requireRole('admin'), showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);

// Route to display the edit organization form
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);

// Route to handle the edit organization form submission
router.post('/edit-project/:id', requireRole('admin'), projectValidation,processEditProjectForm);

// Route for new category page
router.get('/new-category', requireRole('admin'), showCreateCategoryForm);

// Route to handle new category form submission
router.post('/new-category', requireRole('admin'), categoryValidation, processCreateCategoryForm);

// Routes to display the assign categories to project form
router.get('/assign-categories/:id', requireRole('admin'), showAssignCategoriesForm);

// Route to handle the assign categories to project form
router.post('/assign-categories/:id', requireRole('admin'), processAssignCategoriesForm);

// Route to display the edit organization form
router.get('/edit-category/:id', requireRole('admin'), showUpdateCategoryForm);

// Route to handle the edit organization form submission
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processUpdateCategoryForm);

// Route to display the user registration form
router.get('/register', showUserRegistrationForm);

// Route to handle the user registration form submission
router.post('/register', processUserRegistrationForm);

// Route to display the login form
router.get('/login', showLoginForm);

// Route to handle the login form submission
router.post('/login', processLoginForm);

// Route to handle the logout request
router.get('/logout', processLogout);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;