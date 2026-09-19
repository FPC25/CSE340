// Import any needed model functions
import { 
    getUpcomingProjects, 
    getProjectDetails 
} from '../models/projects.js';

import { getCategoriesByProjectsId } from '../models/categories.js';

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

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };