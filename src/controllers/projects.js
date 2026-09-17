// Import any needed model functions
import { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails } from '../models/projects.js';

// Define any controller functions
const showProjectsPage = async (req, res) => {
    NUMBER_OF_UPCOMING_PROJECTS = 5; // Define the number of upcoming projects to display
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Projects';

    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails= await getProjectDetails(projectId);

    const title = projectDetails.title; // Assuming getProjectDetails returns the title as the second element

    res.render('project', { title, projectDetails });
}

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };