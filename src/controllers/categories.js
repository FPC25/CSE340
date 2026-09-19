// Import any needed model functions
import { 
    getAllCategories, 
    getCategoryDetails } 
from '../models/categories.js';

import { getProjectsByCategoryId } from '../models/projects.js';


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

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage };