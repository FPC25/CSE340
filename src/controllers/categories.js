// Import any needed model functions
import { 
    getAllCategories, 
    getCategoryDetails,
    updateCategoryAssignments, 
    getCategoriesByProjectsId
} 
from '../models/categories.js';

import { 
    getProjectDetails, 
    getProjectsByCategoryId 
} from '../models/projects.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { 
        title, 
        categories 
    });
}; 

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    
    const categoryDetails = await getCategoryDetails(categoryId);
    const projectsInCategory = await getProjectsByCategoryId(categoryId);

    const title = categoryDetails.category_name;

    res.render('category', { 
        title, 
        categoryDetails, 
        projectsInCategory 
    });
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.id;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const categoryByProjectId = await getCategoriesByProjectsId(projectId);

    const title = "Assign Categories to Project";

    res.render('assign-categories', { 
        title,
        projectDetails,
        categories,
        categoryByProjectId
    })
}

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.id;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIds = Array.isArray(selectedCategoryIds)
    ? selectedCategoryIds
    : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIds);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
}

// Export any controller functions
export { 
    showCategoriesPage, 
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};