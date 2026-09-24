// Import any needed model functions
import { 
    getUpcomingProjects, 
    getProjectDetails,
    createProject,
    updateProject
} from '../models/projects.js';

import { getCategoriesByProjectsId } from '../models/categories.js';

import { getAllOrganizations } from '../models/organizations.js';

import { body, validationResult } from 'express-validator';

// Define validation and sanitization rules for project form
// Define validation rules for project form
const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Project title is required')
        .isLength({min: 3, max: 200})
        .withMessage('Project title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Project description is required')
        .isLength({ max: 1000 })
        .withMessage('Project description cannot exceed 1000 characters'),
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Project location is required')
        .isLength({ max: 200 })
        .withMessage('Project location must be less than 200 characters'),
    body('date')
        .trim()
        .notEmpty()
        .withMessage('Project date is required')
        .isISO8601()
        .withMessage('Date must be a valid date format'),
    body('organization_id')
        .notEmpty()
        .withMessage('Organization Id is required')
        .isInt()
        .withMessage('Organization must be a valid integer')
]

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const NUMBER_OF_UPCOMING_PROJECTS = 5; // Define the number of upcoming projects to display
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Projects';

    res.render('projects', { 
        title, 
        projects 
    });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;

    const projectDetails= await getProjectDetails(projectId);
    const categoriesForProject = await getCategoriesByProjectsId(projectId);

    const title = projectDetails.title; 

    res.render('project', { 
        title, 
        projectDetails, 
        categoriesForProject 
    });
}

const showNewProjectForm = async (req, res) => {
    const allOrganizations = await getAllOrganizations();

    const title = 'Create Project';

    res.render('new-project', { title, allOrganizations })
}

const processNewProjectForm = async (req, res) => {
    // Check for validation errors
    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    const { organization_id, title, description, location, date } = req.body;
 

    try {
        const newProjectId = await createProject(organization_id, title, description, location, date);

        // Set a success flash message
        req.flash('success', 'Project created successfully!');

        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
    
}

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const allOrganizations = await getAllOrganizations();

    const title = 'Edit Project';
    res.render('edit-project', { title, projectDetails, allOrganizations });
}

const processEditProjectForm = async (req, res) => {
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form
        return res.redirect(`/edit-project/${req.params.id}`);
    }

    const projectId = req.params.id;
    const { organization_id, title, description, location, date } = req.body; 

    await updateProject(projectId, organization_id, title, description, location, date);

    // Set a success flash message
    req.flash('success', 'Project updated successfully!');

    res.redirect(`/project/${projectId}`);
}

// Export any controller functions
export { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm, 
    processEditProjectForm, 
    projectValidation
};