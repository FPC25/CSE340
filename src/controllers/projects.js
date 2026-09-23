// Import any needed model functions
import { 
    getUpcomingProjects, 
    getProjectDetails,
    updateProject
} from '../models/projects.js';

import { getCategoriesByProjectsId } from '../models/categories.js';

import { getAllOrganizations } from '../models/organizations.js';

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
export { showProjectsPage, showProjectDetailsPage, showEditProjectForm, processEditProjectForm };