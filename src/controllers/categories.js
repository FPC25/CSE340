// Import any needed model functions
import { 
    getAllCategories, 
    getCategoryDetails,
    getCategoriesByProjectsId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} 
from '../models/categories.js';

import { 
    getProjectDetails, 
    getProjectsByCategoryId 
} from '../models/projects.js';

import { body, validationResult } from 'express-validator';

// Define validation and sanitization rules for categories form
const categoryValidation = [
    body('category_name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 100})
        .withMessage('Category name must be between 3 and 100 characters'),   
]

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

    const title = "Assign Categories to the Project";

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

const showCreateCategoryForm = async (req, res) => {
    const title = 'Create a New Category';

    res.render('new-category', { title });
}

const processCreateCategoryForm = async (req, res) => {
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form
        return res.redirect('/new-category');
    }

    const { category_name } = req.body;
    const categoryId = await createCategory(category_name);

    req.flash('success', 'Category created successfully!');

    res.redirect(`/category/${categoryId}`);
}

const showUpdateCategoryForm = async (req, res) => {
    const categoryId = req.params.id;    
    const categoryDetails = await getCategoryDetails(categoryId);

    if (!categoryDetails) {
        const error = new Error('Category not found');
        error.status = 404;
        throw error;
    }

    const title = 'Edit Category';
    res.render('edit-category', { title, categoryDetails });
}

const processUpdateCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form
        return res.redirect(`/edit-category/${categoryId}`);
    }

    const { category_name } = req.body;

    await updateCategory(categoryId, category_name);

    req.flash('success', 'Category updated successfully!');

    res.redirect(`/category/${categoryId}`);
}

// Export any controller functions
export { 
    showCategoriesPage, 
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showCreateCategoryForm,
    processCreateCategoryForm,
    showUpdateCategoryForm,
    processUpdateCategoryForm,
    categoryValidation
};