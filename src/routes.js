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
        showCategoryDetailsPage 
} from './controllers/categories.js';

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
router.get('/new-organization', showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', processEditOrganizationForm);

// Route for new project page
router.get('/new-project', showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project', projectValidation, processNewProjectForm);

// Route to display the edit organization form
router.get('/edit-project/:id', showEditProjectForm);

// Route to handle the edit organization form submission
router.post('/edit-project/:id', processEditProjectForm);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;